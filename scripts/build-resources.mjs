import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {cityArticles} from './resource-content-cities.mjs';
import {practicalArticles} from './resource-content-practical.mjs';
import {comparisonArticles} from './resource-content-comparisons.mjs';
import {siteHeader,headerStyles} from './site-header.mjs';
import {markdown,writeDiscovery} from './service-discovery.mjs';
import {edited,ready,dates,displayDate,futureArticles} from './resource-publishing.mjs';
import {buildContact} from './build-contact.mjs';
import {buildPreviewOffer,previewInvitation} from './build-preview-offer.mjs';

const root=new URL('../',import.meta.url),origin='https://michaelmck.site';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=s=>s.replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
const route=a=>`/blog/${a.slug}/`;
const css='<link rel="stylesheet" href="/v2/resources/resources.css?v=3">';
export const articles=[...cityArticles,...practicalArticles,...comparisonArticles,...futureArticles()].map(edited);
export const publishedArticles=articles.filter(a=>ready(a));
const publishedSlugs=new Set(publishedArticles.map(a=>a.slug));
function liveLinks(html){return html.replace(/<a href="\/blog\/([^/]+)\/"[^>]*>([\s\S]*?)<\/a>/g,(all,slug,label)=>publishedSlugs.has(slug)?all:label);}
const bySlug=Object.fromEntries(articles.map(a=>[a.slug,a]));
// Intrinsic sizes of the existing approved portfolio media.
const sizes={'/assets/selected-work/abc-appliance-live.png':[1265,712],'/assets/screens/cool-runnings-home.webp':[1440,900],'/v2/okanagan-preview/assets/overview-final.webp':[1920,1097]};
const picture=a=>`<img src="${a.image.src}" alt="${esc(a.image.alt)}" width="${sizes[a.image.src][0]}" height="${sizes[a.image.src][1]}" loading="lazy" decoding="async">`;
const person={'@type':'Person','@id':origin+'/#person',name:'Michael McKerracher',url:origin+'/',jobTitle:'Web designer and marketing consultant',homeLocation:{'@type':'Place',name:'Coldstream, British Columbia'}};
const breadcrumbs=(title,path)=>({'@type':'BreadcrumbList',itemListElement:[['Home','/'],['Resources','/blog/'],...(path==='/blog/'?[]:[[title,path]])].map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:origin+path}))});
function schema(a){
 const url=origin+route(a);
 const wordCount=text(a.summary+' '+a.sections.map(s=>s.title+' '+s.body).join(' ')).split(/\s+/).length;
 const posting={'@type':'BlogPosting','@id':url+'#article',url,headline:a.title,description:a.description,abstract:a.summary,datePublished:dates(a).datePublished,dateModified:dates(a).dateModified,inLanguage:'en-CA',author:{'@id':person['@id']},publisher:{'@id':person['@id']},mainEntityOfPage:{'@type':'WebPage','@id':url},image:{'@type':'ImageObject',url:origin+a.image.src,width:sizes[a.image.src][0],height:sizes[a.image.src][1]},wordCount,citation:a.sources.map(s=>s.url)};
 const graph=[person,posting,breadcrumbs(a.title,route(a)),{'@type':'FAQPage','@id':url+'#questions',isPartOf:{'@id':url},mainEntity:a.faqs.map(([name,answer])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text:answer}}))}];
 const items=a.providers?a.providers.map(([name,,url])=>({name,url})):a.sections.filter(s=>/^\d+\./.test(s.title)).map(s=>({name:s.title.replace(/^\d+\. /,''),url:url+'#'+s.id}));
 if(items.length)graph.push({'@type':'ItemList',name:a.title,itemListOrder:'https://schema.org/ItemListOrderAscending',numberOfItems:items.length,itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,...item}))});
 return {'@context':'https://schema.org','@graph':graph};
}
function head(p,s){return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)} | Michael McKerracher</title><meta name="description" content="${esc(p.description)}"><link rel="canonical" href="${origin}${p.path}"><link rel="alternate" type="text/markdown" href="${p.path}index.md"><meta property="og:type" content="${p.path==='/blog/'?'website':'article'}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${origin}${p.path}"><meta property="og:image" content="${origin}${p.image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg"><link rel="preload" href="/v2/assets/fonts/dm-sans-latin-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/v2/industries/industries.css?v=2">${css}${headerStyles}<script type="application/ld+json">${JSON.stringify(s).replaceAll('<','\\u003c')}</script><script src="/assets/analytics.js" defer></script></head><body class="industry-page resource-page"><a class="i-skip" href="#main">Skip to content</a>${siteHeader}`;}
const footer=`<footer class="r-footer r-frame"><a href="/">Michael McKerracher</a><p>Coldstream, BC. Working across the Okanagan.</p><nav aria-label="Footer"><a href="/blog/">Resources</a><a href="/web-design/">Web design</a><a href="/web-design/industries/">Websites by industry</a><a href="/ai-implementation/">AI implementation</a><a href="/marketing-branding/">Marketing &amp; branding</a><a href="/contact/">Contact us</a></nav></footer></body></html>`;
const close=`<section class="r-close"><div class="r-frame"><h2>What should your website<br><em>do for your business?</em></h2><div><p>Bring the problem, the idea or the website you have. We’ll work out what would make a useful difference.</p><a class="i-button" href="/contact/">Book a free consultation</a></div></div></section>`;
function resourceHelp(a){
 const links=[['/web-design/','Website design'],['/ai-implementation/','AI implementation'],['/marketing-branding/','Marketing & branding']];
 return `<section class="r-help" aria-labelledby="put-into-practice"><h2 id="put-into-practice">Put this to work for your business.</h2><p>I can help you turn these decisions into a website with a clear structure, useful content and an easier route to an enquiry or booking. Start with <a href="/web-design/">web design and development</a>, or <a href="/contact/">tell me what you want to improve</a> and we can work out the right scope.</p><nav aria-label="Services for your next step">${links.slice(1).map(([href,label])=>`<a href="${href}">${esc(label)}</a>`).join('')}</nav></section>`;
}
export function renderArticle(a){
 const p={path:route(a),heading:a.title,title:a.title,description:a.description,image:a.image.src,article:true};
 const sources=`<section class="r-sources" id="sources"><h2>Sources and further reading</h2><ul>${a.sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.name)}</a></li>`).join('')}</ul></section>`;
 const body=a.sections.map(s=>`<section class="r-section" id="${s.id}"><h2>${esc(s.title)}</h2>${s.body.replaceAll('<table>','<div class="r-table"><table>').replaceAll('</table>','</table></div>')}</section>`).join('\n');
 const related=a.related.filter(slug=>publishedSlugs.has(slug)).map(slug=>{const r=bySlug[slug];if(!r)throw new Error(`Missing related article ${slug}`);return `<li><a href="${route(r)}">${esc(r.title)}</a></li>`}).join('');
 p.html=head(p,schema(a))+`<main id="main"><article><header class="r-opening r-frame"><h1>${esc(a.title)}</h1><p class="r-summary">${esc(a.summary)}</p><p class="r-byline">By <a href="/">Michael McKerracher</a> · Published <time datetime="${dates(a).datePublished}">${displayDate(dates(a).datePublished)}</time>${dates(a).dateModified!==dates(a).datePublished?` · Updated <time datetime="${dates(a).dateModified}">${displayDate(dates(a).dateModified)}</time>`:''}</p></header><div class="r-layout r-frame"><aside class="r-contents"><nav aria-label="In this article"><p>In this article</p><ol>${a.sections.map(s=>`<li><a href="#${s.id}">${esc(s.title.replace(/^\d+\. /,''))}</a></li>`).join('')}<li><a href="#questions">Questions, answered</a></li></ol></nav><div class="r-contents-next"><a href="/web-design/">Website design services</a><a href="/contact/">Discuss your project</a><a href="/blog/">All resources</a></div></aside><div class="r-reading"><div class="r-takeaways"><ul>${a.takeaways.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>${a.method?`<p class="r-method">${esc(a.method)}</p>`:''}${a.providers?`<div class="r-table"><table><caption>Compare by project fit</caption><thead><tr><th>Provider</th><th>Consider for</th></tr></thead><tbody>${a.providers.map(([name,fit,url],i)=>`<tr><td><a href="#${a.sections[i].id}">${esc(name)}</a></td><td>${esc(fit)}</td></tr>`).join('')}</tbody></table></div>`:`<figure class="r-image">${picture(a)}</figure>`}${body}<section class="r-faq" id="questions"><h2>Questions, answered.</h2>${a.faqs.map(([q,answer])=>`<section><h3>${esc(q)}</h3><p>${esc(answer)}</p></section>`).join('')}</section>${resourceHelp(a)}${sources}<section class="r-related"><h2>Keep exploring</h2><ul>${related}</ul><p><a href="/web-design/industries/">Explore website design for your industry</a></p><ul class="r-industries">${a.services.map(slug=>`<li><a href="/web-design/${slug}/">${esc(slug.replaceAll('-',' ').replace(/^./,c=>c.toUpperCase()))}</a></li>`).join('')}</ul></section></div></div></article>${close}</main>${footer}`;
 p.html=liveLinks(p.html);
 return p;
}
function renderHub(){
 const p={path:'/blog/',heading:'A better website starts with better questions.',title:'Website guides and comparisons for Okanagan businesses',description:'Practical website guides, checklists and designer comparisons for Kelowna, Vernon and West Kelowna, by Michael McKerracher.',image:'/assets/screens/cool-runnings-home.webp'};
 const list=items=>`<ol class="r-article-list">${items.map(a=>`<li><a href="${route(a)}"><p class="r-card-date">${a.type==='guide'?'Guide':a.type==='comparison'?'Comparison':'Checklist'} · <time datetime="${dates(a).dateModified}">${displayDate(dates(a).dateModified)}</time></p><h3>${esc(a.title)}</h3><p>${esc(a.description)}</p><span>Read the article</span></a></li>`).join('')}</ol>`;
 const cities=publishedArticles.filter(a=>a.type==='guide'),checks=publishedArticles.filter(a=>a.type==='checklist'),comparisons=publishedArticles.filter(a=>a.type==='comparison');
 const g={'@context':'https://schema.org','@graph':[person,{'@type':'CollectionPage',url:origin+p.path,name:p.title,description:p.description,author:{'@id':person['@id']}},breadcrumbs(p.title,p.path),{'@type':'ItemList',numberOfItems:publishedArticles.length,itemListElement:publishedArticles.map((a,i)=>({'@type':'ListItem',position:i+1,name:a.title,url:origin+route(a)}))}]};
 const story=articles.find(a=>a.type==='case-study');
 p.html=head(p,g)+`<main id="main"><header class="r-opening r-frame r-hub-opening"><h1>A better website starts<br>with <em>better questions.</em></h1><p class="r-summary">What should it cost? What does it need? Who should build it? Practical advice for Okanagan business owners, with useful examples and clear next steps.</p></header><div class="r-frame"><nav class="r-topics" aria-label="Resource topics"><a href="#city-guides">Your city</a>${checks.length?'<a href="#checklists">Practical checklists</a>':''}${comparisons.length?'<a href="#comparisons">Choosing a designer</a>':''}<a href="#results">Real work</a></nav><section class="r-hub-section" id="city-guides"><h2>Start where you do business.</h2>${list(cities)}</section>${checks.length?`<section class="r-hub-section" id="checklists"><h2>Make the next decision easier.</h2>${list(checks)}</section>`:''}${comparisons.length?`<section class="r-hub-section" id="comparisons"><h2>Find the right fit.</h2><p>Web designers compared by the work and support your business needs.</p>${list(comparisons)}</section>`:''}<section class="r-feature r-hub-section" id="results"><figure>${picture(story)}</figure><div><h2><em>30%</em> more qualified bookings.</h2><p>How the website, local SEO and conversion work came together for Cool Runnings.</p><a href="${publishedSlugs.has(story.slug)?route(story):'/v2/work/local-search-magnet.html'}">Read the project story</a></div></section></div>${close}</main>${footer}`;
 return p;
}

