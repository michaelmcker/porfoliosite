import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {siteHeader} from '../scripts/site-header.mjs';

const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
const routes=JSON.parse(await read('v2/industries/routes.json'));
const industries=routes.filter(p=>p!=='/web-design/industries/');

test('24 distinct industry pages have original artwork and an industry index',async()=>{
 assert.equal(industries.length,24);assert.equal(routes.length,25);
 const titles=new Set(),images=new Set(),bodies=new Set();
 for(const route of industries){
  const html=await read(route.slice(1)+'index.html');
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
  const hero=html.match(/<figure class="i-hero-media">([\s\S]*?)<\/figure>/)[1];
  const src=hero.match(/src="([^"]+)"/)[1];
  assert.ok(src.startsWith('/v2/industries/assets/'),route);
  const bytes=await readFile(new URL(src.slice(1),root));
  images.add(createHash('sha256').update(bytes).digest('hex'));
  assert.ok(bytes.length<300000,`${route} hero oversized`);
  assert.match(hero,/srcset=/);assert.doesNotMatch(hero,/figcaption|Cool Runnings|illustrative|concept/i);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.ok(html.includes(siteHeader));
  bodies.add(html.match(/<div class="i-prose">([\s\S]*?)<\/div>/)[1]);
  assert.equal(html,await read('v2'+route+'index.html'));
 }
 assert.equal(titles.size,24);assert.equal(images.size,24);assert.equal(bodies.size,24);
});

test('all industry URLs are discoverable with matching HTML, Markdown and structured facts',async()=>{
 const sitemap=await read('sitemap.xml'),llms=await read('llms.txt'),hub=await read('web-design/industries/index.html');
 for(const route of routes){
  const html=await read(route.slice(1)+'index.html'),md=await read(route.slice(1)+'index.md');
  const canonical=`https://michaelmck.site${route}`;
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));assert.ok(llms.includes(canonical+'index.md'));
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`));assert.ok(md.startsWith(`Source: ${canonical}`));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@graph'].find(x=>x['@type']==='Person').name,'Michael McKerracher');
  if(route!=='/web-design/industries/'){
   assert.ok(hub.includes(`href="${route}"`));
   assert.equal(schema['@graph'].find(x=>x['@type']==='FAQPage').mainEntity.length,6);
   assert.equal(schema['@graph'].find(x=>x['@type']==='Service').url,canonical);
   assert.ok(md.split(/\s+/).length>900,`${route} missing substantial content`);
  }
  assert.ok(html.includes('href="/contact/"'));
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
   const pathname=decodeURIComponent(match[1]).slice(1);const target=pathname.endsWith('/')||!pathname?pathname+'index.html':pathname;
   assert.ok((await stat(new URL(target,root))).isFile(),`${route} broken internal resource: ${target}`);
  }
 }
 assert.ok((await read('web-design/index.html')).includes('href="/web-design/industries/"'));
 const config=JSON.parse(await read('vercel.json'));
 assert.ok(config.redirects.some(r=>r.source==='/web-design/:industry/'&&r.has?.some(h=>h.value.includes('text/markdown'))));
});
