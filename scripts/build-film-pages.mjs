import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {siteHeader, headerStyles} from './site-header.mjs';
import {markdown} from './service-discovery.mjs';

const origin = 'https://michaelmck.site';
export const films = [
  {slug:'st-james-school', title:'St. James School donor film', heading:'A future worth<br> <em>building together.</em>', description:'A donor film for St. James School, connecting education, community and the school’s future through a visual story.', src:'/assets/selected-work/st-james-donor-film.mp4', poster:'/assets/selected-work/st-james-film.jpg', width:1280, height:720, duration:'PT106.7S', website:'https://sjslegacy.com/', websiteLabel:'Visit St. James School'},
  {slug:'ai-catalyst', title:'AI Catalyst brand film', heading:'Your story.<br> <em>Made visible.</em>', description:'A brand film for AI Catalyst. Strategy, imagery, voice and motion come together to give the business a clear introduction.', src:'/assets/selected-work/ai-catalyst-film.mp4', poster:'/assets/selected-work/ai-catalyst-film-poster.jpg', width:1280, height:720, duration:'PT60.01S', website:'https://ai-catalyst-wheat.vercel.app/', websiteLabel:'Explore the AI Catalyst website'},
  {slug:'vertical-impression', title:'Vertical Impression product story', heading:'An overlooked medium.<br> <em>A clearer story.</em>', description:'A scrolling product story for Vertical Impression, making elevator advertising easier to understand through messaging, design and motion.', src:'/assets/selected-work/vertical-impression-story-hd.mp4', poster:'/assets/selected-work/vertical-impression-story-hd-poster.jpg', width:1920, height:1080, duration:'PT25S', website:'https://www.verticalimpression.com/proposal-story', websiteLabel:'Explore the product website'}
];

export async function buildFilmPages(root) {
  const routes = [];
  let sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
  for (const f of films) {
    const path = `/work/${f.slug}/`;
    const url = origin + path;
    routes.push(path);
    const schema = {'@context':'https://schema.org','@graph':[
      {'@type':'WebPage','@id':url,url,name:f.title,description:f.description,mainEntity:{'@id':url+'#film'},dateModified:'2026-10-12'},
      {'@type':'VideoObject','@id':url+'#film',name:f.title,description:f.description,thumbnailUrl:origin+f.poster,contentUrl:origin+f.src,embedUrl:url,uploadDate:'2026-10-12T09:00:00-07:00',duration:f.duration,creator:{'@type':'Person',name:'Michael McKerracher',url:origin}},
      {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:'Marketing & branding',item:origin+'/marketing-branding/'},{'@type':'ListItem',position:3,name:f.title,item:url}]}
    ]};
    const html = `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${f.title} | Michael McKerracher</title><meta name="description" content="${f.description}"><link rel="canonical" href="${url}"><meta property="og:type" content="video.other"><meta property="og:title" content="${f.title}"><meta property="og:description" content="${f.description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin+f.poster}"><meta name="twitter:card" content="summary_large_image"><link rel="alternate" type="text/markdown" href="${path}index.md"><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/v2/styles.css"><link rel="stylesheet" href="/v2/work/project.css?v=film-pages-1">${headerStyles}<script src="/assets/analytics.js" defer></script><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body class="project-page film-page"><a class="skip-link" href="#main">Skip to content</a>${siteHeader}<main id="main"><header class="project-intro project-frame"><h1>${f.heading}</h1><div><p>${f.description}</p><nav class="project-links" aria-label="Project links"><a href="/marketing-branding/#selected-work">More video &amp; brand work</a><a href="${f.website}">${f.websiteLabel}</a></nav></div></header><section class="film-screen project-frame" aria-label="${f.title}"><video id="film" controls playsinline preload="metadata" width="${f.width}" height="${f.height}" poster="${f.poster}" aria-label="${f.title}"><source src="${f.src}" type="video/mp4"></video></section><section class="film-next project-frame"><div><h2>A story people<br> can <em>see and feel.</em></h2><p>Video, websites and brand development that make what you do easier to understand.</p></div><a class="project-button" href="/contact/">Let’s talk about your project</a></section></main><footer class="project-footer project-frame"><a href="/">Michael McKerracher</a><nav aria-label="Footer"><a href="/blog/">Resources</a><a href="/marketing-branding/">Marketing &amp; branding</a><a href="/contact/">Contact us</a></nav><p>Coldstream, BC · © 2026</p></footer></body></html>`;
    for (const directory of ['v2'+path.slice(0,-1),path.slice(1,-1)]) {
      await mkdir(new URL(directory+'/',root),{recursive:true});
      await writeFile(new URL(directory+'/index.html',root),html);
    }
    await writeFile(new URL(path.slice(1)+'index.md',root),`Source: ${url}\n\n${markdown(html)}`);
    const entry = `<url><loc>${url}</loc><lastmod>2026-10-12</lastmod></url>`;
    sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g,s=>s.includes(`<loc>${url}</loc>`)?entry:s);
    if(!sitemap.includes(`<loc>${url}</loc>`)) sitemap=sitemap.replace('</urlset>',`  ${entry}\n</urlset>`);
  }
  await writeFile(new URL('sitemap.xml',root),sitemap);
  return routes;
}