export const resourceDiscovery=`<section class="resource-discovery"><h2>Make a better website decision.</h2><p>Practical local advice on cost, content, search and choosing the right designer.</p><nav aria-label="Website resources"><a href="/blog/kelowna-business-website-guide/">Kelowna website guide</a><a href="/blog/vernon-business-website-guide/">Vernon website guide</a><a href="/blog/west-kelowna-business-website-guide/">West Kelowna website guide</a><a href="/blog/">Explore all resources</a></nav></section>`;

export async function buildResources(){
 const contact=await buildContact();
 const preview=await buildPreviewOffer();
 const pages=[renderHub(),...publishedArticles.map(renderArticle)];
 // Withdraw queued outputs completely: no HTML, Markdown or alternate source route.
 for(const a of articles.filter(a=>!ready(a)))for(const prefix of ['','v2/'])await rm(new URL(prefix+route(a).slice(1),root),{recursive:true,force:true});
 for(const p of pages){for(const prefix of ['','v2/']){const dir=new URL(prefix+p.path.slice(1),root);await mkdir(dir,{recursive:true});await writeFile(new URL('index.html',dir),p.html);}}
 await mkdir(new URL('v2/resources/',root),{recursive:true});
 await writeFile(new URL('v2/resources/routes.json',root),JSON.stringify(pages.map(p=>p.path),null,2)+'\n');
 // Keep published source and root in sync. The navbar remains the shared site navbar.
 for(const path of ['index.html','ai-implementation/index.html','web-design/index.html','marketing-branding/index.html','web-design/industries/index.html']){
  for(const prefix of ['v2/','']){
   const target=new URL(prefix+path,root);let html=await readFile(target,'utf8');
   html=html.replace(/<section class="resource-discovery">[\s\S]*?<\/section>/g,'');
   html=html.replace(/<section class="preview-invitation"[^>]*>[\s\S]*?<\/section>/g,'');
   if(path==='index.html'){html=html.replace(/(<\/section>)/,`$1${previewInvitation}`);}else if(path==='web-design/index.html'){html=html.replace('</main>',previewInvitation+'</main>');}
   if(['index.html','web-design/index.html'].includes(path)){if(!html.includes('/v2/free-website-preview/preview.css'))html=html.replace('</head>','<link rel="stylesheet" href="/v2/free-website-preview/preview.css?v=1"></head>');}else{html=html.replace('<link rel="stylesheet" href="/v2/free-website-preview/preview.css?v=1">','');}
   html=html.replace('</main>',resourceDiscovery+'</main>');
   if(!html.includes('/v2/resources/resources.css'))html=html.replace('</head>',css+'</head>');
   html=html.replace(/resources\.css\?v=\d+/g,'resources.css?v=3');
   await writeFile(target,html);
  }
 }
 const sitemapPath=new URL('sitemap.xml',root);let sitemap=await readFile(sitemapPath,'utf8');
 sitemap=sitemap.replace(/\s*<url>\s*<loc>https:\/\/michaelmck\.site\/blog\/[^<]*<\/loc>[\s\S]*?<\/url>/g,'');
 for(const p of [...pages,contact,preview]){
  const article=publishedArticles.find(a=>route(a)===p.path);
  const modified=article?dates(article).dateModified:p.path==='/blog/'?publishedArticles.map(a=>dates(a).dateModified).sort().at(-1):null;
  if(!sitemap.includes(`<loc>${origin}${p.path}</loc>`))sitemap=sitemap.replace('</urlset>',`  <url><loc>${origin}${p.path}</loc>${modified?`<lastmod>${modified}</lastmod>`:''}</url>\n</urlset>`);
 }
 await writeFile(sitemapPath,sitemap);
 const otherRoutes=['/ai-implementation/','/web-design/','/marketing-branding/',...JSON.parse(await readFile(new URL('v2/industries/routes.json',root),'utf8'))];
 for(const path of ['/',...otherRoutes])for(const prefix of ['','v2/']){
  const target=new URL(prefix+path.slice(1)+'index.html',root);let html=await readFile(target,'utf8');
  html=html.replace(/<header class="site-header[^"]*">[\s\S]*?<\/header>/,siteHeader).replace(/href="mailto:michael\.mckerracher@gmail\.com\?subject=[^"]*"/g,'href="/contact/"');
  await writeFile(target,html);
 }
 const otherPages=await Promise.all(otherRoutes.map(async path=>{const html=await readFile(new URL(path.slice(1)+'index.html',root),'utf8');return {path,html,heading:text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||path),description:html.match(/<meta name="description" content="([^"]*)"/)?.[1]||''};}));
 await writeDiscovery([...otherPages,contact,preview,...pages],root);
 await writeFile(new URL('docs/editorial-2026-10-08/build-manifest.json',root),JSON.stringify(pages.map(p=>({path:p.path,title:p.title,words:markdown(p.html).split(/\s+/).length})),null,2)+'\n');
 console.log(`Built ${publishedArticles.length} published AEO articles (${articles.length-publishedArticles.length} queued) and resource index, plus discovery and internal links.`);
 return pages;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await buildResources();
