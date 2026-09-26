import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {markdown} from '../scripts/service-discovery.mjs';
const routes=JSON.parse(await readFile('v2/services/routes.json','utf8'));
test('public HTML, Markdown, schema and sitemap stay in sync',async()=>{
 const sitemap=await readFile('sitemap.xml','utf8');
 for(const route of routes){
 const html=await readFile('.'+route+'index.html','utf8');
 const md=await readFile('.'+route+'index.md','utf8');
 assert.equal(md,`Source: https://michaelmck.site${route}\n\n${markdown(html)}`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert(schema['@graph'].some(x=>x.url==='https://michaelmck.site'+route));
 assert(sitemap.includes(`<loc>https://michaelmck.site${route}</loc>`));
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 for(const [,url] of html.matchAll(/(?:href|src|poster)="(\/[^"#]*)"/g))await access('.'+url+(url.endsWith('/')?'index.html':''));
 }
});
test('design proof uses approved previews, before local service proof',async()=>{
 const web=await readFile('web-design/index.html','utf8');
 assert(!web.includes('treehouse-live'));assert(web.indexOf('data-service-preview')<web.indexOf('rccv-showcase'));assert(web.indexOf('rccv-showcase')<web.indexOf('cool-runnings-home'));
});
test('Markdown requests have explicit routes and response type',async()=>{
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 for(const r of routes)assert(config.rewrites.some(x=>x.source===r&&x.destination===r+'index.md'&&x.has[0].value==='text/markdown'));
 assert(config.headers.some(x=>x.headers.some(h=>h.value==='text/markdown; charset=utf-8')));
});
