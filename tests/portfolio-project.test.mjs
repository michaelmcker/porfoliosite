import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {siteHeader} from '../scripts/site-header.mjs';
import {markdown} from '../scripts/service-discovery.mjs';
test('Upon This Rock project preserves all selected podcast covers and native dimensions',async()=>{
 const art=JSON.parse(await readFile('content/portfolio/upon-this-rock.json','utf8'));
 const html=await readFile('work/upon-this-rock/index.html','utf8');
 assert.equal(art.length,16);
 for(const a of art){const src=`/assets/selected-work/upon-this-rock/episode-${String(a.episode).padStart(2,'0')}.png`;
  assert.equal(createHash('sha256').update(await readFile('.'+src)).digest('hex'),a.sha256);
  assert(html.includes(`width="${a.size[0]}" height="${a.size[1]}"`));
  assert(html.includes(src));
 }
 assert(html.includes(siteHeader));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g))await access('.'+url.split('?')[0]+(url.endsWith('/')?'index.html':''));
});
test('project discovery includes canonical HTML, Markdown, artwork schema and service paths',async()=>{
 const path='/work/upon-this-rock/';
 const html=await readFile('.'+path+'index.html','utf8');
 assert.equal(await readFile('.'+path+'index.md','utf8'),`Source: https://michaelmck.site${path}\n\n${markdown(html)}`);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.equal(graph.find(x=>x['@type']==='CreativeWork').hasPart.length,16);
 assert(!graph.some(x=>x['@type']==='Service'));
 for(const file of ['sitemap.xml','llms.txt'])assert((await readFile(file,'utf8')).includes('https://michaelmck.site'+path));
 for(const link of ['/contact/','/marketing-branding/','/web-design/'])assert(html.includes(`href="${link}"`));
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 assert(config.redirects.some(x=>x.source===path&&x.destination===path+'index.md'&&x.has?.[0].key==='accept'));
 assert(!html.includes('/Users/'));
});

test('original short trailer is available with sound controls and readable discovery',async()=>{
 const video=await readFile('assets/selected-work/upon-this-rock/trailer.mp4');
 assert.equal(createHash('sha256').update(video).digest('hex'),'cd3b74feec29c4d2a1563b930b8972e6e4d398ce8956132fefe7a33e88978164');
 const html=await readFile('work/upon-this-rock/index.html','utf8');
 assert(html.includes('<video controls playsinline preload="none"'));
 assert(!html.includes(' autoplay'));
 assert(!html.includes(' muted'));
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 assert.equal(graph.find(x=>x['@type']==='VideoObject').duration,'PT58.125S');
 assert((await readFile('work/upon-this-rock/index.md','utf8')).includes('[Upon This Rock short trailer](https://michaelmck.site/assets/selected-work/upon-this-rock/trailer.mp4)'));
});
