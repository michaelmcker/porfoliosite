import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {markdown} from '../scripts/service-discovery.mjs';
import {webDesignFaqs} from '../scripts/web-design-content.mjs';
const routes=JSON.parse(await readFile('v2/services/routes.json','utf8'));
test('website FAQs, agent text and authored sitemap modification date agree',async()=>{
 const html=await readFile('web-design/index.html','utf8');
 const md=await readFile('web-design/index.md','utf8');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const faq=graph.find(item=>item['@type']==='FAQPage');
 assert.equal(faq.mainEntity.length,webDesignFaqs.length);
 for(const [question,answer] of webDesignFaqs){
  assert(html.includes(`<summary>${question}</summary><p>${answer}</p>`));
  assert(md.includes(question));assert(md.includes(answer));
  const entry=faq.mainEntity.find(item=>item.name===question);
  assert.equal(entry.acceptedAnswer.text,answer);
 }
 const modified=graph.find(item=>item['@type']==='WebPage').dateModified;
 const sitemap=await readFile('sitemap.xml','utf8');
 const entry=[...sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m=>m[0]).find(s=>s.includes('<loc>https://michaelmck.site/web-design/</loc>'));
 assert(entry.includes(`<lastmod>${modified}</lastmod>`));
});
test('agent Markdown preserves visual proof labels and readable pricing',()=>{
 const md=markdown('<main><a href="/proposal-generator.html"><img src="/example.png" alt="Finished customer proposal"></a><p>$900<span>one-time engagement</span></p><video aria-label="Brand film"><source src="/film.mp4"></video></main>');
 assert(md.includes('[Finished customer proposal](https://michaelmck.site/proposal-generator.html)'));
 assert(md.includes('$900 one-time engagement'));
 assert(md.includes('[Brand film](https://michaelmck.site/film.mp4)'));
 assert(!md.includes('[]('));
 const definitions=markdown('<main><dl><dt>WordPress websites</dt><dd>Useful editing and support.</dd></dl></main>');
 assert(definitions.includes('### WordPress websites\n\nUseful editing and support.'));
});
test('public HTML, Markdown, schema and sitemap stay in sync',async()=>{
 const sitemap=await readFile('sitemap.xml','utf8');
 for(const route of routes){
 const html=await readFile('.'+route+'index.html','utf8');
 const md=await readFile('.'+route+'index.md','utf8');
 assert.equal(md,`Source: https://michaelmck.site${route}\n\n${markdown(html)}`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert(schema['@graph'].some(x=>x.url==='https://michaelmck.site'+route));
 assert(sitemap.includes(`<loc>https://michaelmck.site${route}</loc>`));
 assert.equal((html.match(/<h1\b[^>]*>/g)||[]).length,1);
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
 assert(!ai.includes('/assets/samples/vertical-impression-local-proposal-current.png'));
 assert(!ai.includes('/proposal-generator.html'));
 assert(ai.includes('A weekly appointment calendar on a laptop'));
 assert(!ai.includes('Illustrative service example:'));
 assert(ai.includes('service-booking-scene'));
 assert(ai.includes('href="#what-i-build"'));
 assert(ai.includes('id="what-i-build"'));
 assert(!ai.includes('local-prospecting-desktop.png'));
 assert(ai.includes('I build the system.'));
 assert(!ai.includes('<details class="service-workflow"'));
 assert(marketing.includes('Explaining a misunderstood medium.'));
 assert(!marketing.includes('Make the opportunity clear.'));
 assert(!marketing.includes('vertical-impression-why-elevators.png'));
 assert(marketing.includes('/assets/selected-work/vertical-impression-story.gif'));
 assert(web.includes('https://www.abcappliance.ca/'));
 assert(web.includes('/assets/selected-work/abc-appliance-live.png'));
 assert.equal((marketing.match(/<video /g)||[]).length,2);
 assert(!marketing.includes('data-motion-video autoplay'));
 assert(marketing.includes('data-src="https://st-james-school-prototype.vercel.app/videos/st-james-donor-film-2026-09-21-16x9.mp4"'));
 assert(!ai.includes('<figcaption>Illustrative example</figcaption>'));
 assert(marketing.includes('St. James School website'));
 assert(marketing.includes('Watch the film'));
 assert(ai.includes('Custom agents built, deployed and maintained'));
 for(const page of [ai,web,marketing]){
  const graph=JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert(graph.find(x=>x['@type']==='Service').areaServed.some(x=>x.name==='Kelowna, British Columbia, Canada'));
 }
 assert(marketing.includes('/assets/selected-work/ai-catalyst-film.mp4'));
 assert(marketing.includes('/assets/selected-work/upon-this-rock/website-option-one.png'));
 assert(marketing.includes('href="/work/upon-this-rock/"'));
 assert(!marketing.includes('concept-laptop'));
 assert(marketing.includes('Explore the AI Catalyst website'));
 await access('assets/videos/vertical-impression-proposal-story-boomerang.mp4');
 await access('assets/selected-work/ai-catalyst-film.mp4');
 for (const page of [ai, web, marketing]) {
  assert(page.indexOf('id="selected-work"') < page.indexOf('class="service-process'));
  assert(page.includes('class="service-introduction page-frame"'));
  assert(page.includes('Vernon, Kelowna and across the Okanagan'));
 }
});
test('Markdown requests have explicit routes and response type',async()=>{
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 for(const r of routes)assert(config.rewrites.some(x=>x.source===r&&x.destination===r+'index.md'&&x.has[0].value==='text/markdown'));
 assert(config.headers.some(x=>x.headers.some(h=>h.value==='text/markdown; charset=utf-8')));
 for(const r of routes)assert(config.redirects.some(x=>x.source===r&&x.destination===r+'index.md'&&x.has?.[0].key==='accept'));
 assert(!config.headers.some(x=>routes.includes(x.source)&&x.has&&x.headers.some(h=>h.key==='Content-Type')));
});
