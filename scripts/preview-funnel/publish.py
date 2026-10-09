#!/usr/bin/env python3
"""Publish only an owner-approved static preview through the existing GitHub/Vercel project."""
import argparse,base64,json,subprocess,urllib.request,urllib.parse
from pathlib import Path
import board
REPO='michaelmcker/porfoliosite'
def gh(path,payload=None,method=None):
 cmd=['/opt/homebrew/bin/gh','api','repos/'+REPO+'/'+path]
 if method:cmd+=['--method',method]
 if payload is not None:cmd+=['--input','-']
 p=subprocess.run(cmd,input=json.dumps(payload) if payload is not None else None,text=True,capture_output=True,timeout=90)
 if p.returncode:raise RuntimeError(p.stderr[:1500])
 return json.loads(p.stdout)
def run(id,token,verify=False):
 board.setup()
 with board.db() as c:d,kind=board.working(c,id,token)
 if kind!='publish':raise ValueError('A current publish lease is required')
 folder=Path(d['build']['path']);artifact_hash,files=board.manifest(folder)
 if artifact_hash!=d['approvals']['build']:raise ValueError('Build differs from approval')
 evidence=board.DATA/'requests'/id/'publication.json'
 saved=json.loads(evidence.read_text()) if evidence.exists() else None
 if saved and saved['artifact_hash']!=artifact_hash:raise ValueError('Prior publication exists for different content; review manually')
 if verify:
  if not saved:raise ValueError('No publication recorded')
  status=gh('commits/'+saved['commit']+'/status')
  if status['state']!='success':raise ValueError('Deployment not yet successful: '+status['state'])
  for name,sha in files.items():
   url=saved['url']+urllib.parse.quote(name)
   with urllib.request.urlopen(url,timeout=30) as response:
    body=response.read();headers=response.headers
   if board.hashlib.sha256(body).hexdigest()!=sha:raise ValueError('Live file differs: '+name)
   if name=='index.html' and 'noindex' not in headers.get('X-Robots-Tag',''):raise ValueError('Preview noindex header missing')
  return board.complete(id,token,{'url':saved['url'],'commit':saved['commit'],'verified':True})
 if saved:
  comparison=gh('compare/'+saved['commit']+'...main')
  if comparison.get('status') in ('ahead','identical'):
   return saved
  raise ValueError('Recorded commit is not on main. Inspect publication.json before retrying; do not create another preview.')
 main=gh('git/ref/heads/main')['object']['sha'];base=gh('git/commits/'+main)['tree']['sha'];tree=[]
 for name in files:
  blob=gh('git/blobs',{'content':base64.b64encode((folder/name).read_bytes()).decode(),'encoding':'base64'})
  tree.append({'path':name,'mode':'100644','type':'blob','sha':blob['sha']})
 subtree=gh('git/trees',{'tree':tree})['sha']
 root=gh('git/trees',{'base_tree':base,'tree':[{'path':'previews/'+id,'mode':'040000','type':'tree','sha':subtree}]})['sha']
 commit=gh('git/commits',{'message':'Publish approved homepage preview '+id,'tree':root,'parents':[main]})['sha']
 saved={'commit':commit,'artifact_hash':artifact_hash,'url':'https://michaelmck.site/previews/'+id+'/','created':board.now(),'parent':main}
 evidence.write_text(json.dumps(saved,indent=2))
 # No force update: concurrent site work must never be overwritten.
 gh('git/refs/heads/main',{'sha':commit,'force':False},'PATCH')
 return saved
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--id',required=True);parser.add_argument('--token',required=True);parser.add_argument('--verify',action='store_true');a=parser.parse_args()
 try:print(json.dumps(run(a.id,a.token,a.verify),indent=2))
 except Exception as e:print(json.dumps({'error':str(e)}));raise SystemExit(1)
