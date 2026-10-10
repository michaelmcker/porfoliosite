import assert from 'node:assert/strict';
import {publishedArticles} from './build-resources.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const origin='https://michaelmck.site';
const routes=[...JSON.parse(await readFile('v2/resources/routes.json','utf8')),'/contact/'];
const files=[...routes.flatMap(r=>[{url:r,file:r.slice(1)+'index.html'},{url:r+'index.md',file:r.slice(1)+'index.md'}]),...['sitemap.xml','robots.txt','llms.txt','llms-full.txt','v2/resources/resources.css','v2/site-header.css','v2/contact/contact.css','v2/contact/contact.js','assets/selected-work/abc-appliance-live.png','assets/screens/cool-runnings-home.webp','v2/okanagan-preview/assets/overview-final.webp'].map(file=>({url:'/'+file,file})),...['','ai-implementation/','web-design/','marketing-branding/','web-design/industries/'].map(path=>({url:'/'+path,file:path+'index.html'}))];
const digest=b=>createHash('sha256').update(b).digest('hex');
const results=[];
for(let i=0;i<files.length;i+=5){await Promise.all(files.slice(i,i+5).map(async p=>{
 const r=await fetch(origin+p.url,{signal:AbortSignal.timeout(30000)});const bytes=Buffer.from(await r.arrayBuffer());const local=await readFile(p.file);
 const result={path:p.url,status:r.status,bytes:bytes.length,match:digest(bytes)===digest(local),robots:r.headers.get('x-robots-tag'),type:r.headers.get('content-type')};results.push(result);
 assert.equal(r.status,200,p.url);assert(result.match,'Production mismatch '+p.url);assert(!/noindex/i.test(result.robots||''),p.url);
 if(p.file.endsWith('.html')&&p.url.startsWith('/blog/')){
  const html=bytes.toString();assert(html.includes('rel="canonical" href="'+origin+p.url+'"'));assert(html.includes('<p class="r-summary">'));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  if(p.url!='/blog/')assert.equal(graph.find(x=>x['@type']==='FAQPage').mainEntity.length,publishedArticles.find(a=>p.url===`/blog/${a.slug}/`).faqs.length);
 }
}));}
const negotiation=[];
for(const route of routes){const r=await fetch(origin+route,{headers:{Accept:'text/markdown'},signal:AbortSignal.timeout(30000)});const body=await r.text();assert.equal(r.status,200);assert(r.url.endsWith(route+'index.md'));assert(r.headers.get('content-type').includes('text/markdown'));assert.equal(body,await readFile(route.slice(1)+'index.md','utf8'));negotiation.push({route,finalUrl:r.url,status:r.status,type:r.headers.get('content-type')});}
const plan=JSON.parse(await readFile('content/resources/publishing.json','utf8'));
const current=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const withheld=[];
for(const [slug,meta]of Object.entries(plan.articles))if(meta.publishOn>current){
 for(const path of [`/blog/${slug}/`,`/blog/${slug}/index.md`,`/v2/blog/${slug}/`]){
  const r=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,404,'Queued page exposed '+path);withheld.push({path,status:r.status});
 }
}
const report={checkedAt:new Date().toISOString(),resources:results.length,allMatch:true,results,markdownNegotiation:negotiation,withheld};
await writeFile('docs/editorial-2026-10-08/live-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({resources:results.length,allMatch:true,markdownRoutes:negotiation.length,queuedPathsWithheld:withheld.length}));
