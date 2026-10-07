import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {siteHeader, headerStyles} from '../scripts/site-header.mjs';

test('homepage, services and blog share the same published navigation', async()=>{
  for(const path of ['index.html','ai-implementation/index.html','web-design/index.html','marketing-branding/index.html','blog/index.html','blog/what-to-automate-first/index.html']){
    const html=await readFile(new URL('../'+path,import.meta.url),'utf8');
    assert.equal(html.match(/<header class="site-header[^\"]*">[\s\S]*?<\/header>/)?.[0],siteHeader,path);
    assert.equal(html.split(headerStyles).length-1,1,path+' shared stylesheet');
  }
});
