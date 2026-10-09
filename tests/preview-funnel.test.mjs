import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('dedicated offer has consistent pricing, working intake, booking and crawl signals',async()=>{
 const page=await read('free-website-preview/index.html');
 for(const part of ['CAD $200/year','Hosting and minor updates included','Full websites from $2,500','name="business"','name="request_id"','id="preview-form"','name="details"','michael-mckerracher-dqi15w/30min','rel="canonical"','application/ld+json'])assert.ok(page.includes(part),part);
 assert.equal((page.match(/<h1>/g)||[]).length,1);
 assert.ok(!page.includes('name="robots" content="noindex"'));
 const schema=JSON.parse(page.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);assert.equal(schema['@graph'].find(x=>x['@type']==='Service').offers[1].price,200);
 assert.ok((await read('sitemap.xml')).includes('https://michaelmck.site/free-website-preview/'));
 assert.ok((await read('llms.txt')).includes('CAD 200/year'));
 const homepage=await read('index.html');assert.equal((homepage.match(/class="preview-invitation"/g)||[]).length,1);
});
test('preview form records success only after delivery provider confirmation and prevents duplicate clicks',async()=>{
 const js=await read('v2/free-website-preview/preview.js');assert.ok(js.includes('sending||complete'));assert.ok(js.includes('response.ok'));assert.ok(js.includes("data.success==='true'"));assert.ok(js.indexOf("generate_lead")>js.indexOf('if(!response.ok'));assert.ok(!js.includes("email:form"));assert.ok(js.includes('form.reset()'));
});
test('private approval pipeline enforces stage, artifact and delivery boundaries',()=>{
 execFileSync('python3',['scripts/preview-funnel/test_board.py'],{cwd:new URL('../',import.meta.url),stdio:'pipe'});
});
