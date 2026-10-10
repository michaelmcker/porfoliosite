import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {siteHeader, headerStyles} from '../scripts/site-header.mjs';

test('homepage, services share the same published navigation', async()=>{
  for(const path of ['index.html','ai-implementation/index.html','web-design/index.html','marketing-branding/index.html']){
    const html=await readFile(new URL('../'+path,import.meta.url),'utf8');
    assert.equal(html.match(/<header class="site-header[^\"]*">[\s\S]*?<\/header>/)?.[0],siteHeader,path);
    assert.equal(html.split(headerStyles).length-1,1,path+' shared stylesheet');
  }
});

test('retired articles stay absent while the approved resource collection is discoverable', async()=>{
  for (const path of ['index.html','ai-implementation/index.html','web-design/index.html','marketing-branding/index.html','sitemap.xml','llms.txt','llms-full.txt']) {
    const content=await readFile(new URL('../'+path,import.meta.url),'utf8');
    assert.doesNotMatch(content, /\/blog\/(?:what-to-automate-first|website-that-turns-visits-into-enquiries|local-marketing-plan)\//,path);
    assert.match(content,/\/blog\//,path);
  }
  const ai=await readFile(new URL('../ai-implementation/index.html',import.meta.url),'utf8');
  assert.doesNotMatch(ai, /<figcaption>/);
  const marketing=await readFile(new URL('../marketing-branding/index.html',import.meta.url),'utf8');
  for(const video of marketing.matchAll(/<video\b[^>]*>/g)) {
    if(video[0].includes('data-motion-video')) assert.doesNotMatch(video[0], /\bcontrols\b/);
  }
});
