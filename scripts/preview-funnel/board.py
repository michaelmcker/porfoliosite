#!/usr/bin/env python3
"""Private, local preview pipeline. Owner approvals are available only in the board UI."""
import argparse, contextlib, hashlib, hmac, json, mimetypes, os, re, secrets, shutil, sqlite3, sys, time
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote
DATA=Path(os.environ.get('PREVIEW_FUNNEL_DATA',str(Path.home()/'Business Research/website-preview-funnel'))).resolve()
STAGES=['new','designing','design_review','build_ready','building','build_review','publish_ready','publishing','delivery_review','send_ready','sending','sent','needs_attention','archived']
WORK={'design':('new','designing','design_review'),'build':('build_ready','building','build_review'),'publish':('publish_ready','publishing','delivery_review'),'send':('send_ready','sending','sent')}
ALLOWED={'.html','.css','.png','.jpg','.jpeg','.webp','.svg','.woff2','.ico','.avif','.gif'}
def now():return int(time.time())
def digest(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def setup():
 DATA.mkdir(parents=True,exist_ok=True);os.chmod(DATA,0o700)
 with db() as c:c.executescript('CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,source TEXT UNIQUE,request_id TEXT UNIQUE,stage TEXT NOT NULL,created INTEGER,updated INTEGER,version INTEGER,body TEXT);CREATE TABLE IF NOT EXISTS events(seq INTEGER PRIMARY KEY AUTOINCREMENT,lead TEXT,at INTEGER,actor TEXT,event TEXT,detail TEXT);')
@contextlib.contextmanager
def db():
 c=sqlite3.connect(DATA/'board.sqlite',timeout=20);c.row_factory=sqlite3.Row
 try:
  c.execute('PRAGMA foreign_keys=ON');c.execute('BEGIN IMMEDIATE');yield c;c.commit()
 except: c.rollback();raise
 finally:c.close()
def event(c,id,actor,name,detail=''):c.execute('INSERT INTO events(lead,at,actor,event,detail)VALUES(?,?,?,?,?)',(id,now(),actor,name,str(detail)[:4000]))
def unpack(row):
 if not row:raise ValueError('Request not found')
 d=dict(row);d.update(json.loads(d.pop('body')));return d
def get(c,id):return unpack(c.execute('SELECT * FROM leads WHERE id=?',(id,)).fetchone())
def save(c,d,actor,name):
 d['updated']=now();d['version']+=1
 fields={k:v for k,v in d.items() if k not in ('id','source','request_id','stage','created','updated','version')}
 c.execute('UPDATE leads SET stage=?,updated=?,version=?,body=? WHERE id=?',(d['stage'],d['updated'],d['version'],json.dumps(fields),d['id']));event(c,d['id'],actor,name)
def listing():
 with db() as c:
  rows=[unpack(r) for r in c.execute('SELECT * FROM leads ORDER BY created DESC')]
  for r in rows:
   # Recover expired work visibly rather than repeating a potentially side-effecting action.
   if r.get('lease',{}).get('expires',now()+1)<now() and r['stage'] in [x[1] for x in WORK.values()]:
    r['failed_kind']=r['lease']['kind'];r['error']='Worker lease expired. Review before retrying.';r['stage']='needs_attention';r.pop('lease',None);save(c,r,'system','lease expired')
  return rows
def public_record(d):
 d=json.loads(json.dumps(d));d.pop('lease',None)
 d['events']=[]
 with db() as c:d['events']=[dict(x) for x in c.execute('SELECT at,actor,event,detail FROM events WHERE lead=? ORDER BY seq DESC LIMIT 30',(d['id'],))]
 for kind in ['design','build']:
  a=d.get(kind)
  if a:a['url']='/artifact/'+d['id']+'/'+kind+'/'+('index.html' if kind=='build' else Path(a['path']).name)
 return d
def import_lead(payload):
 f=payload['fields'];source=str(payload['source_message_id']);rid=str(f.get('request_id') or source)
 if len(source)>200 or len(rid)>200:raise ValueError('Invalid source id')
 email=str(f.get('email','')).strip()
 if not re.fullmatch(r'[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+',email):raise ValueError('A valid reply email is required')
 for name in ('name','business','city','details'):
  if not str(f.get(name,'')).strip():raise ValueError('Missing '+name)
 allowed=['name','business','city','details','website','goal','package','timeline','email','attribution','submitted_at']
 fields={k:str(f.get(k,''))[:6000] for k in allowed};fields['email']=email
 with db() as c:
  existing=c.execute('SELECT * FROM leads WHERE source=? OR request_id=?',(source,rid)).fetchone()
  if existing:return {'duplicate':True,'lead':unpack(existing)}
  id=secrets.token_hex(10);body={'fields':fields,'notes':[],'revision':1}
  c.execute('INSERT INTO leads VALUES(?,?,?,?,?,?,?,?)',(id,source,rid,'new',now(),now(),1,json.dumps(body)));event(c,id,'inbox','intake received')
  (DATA/'requests'/id).mkdir(parents=True,exist_ok=True)
  return {'duplicate':False,'lead':get(c,id)}
def manifest(folder):
 folder=Path(folder).resolve();files={}
 if not(folder/'index.html').is_file():raise ValueError('Build needs index.html')
 for p in sorted(folder.rglob('*')):
  if p.is_symlink():raise ValueError('Symlinks are not allowed')
  if p.is_file():
   rel=p.relative_to(folder)
   if any(x.startswith('.') for x in rel.parts) or p.suffix.lower() not in ALLOWED:raise ValueError('Only public static assets allowed: '+str(rel))
   if p.stat().st_size>15_000_000:raise ValueError('Asset too large')
   files[str(rel)]=digest(p)
 if len(files)>100 or sum(p.stat().st_size for p in folder.rglob('*') if p.is_file())>30_000_000:raise ValueError('Preview exceeds size limit')
 html=(folder/'index.html').read_text()
 if not re.search(r'<meta\s+name=["\']robots["\'][^>]*content=["\'][^"\']*noindex',html,re.I):raise ValueError('Preview must include noindex')
 # Preview output is deliberately static. No submitted forms or executable page code.
 for p in folder.rglob('*'):
  if p.is_file() and p.suffix.lower() in ('.html','.svg'):
   content=p.read_text()
   if re.search(r'<(?:script|iframe|object|embed)\b|\son[a-z]+\s*=|javascript:|<form\b',content,re.I):raise ValueError('Preview contains executable or submitting content')
 return hashlib.sha256(json.dumps(files,sort_keys=True).encode()).hexdigest(),files

def verify_approval(d,kind):
 if kind=='build':
  a=d.get('design');key='design'
  actual=digest(a['path']) if a else ''
 elif kind in ('publish','send'):
  a=d.get('build');key='build';actual=manifest(a['path'])[0] if a else ''
 else:return
 if not a or d.get('approvals',{}).get(key)!=actual:raise ValueError('Approved artifact changed or approval missing')
 if kind=='send':
  body=delivery(d)
  if d.get('approvals',{}).get('delivery')!=hashlib.sha256(json.dumps(body,sort_keys=True).encode()).hexdigest():raise ValueError('Delivery approval no longer matches')
def claim(id,kind):
 if kind not in WORK:raise ValueError('Unknown work type')
 with db() as c:
  d=get(c,id)
  if d['stage']!=WORK[kind][0]:raise ValueError('This stage is not ready')
  verify_approval(d,kind)
  if kind=='design':
   count=c.execute("SELECT count(*) FROM events WHERE event='claim design' AND at>?",(now()-86400,)).fetchone()[0]
   if count>=5:raise ValueError('Daily design limit reached (5). Leave intake queued.')
  d['stage']=WORK[kind][1];d['lease']={'token':secrets.token_hex(24),'expires':now()+3600,'kind':kind};save(c,d,'worker','claim '+kind);return d

def working(c,id,token,verify=True):
 d=get(c,id);lease=d.get('lease',{})
 if not hmac.compare_digest(lease.get('token',''),token) or lease.get('expires',0)<now():raise ValueError('No current worker lease')
 kind=lease['kind']
 if d['stage']!=WORK[kind][1]:raise ValueError('Stage changed')
 if verify:verify_approval(d,kind)
 return d,kind

def complete(id,token,payload):
 with db() as c:
  d,kind=working(c,id,token);folder=DATA/'requests'/id;rev=d['revision']
  if kind=='design':
   source=Path(payload['path']).resolve()
   if source.suffix.lower() not in {'.png','.jpg','.jpeg','.webp'} or source.stat().st_size>20_000_000:raise ValueError('Design must be a raster image under 20 MB')
   raw=source.read_bytes()
   if not(raw.startswith(b'\x89PNG') or raw.startswith(b'\xff\xd8') or raw[8:12]==b'WEBP'):raise ValueError('Image bytes do not match a supported raster')
   target=folder/('design-r'+str(rev)+source.suffix.lower());shutil.copyfile(source,target)
   d['design']={'path':str(target),'sha256':digest(target),'assessment':str(payload.get('assessment',''))[:10000],'sources':payload.get('sources',[]),'prompt':str(payload.get('prompt',''))[:15000]}
  elif kind=='build':
   source=Path(payload['path']).resolve();hash,files=manifest(source)
   qa=payload.get('qa',{})
   if not all(qa.get(x) for x in ('mobile','desktop','links','no_private_data','source_fidelity')):raise ValueError('Required build QA incomplete')
   target=folder/('build-r'+str(rev))
   if target.exists():raise ValueError('Build revision already exists; request a new revision')
   shutil.copytree(source,target);d['build']={'path':str(target),'sha256':hash,'files':files,'qa':qa}
  elif kind=='publish':
   expected='https://michaelmck.site/previews/'+id+'/'
   if payload.get('url')!=expected or not re.fullmatch('[0-9a-f]{40}',payload.get('commit','')) or not payload.get('verified'):raise ValueError('Verified deployment evidence required')
   d['published']={'url':expected,'commit':payload['commit'],'verified_at':now(),'build_sha256':d['build']['sha256']}
  elif kind=='send':
   if not re.fullmatch('[a-zA-Z0-9_-]{8,200}',payload.get('message_id','')):raise ValueError('Real delivery message ID required')
   d['sent']={'message_id':payload['message_id'],'at':now(),'to':d['fields']['email']}
  d['stage']=WORK[kind][2];d.pop('lease',None);d.pop('error',None);save(c,d,'worker',kind+' complete');return d

def delivery(d):
 name=d['fields']['name'].split(' ')[0];url=d.get('published',{}).get('url','')
 return {'to':d['fields']['email'],'subject':'Your homepage preview — '+d['fields']['business'], 'text':f"Hi {name},\n\nYour homepage preview is ready:\n{url}\n\nHave a look and let me know what you think. We can talk through the direction and any changes on a free 30-minute call:\nhttps://cal.com/michael-mckerracher-dqi15w/30min\n\nThe one-page build is free, with hosting and minor updates at CAD $200/year. Full websites start at CAD $2,500. There is no obligation to go ahead.\n\nMichael McKerracher\nmichaelmck.site"}

def approve_action(id,action,version,note):
 with db() as c:
  d=get(c,id)
  if d['version']!=version:raise ValueError('This request changed. Refresh and review the latest version.')
  d.setdefault('approvals',{})
  if action=='approve_design' and d['stage']=='design_review':
   d['approvals']['design']=digest(d['design']['path']);d['stage']='build_ready'
  elif action=='approve_build' and d['stage']=='build_review':
   verify_approval(d,'build');d['approvals']['build']=manifest(d['build']['path'])[0];d['stage']='publish_ready'
  elif action=='approve_send' and d['stage']=='delivery_review':
   verify_approval(d,'publish')
   if d['published']['build_sha256']!=d['approvals']['build']:raise ValueError('Published build differs from approved build')
   d['approvals']['delivery']=hashlib.sha256(json.dumps(delivery(d),sort_keys=True).encode()).hexdigest();d['stage']='send_ready'
  elif action=='revise' and d['stage'] in ('design_review','build_review'):
   if not note.strip():raise ValueError('Add what needs to change')
   d['revision']+=1;d['notes'].append({'at':now(),'text':note[:4000]});d['stage']='new' if d['stage']=='design_review' else 'build_ready'
   if d['stage']=='new':d['approvals']={};d.pop('design',None)
   else:d['approvals'].pop('build',None)
   d.pop('build',None)
  elif action=='retry' and d['stage']=='needs_attention':
   if d.get('failed_kind') in ('publish','send') and not note.strip():raise ValueError('Confirm you checked for a completed deployment or sent email before retrying')
   if note.strip():d['notes'].append({'at':now(),'text':note[:4000]})
   d['stage']=WORK[d['failed_kind']][0];d.pop('error',None)
  elif action=='archive' and d['stage'] not in ('designing','building','publishing','sending','archived'):
   d['restore_stage']=d['stage'];d['stage']='archived'
  elif action=='restore' and d['stage']=='archived':d['stage']=d.pop('restore_stage','new')
  else:raise ValueError('Action is not available at this stage')
  save(c,d,'owner',action);return d

def fail(id,token,message):
 with db() as c:
  d,kind=working(c,id,token,verify=False);d['stage']='needs_attention';d['failed_kind']=kind;d['error']=message[:3000];d.pop('lease',None);save(c,d,'worker','needs attention');return d

def serve(port):
 csrf=secrets.token_hex(32);origins={f'http://127.0.0.1:{port}',f'http://localhost:{port}'};hosts={x.split('//')[1] for x in origins}
 class Handler(BaseHTTPRequestHandler):
  def log_message(self,*args):pass
  def respond(self,code,body,ctype='application/json',extra=None):
   if not isinstance(body,bytes):body=(json.dumps(body) if ctype=='application/json' else body).encode()
   self.send_response(code);self.send_header('Content-Type',ctype);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.send_header('X-Frame-Options','SAMEORIGIN');self.send_header('Referrer-Policy','no-referrer')
   for k,v in (extra or {}).items():self.send_header(k,v)
   self.end_headers();self.wfile.write(body)
  def safehost(self):
   if self.headers.get('Host') not in hosts:self.respond(403,{'error':'Loopback host required'});return False
   return True
  def do_GET(self):
   if not self.safehost():return
   path=unquote(urlparse(self.path).path)
   try:
    if path=='/api/board':return self.respond(200,{'csrf':csrf,'stages':STAGES,'leads':[public_record(x) for x in listing()]})
    if path.startswith('/artifact/'):
     _,_,id,kind,*parts=path.split('/')
     if kind not in ('design','build'):raise ValueError('Unknown artifact')
     with db() as c:d=get(c,id)
     a=d.get(kind)
     if not a:raise ValueError('No artifact')
     base=Path(a['path']).resolve();base=base.parent if kind=='design' else base
     target=(base/('/'.join(parts))).resolve()
     if not target.is_relative_to(base) or not target.is_file() or (kind=='design' and str(target)!=a['path']):raise ValueError('Invalid artifact path')
     ctype=mimetypes.guess_type(target)[0] or 'application/octet-stream'
     return self.respond(200,target.read_bytes(),ctype,{'Content-Security-Policy':"sandbox; default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; form-action 'none'; base-uri 'none'"})
    if path in ('/','/board.js','/board.css'):
     name={'/':'board.html'}.get(path,path[1:]);content=(Path(__file__).parent/name).read_bytes()
     return self.respond(200,content,mimetypes.guess_type(name)[0] or 'text/plain',{'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"})
    self.respond(404,{'error':'Not found'})
   except (ValueError,KeyError,FileNotFoundError):self.respond(404,{'error':'Not found'})
  def do_POST(self):
   if not self.safehost():return
   if self.headers.get('Origin') not in origins or not hmac.compare_digest(self.headers.get('X-CSRF-Token',''),csrf):return self.respond(403,{'error':'Open the board to review this action'})
   if self.path!='/api/action':return self.respond(404,{'error':'Not found'})
   try:
    size=int(self.headers.get('Content-Length','0'))
    if size<1 or size>10000:raise ValueError('Invalid request size')
    b=json.loads(self.rfile.read(size));r=approve_action(b['id'],b['action'],int(b['version']),str(b.get('note','')));self.respond(200,public_record(r))
   except (ValueError,KeyError) as e:self.respond(409,{'error':str(e)})
 print(f'Private preview board: http://127.0.0.1:{port}',flush=True);ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()

def main():
 parser=argparse.ArgumentParser();parser.add_argument('command',choices=['serve','list','import','claim','complete','fail','delivery','get']);parser.add_argument('--id');parser.add_argument('--kind',choices=list(WORK));parser.add_argument('--token');parser.add_argument('--file');parser.add_argument('--message');parser.add_argument('--port',type=int,default=8854);args=parser.parse_args();setup()
 if args.command=='serve':return serve(args.port)
 if args.command=='list':r=listing()
 elif args.command=='import':r=import_lead(json.loads(Path(args.file).read_text()))
 elif args.command=='claim':r=claim(args.id,args.kind)
 elif args.command=='complete':r=complete(args.id,args.token,json.loads(Path(args.file).read_text()))
 elif args.command=='fail':r=fail(args.id,args.token,args.message)
 else:
  with db() as c:r=get(c,args.id)
  if args.command=='delivery':verify_approval(r,'publish');r=delivery(r)
 print(json.dumps(r,indent=2))
if __name__=='__main__':
 try:main()
 except Exception as e:print(json.dumps({'error':str(e)}),file=sys.stderr);sys.exit(1)
