#!/usr/bin/env python3
"""Parse the authenticated FormSubmit table from a saved Gmail full response."""
import argparse,json,re
from html.parser import HTMLParser
from pathlib import Path
from email.utils import parseaddr
import board
class Fields(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.rows=[];self.cells=[];self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='tr':self.cells=[]
  if tag=='td':self.cell=[]
  if tag=='br' and self.cell is not None:self.cell.append('\n')
 def handle_data(self,data):
  if self.cell is not None:self.cell.append(data)
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.cells.append(''.join(self.cell).strip());self.cell=None
  if tag=='tr' and len(self.cells)==2:self.rows.append(tuple(self.cells))
def parse(message):
 message=message.get('structuredContent',message);payload=message['payload'];headers={h['name'].lower():h['value'] for h in payload.get('headers',[])}
 if parseaddr(headers.get('from',''))[1].lower()!='submissions@formsubmit.co':raise ValueError('Not the FormSubmit sender')
 if headers.get('subject')!='Homepage preview request · michaelmck.site':raise ValueError('Not a preview request')
 auth=headers.get('authentication-results','')
 if not re.search(r'dkim=pass[^;]*header\.i=@formsubmit\.co\b',auth):raise ValueError('FormSubmit DKIM was not verified by Gmail')
 def parts(p):
  if p.get('mime_type')=='text/html' and p.get('body',{}).get('content'):yield p['body']['content']
  for child in p.get('parts') or []:yield from parts(child)
 fields={}
 for html in parts(payload):
  parser=Fields();parser.feed(html)
  for key,value in parser.rows:
   if key in fields:raise ValueError('Duplicate field label; manual review required')
   fields[key]=value
 if not fields:raise ValueError('No FormSubmit field table found')
 return {'source_message_id':message['id'],'fields':fields}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--file',required=True);a=p.parse_args();board.setup()
 try:result=board.import_lead(parse(json.loads(Path(a.file).read_text())));print(json.dumps({'duplicate':result['duplicate'],'id':result['lead']['id'],'stage':result['lead']['stage']},indent=2))
 except Exception as e:print(json.dumps({'error':str(e)}));raise SystemExit(1)
