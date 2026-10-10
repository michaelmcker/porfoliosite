import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {articles,renderArticle} from '../scripts/build-resources.mjs';
import {resourceService} from '../scripts/resource-conversion.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');

test('existing and scheduled resources retain complete openings and specific FAQ coverage',async()=>{
 const files=await readdir(new URL('content/resources/draft-library/',root));
 const drafts=await Promise.all(files.filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await read('content/resources/draft-library/'+f))));
 for(const a of [...articles,...drafts]){
  assert(a.summary.trim(),a.slug+' opening answer');
  assert(!/\bthis (?:guide|article) (?:shows|covers|helps|explains)|\bread on\b/i.test(a.summary),a.slug+' is an answer, not a teaser');
  assert.equal(a.faqs.length,5,a.slug+' preserves expanded FAQs');
  assert.equal(new Set(a.faqs.map(([q])=>q.toLowerCase())).size,5,a.slug+' distinct questions');
  const service=resourceService(a);
  assert.equal(service.href,a.primaryMoneyPage,a.slug+' explicit commercial destination');
  await access(new URL(service.href.slice(1)+'index.html',root));
 }
 for(const a of articles){
  const html=renderArticle(a).html;
  const help=html.match(/<section class="r-help"[\s\S]*?<\/section>/)[0];
  assert(help.includes(`href="${a.primaryMoneyPage}"`),a.slug+' contextual service link');
  assert(help.includes('href="/contact/"'),a.slug+' enquiry route');
 }
 assert.throws(()=>resourceService({primaryMoneyPage:'https://example.com/'}),/Unknown resource money page/);
});

test('every public sitemap page has a commercial or contact path',async()=>{
 const urls=[...(await read('sitemap.xml')).matchAll(/<loc>https:\/\/michaelmck\.site([^<]+)<\/loc>/g)].map(m=>m[1]);
 for(const path of urls){
  const html=await read(path.slice(1)+(path.endsWith('/')?'index.html':''));
  assert(/href="\/(?:contact|free-website-preview|web-design|ai-implementation|marketing-branding)\//.test(html),path+' commercial path');
 }
});
