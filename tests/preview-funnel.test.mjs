import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('dedicated offer promises a free design preview, with working intake, booking and crawl signals',async()=>{
 const page=await read('free-website-preview/index.html');
 for(const part of ['I’ll design a new homepage for your business, free.','Full website packages start at CAD $2,500','name="business"','name="request_id"','id="preview-form"','name="details"','michael-mckerracher-dqi15w/30min','rel="canonical"','application/ld+json'])assert.ok(page.includes(part),part);
 assert.equal((page.match(/<h1>/g)||[]).length,1);
 assert.ok(!page.includes('name="robots" content="noindex"'));
 const schema=JSON.parse(page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);const service=schema['@graph'].find(x=>x['@type']==='Service');assert.equal(service.name,'Custom homepage design preview');assert.equal(service.offers.length,1);assert.equal(service.offers[0].price,0);
 assert.ok((await read('sitemap.xml')).includes('https://michaelmck.site/free-website-preview/'));
 assert.ok((await read('llms.txt')).includes('Custom homepage design preview at no charge'));
 for(const file of ['index.html','web-design/index.html','free-website-preview/index.html','free-website-preview/index.md','llms.txt','llms-full.txt','scripts/preview-funnel/board.py','scripts/preview-funnel/board.js'])assert.doesNotMatch(await read(file),/\$?200\s*\/\s*year|free one-page build|\$0 one-page build/i,file);
 const homepage=await read('index.html');assert.equal((homepage.match(/class="preview-invitation"/g)||[]).length,1);
});
test('preview form records success only after delivery provider confirmation and prevents duplicate clicks',async()=>{
 const js=await read('v2/free-website-preview/preview.js');assert.ok(js.includes('sending||complete'));assert.ok(js.includes('response.ok'));assert.ok(js.includes("data.success==='true'"));assert.ok(js.indexOf("generate_lead")>js.indexOf('if(!response.ok'));assert.ok(!js.includes("email:form"));assert.ok(js.includes('form.reset()'));
});
test('private approval pipeline enforces stage, artifact and delivery boundaries',()=>{
 execFileSync('python3',['scripts/preview-funnel/test_board.py'],{cwd:new URL('../',import.meta.url),stdio:'pipe'});
});
