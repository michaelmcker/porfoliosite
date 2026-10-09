import importlib.util,json,os,subprocess,tempfile,unittest,base64,sys
sys.path.insert(0,str(__import__("pathlib").Path(__file__).parent))
import import_email
from pathlib import Path
spec=importlib.util.spec_from_file_location('board',Path(__file__).with_name('board.py'));b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
class Pipeline(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();b.DATA=Path(self.tmp.name);b.setup()
  self.payload={'source_message_id':'gmail-12345678','fields':{'request_id':'request-1','name':'Owner','email':'owner@example.com','business':'Example','city':'Kelowna','details':'A customer-focused homepage.'}}
  self.id=b.import_lead(self.payload)['lead']['id']
 def tearDown(self):self.tmp.cleanup()
 def current(self):
  with b.db() as c:return b.get(c,self.id)
 def image(self):
  path=b.DATA/'design.png';path.write_bytes(base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZxkAAAAASUVORK5CYII='));return path
 def design(self):
  d=b.claim(self.id,'design');return b.complete(self.id,d['lease']['token'],{'path':str(self.image()),'assessment':'Source-led design'})
 def owner(self,action,note=''):
  d=self.current();return b.approve_action(self.id,action,d['version'],note)
 def build(self):
  self.design();self.owner('approve_design');d=b.claim(self.id,'build');p=b.DATA/'static';p.mkdir();(p/'index.html').write_text('<meta name="robots" content="noindex, nofollow"><h1>Business</h1>');qa={x:'evidence' for x in ('mobile','desktop','links','no_private_data','source_fidelity')};return b.complete(self.id,d['lease']['token'],{'path':str(p),'qa':qa})
 def test_dedup_and_missing_email(self):
  self.assertTrue(b.import_lead(self.payload)['duplicate']);copy=json.loads(json.dumps(self.payload));copy['source_message_id']='retry';self.assertTrue(b.import_lead(copy)['duplicate']);copy['fields']['email']='no';self.assertRaises(ValueError,b.import_lead,copy)
 def test_no_build_before_design_approval(self):
  self.assertRaises(ValueError,b.claim,self.id,'build');self.design();self.assertRaises(ValueError,b.claim,self.id,'build');self.owner('approve_design');self.assertEqual(b.claim(self.id,'build')['stage'],'building')
 def test_no_double_claim_or_stale_approval(self):
  start=self.current()['version'];self.design();self.assertRaises(ValueError,b.claim,self.id,'design');self.assertRaises(ValueError,b.approve_action,self.id,'approve_design',start,'')
 def test_artifact_change_invalidates_approval(self):
  self.design();self.owner('approve_design');Path(self.current()['design']['path']).write_bytes(b'changed');self.assertRaises(ValueError,b.claim,self.id,'build')
 def test_revision_keeps_history(self):
  d=self.design();self.assertRaises(ValueError,self.owner,'revise');self.owner('revise','Use the real logo');self.assertEqual(self.current()['revision'],2);self.assertTrue(Path(d['design']['path']).exists());self.assertEqual(self.current()['stage'],'new')
 def test_publish_and_send_require_separate_approvals(self):
  self.build();self.assertRaises(ValueError,b.claim,self.id,'publish');self.owner('approve_build');d=b.claim(self.id,'publish');self.assertRaises(ValueError,b.complete,self.id,d['lease']['token'],{'url':'https://evil.example','verified':True,'commit':'a'*40});b.complete(self.id,d['lease']['token'],{'url':'https://michaelmck.site/previews/'+self.id+'/','verified':True,'commit':'a'*40});self.assertRaises(ValueError,b.claim,self.id,'send');self.owner('approve_send');sent=b.claim(self.id,'send');b.complete(self.id,sent['lease']['token'],{'message_id':'gmail-real-123'});self.assertEqual(self.current()['stage'],'sent');self.assertRaises(ValueError,b.claim,self.id,'send')
 def test_expired_lease_requires_owner_retry(self):
  b.claim(self.id,'design')
  with b.db() as c:
   d=b.get(c,self.id);d['lease']['expires']=0;b.save(c,d,'test','expired')
  self.assertEqual(b.listing()[0]['stage'],'needs_attention');self.assertRaises(ValueError,b.claim,self.id,'design');self.owner('retry');self.assertEqual(self.current()['stage'],'new')
 def test_build_requires_noindex_and_no_private_files(self):
  p=b.DATA/'site';p.mkdir();(p/'index.html').write_text('<h1>Hello</h1>');self.assertRaises(ValueError,b.manifest,p);(p/'index.html').write_text('<meta name="robots" content="noindex">');(p/'.env').write_text('private');self.assertRaises(ValueError,b.manifest,p);(p/'.env').unlink();b.manifest(p)
 def test_authenticated_email_parser(self):
  message={'id':'message-123','payload':{'mime_type':'text/html','headers':[{'name':'From','value':'FormSubmit <submissions@formsubmit.co>'},{'name':'Subject','value':'Homepage preview request · michaelmck.site'},{'name':'Authentication-Results','value':'mx.google.com; dkim=pass header.i=@formsubmit.co header.s=mail;'}],'body':{'content':'<table><tr><td><strong>business</strong></td><td><pre>A &amp; B</pre></td></tr></table>'}}}
  self.assertEqual(import_email.parse(message)['fields']['business'],'A & B')
  message['payload']['headers'].pop();self.assertRaises(ValueError,import_email.parse,message)
 def test_static_build_blocks_executable_content(self):
  p=b.DATA/'site';p.mkdir();(p/'index.html').write_text('<meta name="robots" content="noindex"><script>alert(1)</script>');self.assertRaises(ValueError,b.manifest,p)
 def test_archive_restore(self):
  self.owner('archive');self.assertEqual(self.current()['stage'],'archived');self.owner('restore');self.assertEqual(self.current()['stage'],'new')
if __name__=='__main__':unittest.main()
