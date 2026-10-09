import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../assets/analytics.js', import.meta.url), 'utf8');
function page(hostname, search='', storage=new Map(), pathname='/web-design/', blocked=false) {
 const loaded=[];
 const window={location:{hostname,search,pathname},sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return storage.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');storage.set(k,v);}}};
 const document={referrer:'https://www.google.com/search?q=test',querySelector:()=>null,createElement:()=>({}),head:{append:t=>loaded.push(t)}};
 vm.runInNewContext(source,{window,document,URL,URLSearchParams,Date});
 return {window,loaded,storage};
}
test('local, file and preview hosts cannot collect production analytics',()=>{
 for(const host of ['localhost','127.0.0.1','','preview.vercel.app','michaelmck.site.attacker.test']){
  const p=page(host);p.window.gtag('event','generate_lead');
  assert.equal(p.window['ga-disable-G-EJ6ZTQDK09'],true);
  assert.equal(p.loaded.length,0);assert.equal(p.window.dataLayer,undefined);
 }
});
test('production configures the existing privacy-reduced property',()=>{
 const p=page('michaelmck.site');
 assert.equal(p.window['ga-disable-G-EJ6ZTQDK09'],false);
 assert.equal(p.loaded.length,1);
 const config=Array.from(p.window.dataLayer[1]);
 assert.equal(config[1],'G-EJ6ZTQDK09');assert.equal(config[2].allow_google_signals,false);assert.equal(config[2].allow_ad_personalization_signals,false);
});
test('campaign attribution survives navigation to the intake and records a later campaign',()=>{
 const first=page('michaelmck.site','?utm_source=meta&utm_campaign=preview-test&email=private@example.com');
 const form=page('michaelmck.site','',first.storage,'/free-website-preview/');
 assert.equal(form.window.portfolioAttribution.first.utm_campaign,'preview-test');
 assert.equal(form.window.portfolioAttribution.last.landing_path,'/web-design/');
 assert.equal(form.window.portfolioAttribution.first.email,undefined);
 const next=page('michaelmck.site','?utm_source=google&utm_campaign=second',first.storage);
 assert.equal(next.window.portfolioAttribution.first.utm_source,'meta');
 assert.equal(next.window.portfolioAttribution.last.utm_source,'google');
});
test('stale attribution expires and denied storage does not interrupt analytics',()=>{
 const storage=new Map([['portfolio_acquisition_v1',JSON.stringify({saved_at:Date.now()-86400001,first:{utm_source:'old'},last:{utm_source:'old'}})]]);
 assert.equal(page('michaelmck.site','',storage).window.portfolioAttribution.first.utm_source,undefined);
 const p=page('michaelmck.site','?utm_source=meta',new Map(),'/web-design/',true);
 assert.equal(p.window.portfolioAttribution.first.utm_source,'meta');assert.equal(p.loaded.length,1);
});
