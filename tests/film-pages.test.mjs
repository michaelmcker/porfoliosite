import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

test('shareable film pages play same-origin media and remain in discovery',async()=>{
 const sitemap=await readFile('sitemap.xml','utf8');
 const llms=await readFile('llms.txt','utf8');
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 for(const slug of ['st-james-school','ai-catalyst','vertical-impression']){
  const path=`/work/${slug}/`;
  const html=await readFile('.'+path+'index.html','utf8');
  const video=html.match(/<video\b[^>]*>[\s\S]*?<\/video>/)?.[0];
  assert(video?.includes('controls playsinline'));
  assert(!video.includes('autoplay'));
  const src=video.match(/<source src="([^"]+)"/)?.[1];
  assert(src?.startsWith('/assets/'));
  await access('.'+src);
  assert(sitemap.includes('https://michaelmck.site'+path));
  assert(llms.includes('https://michaelmck.site'+path));
  assert(config.redirects.some(x=>x.source===path&&x.has?.[0]?.key==='accept'));
  assert((await readFile('.'+path+'index.md','utf8')).includes(src));
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.find(x=>x['@type']==='VideoObject').contentUrl,'https://michaelmck.site'+src);
 }
 const school=await readFile('work/st-james-school/index.html','utf8');
 assert(school.includes('href="https://sjslegacy.com/"'));
 assert(!school.includes('st-james-school-prototype'));
});
