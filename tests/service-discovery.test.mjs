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
 for(const [,url] of html.matchAll(/(?:href|src|poster)="(\/[^"#]*)"/g))await access('.'+url.split('?')[0]+(url.endsWith('/')?'index.html':''));
 }
});
test('service proof uses original project media without nested interactive viewers',async()=>{
 const web=await readFile('web-design/index.html','utf8');
 const ai=await readFile('ai-implementation/index.html','utf8');
 const marketing=await readFile('marketing-branding/index.html','utf8');
 assert(web.includes('laptop-three-quarter-rccv-cutout.webp'));
 assert(web.includes('okanagan-preview/assets/overview-final.webp'));
 assert(!web.includes('treehouse-live'));
 assert(!web.includes('data-accommodation-page'));
 assert(!web.includes('rccv-showcase'));
 assert(!web.includes('st-james-film'));
 assert(web.includes('ai-catalyst-wheat.vercel.app'));
 assert(ai.includes('booking-calendar'));
 assert.equal((ai.match(/class="calendar-day(?: |")/g)||[]).length,35);
 assert(ai.includes('I build the system.'));
 assert(!ai.includes('<details class="service-workflow"'));
 assert(marketing.includes('Explaining a misunderstood medium.'));
 assert(!marketing.includes('Make the opportunity clear.'));
 assert(!marketing.includes('vertical-impression-why-elevators.png'));
 assert(marketing.includes('/assets/videos/vertical-impression-proposal-story-boomerang.mp4'));
 assert(marketing.includes('/assets/selected-work/ai-catalyst-film.mp4'));
 assert(marketing.includes('/assets/selected-work/upon-this-rock-episode-01.webp'));
 await access('assets/videos/vertical-impression-proposal-story-boomerang.mp4');
 await access('assets/selected-work/ai-catalyst-film.mp4');
});
test('Markdown requests have explicit routes and response type',async()=>{
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 for(const r of routes)assert(config.rewrites.some(x=>x.source===r&&x.destination===r+'index.md'&&x.has[0].value==='text/markdown'));
 assert(config.headers.some(x=>x.headers.some(h=>h.value==='text/markdown; charset=utf-8')));
});
