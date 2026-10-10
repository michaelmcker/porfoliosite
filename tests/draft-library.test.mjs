import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {publishing,ready,futureArticles} from '../scripts/resource-publishing.mjs';
const root=new URL('../',import.meta.url);
const read=path=>JSON.parse(readFileSync(new URL(path,root),'utf8'));
const drafts=readdirSync(new URL('content/resources/draft-library/',root)).filter(n=>n.endsWith('.json')).map(n=>read('content/resources/draft-library/'+n));
test('every scheduled private draft has a complete manuscript and matching calendar record',()=>{
 const calendar=[...read('content/resources/editorial-calendar-2026.json'),...read('content/resources/editorial-calendar-2027.json')];
 assert.equal(drafts.length,60);assert.equal(calendar.length,60);
 assert.equal(new Set(drafts.map(a=>a.slug)).size,60);
 for(const row of calendar){
  const a=drafts.find(a=>a.slug===row.slug);assert.ok(a,row.slug);
  assert.equal(a.title,row.title);assert.equal(a.plannedPublishOn,row.publishOn);
  assert.ok(a.wordCount>=950,row.slug);assert.ok(a.sections.length>=6);
  assert.equal(a.faqs.length,row.aeo.faqCount);assert.equal(a.faqs.length,5);
  assert.deepEqual(row.faqs,a.faqs.map(([question])=>question));
  assert.equal(a.primaryMoneyPage,row.primaryMoneyPage);
  assert.equal(a.editorialReview.state,'pass-for-draft-review');
 }
});
test('private manuscripts stay outside the production loader and release queue even after their target dates',()=>{
 const loaded=new Set(futureArticles().map(a=>a.slug));
 for(const a of drafts){
  assert.equal(a.status,'draft');assert.equal(a.editorialReview.publicationApproved,false);
  assert.equal(a.datePublished,undefined);assert.equal(publishing.articles[a.slug],undefined);
  assert.equal(loaded.has(a.slug),false);assert.equal(ready(a,'2028-01-01'),false);
 }
});
test('the existing approved release queue remains three current guides and nine later releases',()=>{
 const records=Object.values(publishing.articles);
 assert.equal(records.length,12);
 assert.equal(records.filter(p=>p.publishOn<='2026-10-08').length,3);
 assert.equal(records.filter(p=>p.publishOn>'2026-10-08').length,9);
});
