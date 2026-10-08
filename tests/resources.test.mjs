import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {articles} from '../scripts/build-resources.mjs';
import {markdown} from '../scripts/service-discovery.mjs';
import {siteHeader} from '../scripts/site-header.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const base='https://michaelmck.site';
const plain=value=>value.replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();

test('all approved articles are complete, answer-first and linked from the collection',async()=>{
 assert.equal(articles.length,12);
 assert.equal(articles.filter(a=>a.type==='comparison').length,3);
 assert.equal(articles.filter(a=>a.type==='guide').length,3);
 assert(articles.filter(a=>a.type==='checklist'||a.type==='comparison'||a.type==='guide').length>articles.length/2);
 const hub=await read('blog/index.html');
 for(const a of articles){
  const path=`blog/${a.slug}/index.html`,html=await read(path);
  assert.equal(html,await read('v2/'+path));
  assert(html.includes(siteHeader));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert(html.includes(`<h1>${a.title.replaceAll('&','&amp;')}</h1><p class="r-summary">`));
  assert(a.sections.length>=5,a.slug+' complete topic coverage');
  for(const section of a.sections)assert(section.body.startsWith('<p>')&&plain(section.body).length>250,a.slug+' '+section.id+' has a substantive direct answer');
  assert.equal(new Set(a.sections.map(s=>s.id)).size,a.sections.length);
  assert(hub.includes(`href="/blog/${a.slug}/"`));
  assert(html.includes('<script src="/assets/analytics.js" defer></script>'));
  assert(!/<meta[^>]+(?:name="robots"[^>]+content="[^"]*noindex|content="[^"]*noindex[^>]+name="robots")/i.test(html));
  assert(!/"aggregateRating"|"starRating"/.test(html));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const article=graph.find(x=>x['@type']==='BlogPosting');
  assert.equal(article.headline,a.title);
  assert.equal(article.abstract,a.summary);
  assert.equal(article.datePublished,'2026-10-08');
  assert.equal(article.author['@id'],base+'/#person');
  const faq=graph.find(x=>x['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,3);
  const visible=html.match(/<section class="r-faq"[\s\S]*?<section class="r-sources"/)[0];
  assert.equal((visible.match(/<h3>/g)||[]).length,3);
  assert(!visible.includes('<details'));
  for(const [q,answer]of a.faqs){assert(plain(visible).includes(q));assert(plain(visible).includes(answer));assert(faq.mainEntity.some(x=>x.name===q&&x.acceptedAnswer.text===answer));}
  const md=await read(`blog/${a.slug}/index.md`);
  assert.equal(md,`Source: ${base}/blog/${a.slug}/\n\n${markdown(html)}`);
  if(a.type==='comparison'){
   assert(a.method.includes('include my own business'));
   assert(a.providers.some(([name,url])=>name==='Michael McKerracher'));
   const list=graph.find(x=>x['@type']==='ItemList');assert.equal(list.numberOfItems,a.providers.length);
   assert(md.includes('| Provider | Consider for |'));
  }
 }
});

test('resource links and anchors resolve, discovery includes every page, and Markdown routes exist',async()=>{
 const routes=JSON.parse(await read('v2/resources/routes.json'));
 const sitemap=await read('sitemap.xml'),llms=await read('llms.txt'),full=await read('llms-full.txt'),config=JSON.parse(await read('vercel.json'));
 for(const route of routes){
  const html=await read(route.slice(1)+'index.html');
  assert(html.includes(`<link rel="canonical" href="${base}${route}">`));
  assert(sitemap.includes(`<loc>${base}${route}</loc>`));assert(llms.includes(base+route+'index.md'));assert(full.includes('Source: '+base+route));
  for(const[,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(href.startsWith('#')){assert(html.includes(`id="${href.slice(1)}"`),route+' '+href);continue;}
   if(!href.startsWith('/'))continue;
   const url=new URL(href,base);const path=url.pathname+(url.pathname.endsWith('/')?'index.html':'');
   await access(new URL('../'+path.slice(1),import.meta.url));
   if(url.hash)assert((await read(path.slice(1))).includes(`id="${url.hash.slice(1)}"`),href);
  }
 }
 for(const route of ['/blog/','/blog/:article/'])assert(config.redirects.some(x=>x.source===route&&x.destination===route+'index.md'&&x.has?.[0].key==='accept'));
});

test('new articles avoid banned copy and unsupported outcome substitutions',()=>{
 for(const a of articles){
  const body=[a.title,a.summary,...a.sections.map(s=>s.title+' '+s.body),...a.faqs.flat()].join('\n');
  assert(!/\u2014|\b(delve|delving|tapestry|myriad|plethora)\b|in today's digital age|in conclusion|it's worth noting|it is worth noting/i.test(body),a.slug);
  assert(!/30%\s+(?:more|increase in)\s+revenue/i.test(body),a.slug);
  assert(!body.includes('example.com'));
 }
});

test('Markdown preserves usable table structure and links',()=>{
 const result=markdown('<main><table><caption>Choose a provider</caption><tr><th>Provider</th><th>Fit</th></tr><tr><td><a href="/web-design/">Michael</a></td><td>Service websites</td></tr></table></main>');
 assert(result.includes('| Provider | Fit |\n| --- | --- |'));
 assert(result.includes('[Michael](https://michaelmck.site/web-design/)'));
});
