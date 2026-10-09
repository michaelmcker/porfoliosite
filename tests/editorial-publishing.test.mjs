import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {ready,dates,localDate,publishing} from '../scripts/resource-publishing.mjs';
import {articles,publishedArticles} from '../scripts/build-resources.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');

test('scheduled articles stay private until their Vancouver release date',async()=>{
 assert.equal(localDate(new Date('2026-10-09T02:00:00Z')),'2026-10-08');
 assert.equal(articles.filter(a=>ready(a,'2026-10-08')).length,3);
 assert.equal(articles.filter(a=>ready(a,'2026-10-12')).length,4);
 assert.equal(articles.filter(a=>ready(a,'2026-11-05')).length,12);
 const publicCopy=(await Promise.all(['blog/index.html','sitemap.xml','llms.txt','llms-full.txt'].map(read))).join('\n');
 for(const a of articles){
  if(dates(a).note?.startsWith('Originally public'))assert.equal(dates(a).datePublished,'2026-10-08','retain original public date');
  if(!publishedArticles.includes(a)){
   assert(!publicCopy.includes(`/blog/${a.slug}/`),a.slug+' is absent from discovery');
   await assert.rejects(access(new URL(`../blog/${a.slug}/index.md`,import.meta.url)));
  }
 }
 assert(!ready({slug:'unreviewed'},'2028-01-01'));
});

test('2027 calendar covers every week with an individual decision and money-page link',async()=>{
 const calendar=JSON.parse(await read('content/resources/editorial-calendar-2027.json'));
 assert.equal(calendar.length,52);assert.equal(new Set(calendar.map(x=>x.publishOn)).size,52);
 assert.equal(calendar[0].publishOn,'2027-01-07');assert.equal(calendar.at(-1).publishOn,'2027-12-30');
 assert.equal(new Set(calendar.map(x=>x.buyerDecision)).size,52);
 for(const row of calendar){
  assert(['planned','draft','drafted','approved','published'].includes(row.status));assert.equal(row.aeo.faqCount,3);
  await access(new URL('../'+row.primaryMoneyPage.slice(1)+'index.html',import.meta.url));
  assert(row.researchChecklist.some(x=>/independently|topic-specific/.test(x)));
 }
});

test('contact form has direct email, accessible inputs and accurate failure handling',async()=>{
 const html=await read('contact/index.html'),js=await read('v2/contact/contact.js');
 assert(html.includes('mailto:michael.mckerracher@gmail.com'));
 for(const id of ['contact-name','contact-email','contact-message'])assert(html.includes(`for="${id}"`)&&html.includes(`id="${id}"`));
 assert(html.includes('name="_honey"'));assert(!html.includes('name="_autoresponse"'));
 assert(html.includes('role="status"'));assert(html.includes('action="https://formsubmit.co/michael.mckerracher@gmail.com"'));
 assert(js.includes("result.success===true||result.success==='true'"));
 assert(js.includes('form.reset()'));assert(js.indexOf('form.reset()')<js.indexOf('}catch'));
 assert(js.includes("window.gtag?.('event','generate_lead'"));
 assert(html.includes('"@type":"ContactPage"'));
 assert((await read('contact/thanks/index.html')).includes('name="robots" content="noindex"'));
 assert((await read('sitemap.xml')).includes('https://michaelmck.site/contact/'));
});
