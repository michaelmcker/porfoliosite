import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {trades} from './industry-content-trades.mjs';
import {professional} from './industry-content-professional.mjs';
import {places} from './industry-content-places.mjs';
import {siteHeader,headerStyles} from './site-header.mjs';
import {schemaFor,markdown,writeDiscovery} from './service-discovery.mjs';

const root=new URL('../',import.meta.url);
const origin='https://michaelmck.site';
const consult='mailto:michael.mckerracher@gmail.com?subject=Website%20consultation';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const para=s=>`<p>${esc(s)}</p>`;
const button=()=>`<a class="i-button" href="${consult}">Book a free consultation</a>`;
const css='<link rel="stylesheet" href="/v2/industries/industries.css?v=1">';
const catalogue={...trades,...professional,...places};
const groups=[['Trades & home services',Object.keys(trades)],['Professional & health services',Object.keys(professional)],['Hospitality, community & commerce',Object.keys(places)]];
const proofs={
 abc:{title:'ABC Appliance',text:'A local service website built around clear repair information, useful customer questions and a direct enquiry route. The work brings together design, service content and local SEO, with increased search visibility and consistency.',image:'/assets/selected-work/abc-appliance-live.png',alt:'ABC Appliance website showing appliance repair services and a request-service action',url:'https://www.abcappliance.ca/',link:'Visit ABC Appliance'},
 cool:{title:'Cool Runnings',text:'Website, local SEO and conversion work that brought a 30% increase in qualified bookings. Clear service pages, local coverage and a straightforward enquiry route connect the business with the work it wants.',image:'/assets/screens/cool-runnings-home.webp',alt:'Cool Runnings website presenting its Okanagan landscaping services',url:'/v2/work/local-search-magnet.html',link:'See the work'},
 treehouse:{title:'Okanagan Treehouse',text:'A distinctive place, presented through a distinctive website. The design brings the property, atmosphere and practical details together, giving guests a closer look at the stay they are considering.',image:'/v2/okanagan-preview/assets/overview-final.webp',alt:'Okanagan Treehouse accommodation website design',url:'https://okanagan-treehouse-preview.michael-mckerracher.workers.dev/',link:'Explore Okanagan Treehouse'},
 stjames:{title:'St. James School',text:'Design, marketing and donor storytelling brought together around the school’s future. The website and film give the vision a clear, visual expression and create a place for the community to learn more.',image:'/v2/industries/assets/st-james-campus.webp',alt:'St. James School campus imagery from the website project',url:'/marketing-branding/',link:'Explore the design and marketing work'},
 brand:{title:'Upon This Rock',text:'A distinctive visual identity and podcast artwork built around the character of the project. Brand, language and imagery work together to make a memorable first impression—the same care I bring to a business website.',image:'/assets/selected-work/upon-this-rock-identity.webp',alt:'Upon This Rock visual identity and podcast artwork',url:'/marketing-branding/',link:'Explore the branding work'}
};
const commonFaq=[['What will my website cost?','We agree the scope and quote first. The number of pages, content, design and integrations shape the project. Hosting, ongoing marketing and automation are priced separately, so you know what the build includes.'],['Can you work with my existing website?','Yes. We review the current pages, useful content, search traffic and enquiry routes before deciding what to retain or rebuild. Existing URLs and redirects are part of the launch plan.']];

function picture(slug,eager=false){return `<img src="/v2/industries/assets/${slug}.webp" srcset="/v2/industries/assets/${slug}-small.webp 768w, /v2/industries/assets/${slug}.webp 1536w" sizes="${eager?'(max-width: 760px) 100vw, (max-width: 1440px) 52vw, 720px':'(max-width: 420px) 100vw, (max-width: 760px) 45vw, 430px'}" width="1536" height="1024" alt="${esc(catalogue[slug].label)} website displayed on a laptop" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;}
function footer(){return `<div class="i-footer"><a href="/">Michael McKerracher</a><span>Coldstream, BC · Serving the Okanagan</span></div>`;}
function close(text){return `<section class="i-close"><div class="i-frame"><div class="i-close-grid"><h2>${esc(text)}</h2><div>${button()}<p>Tell me what you want more of.<br>We’ll work out what your website needs.</p></div></div>${footer()}</div></section>`;}
function sharedHead(p,schema){return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><link rel="canonical" href="${origin}${p.path}"><link rel="alternate" type="text/markdown" href="${p.path}index.md"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${p.path}"><meta property="og:image" content="${origin}${p.image}"><meta property="og:image:alt" content="${esc(p.heading)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg"><link rel="preload" href="/v2/assets/fonts/dm-sans-latin-variable.woff2" as="font" type="font/woff2" crossorigin>${css}${headerStyles}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script><script src="/assets/analytics.js" defer></script></head><body class="industry-page"><a class="i-skip" href="#main">Skip to content</a>${siteHeader}`;}
function pageSchema(p,faqs){
 const s=schemaFor(p), g=s['@graph'];
 const breadcrumb=g.find(x=>x['@type']==='BreadcrumbList');
 breadcrumb.itemListElement=[['Home','/'],['Web design','/web-design/'],['Industries','/web-design/industries/'],[p.label,p.path]].map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:origin+path}));
 g.find(x=>x['@type']==='WebPage').image=origin+p.image;
 g.push({'@type':'FAQPage','@id':origin+p.path+'#questions',mainEntity:faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))});
 return s;
}

function renderIndustry(slug,d,brief){
 const path=`/web-design/${slug}/`;
 const p={path,label:d.label,title:`${brief.title} | Michael McKerracher`,heading:d.headline.join(' '),description:d.intro,context:`Web design for ${d.label.toLowerCase()} in Kelowna and the Okanagan`,serviceTypes:['Website design','Website development','Local search optimisation'],image:`/v2/industries/assets/${slug}.webp`};
 const faqs=[...commonFaq,...d.faqs];
 const proof=proofs[d.proof];
 const trade=Object.hasOwn(trades,slug);
 const band=trade?`<h2><strong>30%</strong>more qualified bookings</h2><div class="i-band-copy"><p>Cool Runnings saw a 30% increase in qualified bookings following its website, local SEO and conversion work.</p><a class="i-text-link" href="/v2/work/local-search-magnet.html">See the work</a></div>`:`<h2>${esc(d.focus)}</h2><div class="i-band-copy"><p>Thoughtful design. Useful content. A clear next step.<br>A website built around the way your business works.</p><a class="i-text-link" href="#selected-work">Explore the work</a></div>`;
 const related=groups.find(([,slugs])=>slugs.includes(slug))[1].filter(s=>s!==slug).slice(0,3);
 p.html=sharedHead(p,pageSchema(p,faqs))+`<main id="main">
 <section class="i-hero i-frame"><div class="i-hero-copy"><h1><span>${esc(d.headline[0])}</span>${esc(d.headline[1])} <em>${esc(d.headline[2])}</em></h1><p class="i-intro">${esc(d.intro)}</p>${button()}<p class="i-location">Based in Coldstream. Working across the Okanagan.</p></div><figure class="i-hero-media">${picture(slug,true)}</figure></section>
 <section class="i-band"><div class="i-band-inner i-frame">${band}</div></section>
 <section class="i-section i-frame"><div class="i-decision-grid"><div><h2>${esc(d.decisionTitle)}</h2>${d.decisions.map(([title,text,result],i)=>`<article class="i-decision"><span class="i-number" aria-hidden="true">0${i+1}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="i-result">${esc(result)}</div></div></article>`).join('')}</div><aside class="i-aside"><p>${esc(d.decisionIntro)}</p><div class="i-paper"><h3>Before someone<br>takes the next step.</h3><ul class="i-question-list"><li>Is this right for me?</li><li>What makes you a good choice?</li><li>What do I need to know?</li><li>What happens when I get in touch?</li></ul></div></aside></div><div class="i-local"><h2>${esc(d.localTitle)}</h2><p>${esc(d.local)}</p></div></section>
 <section class="i-detail i-section"><div class="i-split i-frame"><h2>${esc(d.detailTitle)}</h2><div class="i-prose">${d.detail.map(para).join('')}</div></div></section>
 <section class="i-section i-frame"><div class="i-search"><div><h2>Built to be found.<br><em>Ready to be chosen.</em></h2>${para(d.searchDetail)}<p class="i-search-details">I handle the page hierarchy, H1s and H2s, titles, descriptions, internal links, structured data and sitemap. Your services, location and business information stay consistent across the website. We can add Google Business Profile management and useful local pages as the business grows.</p></div><div class="i-search-example"><blockquote>“${esc(d.searchQuestion)}”</blockquote>${para(d.searchAnswer)}</div></div></section>
 <section class="i-case i-section" id="selected-work" data-proof="${d.proof}"><div class="i-case-inner i-frame"><figure><img src="${proof.image}" alt="${proof.alt}" width="1200" height="750" loading="lazy" decoding="async"></figure><div><h2>${proof.title}</h2><p>${proof.text}</p><a class="i-text-link" href="${proof.url}">${proof.link}</a></div></div></section>
 <section class="i-section i-frame"><div class="i-enquiry-copy"><h2>${esc(d.enquiryTitle)}</h2><p>${esc(d.enquiry)}</p></div><ol class="i-handoff">${d.handoff.map((x,i)=>`<li><span aria-hidden="true">0${i+1}</span>${esc(x)}</li>`).join('')}</ol></section>
 <section class="i-delivery i-section"><div class="i-frame"><div class="i-split"><div><h2>A better website.<br>The foundations <em>handled.</em></h2><p class="i-delivery-intro">Clear scope, a considered design and a site you can keep building on.</p></div><ul class="i-inclusions"><li><h3>Content that helps people choose</h3><p>Useful service pages, original work and answers to the questions your customers ask. I plan the structure and write the content around the decisions that matter to your business.</p></li><li><h3>Design with a job to do</h3><p>A distinctive visual system, responsive layouts and clear contact actions. The website should communicate the quality of your business on a phone as well as a desktop.</p></li><li><h3>A setup that fits your business</h3><p>Platform, hosting, editing access and ownership agreed before we start. Choose a straightforward setup or more editing control, with training and ongoing support available.</p></li></ul></div><p class="i-delivery-scope">${esc(d.delivery)}</p></div></section>
 <section class="i-faq i-section" id="questions"><div class="i-split i-frame"><div><h2>A few practical<br>questions.</h2></div><div>${faqs.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>
 ${close(d.closing)}</main><div class="i-related i-frame"><a href="/web-design/industries/">Web design for your industry</a><nav aria-label="Related industries">${related.map(s=>`<a href="/web-design/${s}/">${esc(catalogue[s].label)}</a>`).join('')}</nav></div></body></html>`;
 return p;
}

function renderHub(){
 const p={path:'/web-design/industries/',title:'Website Design by Industry in Kelowna & the Okanagan | Michael McKerracher',heading:'A website built around your business.',description:'Explore website design for 24 industries in Kelowna and the Okanagan. Useful content, distinctive design, local SEO and clear enquiry routes.',context:'Industry-specific web design in Kelowna and the Okanagan',image:'/v2/industries/assets/plumbers.webp'};
 const s=schemaFor(p);s['@graph']=s['@graph'].filter(x=>x['@type']!=='Service');s['@graph'].find(x=>x['@type']==='WebPage')['@type']='CollectionPage';s['@graph'].push({'@type':'ItemList',itemListElement:Object.entries(catalogue).map(([slug,d],i)=>({'@type':'ListItem',position:i+1,name:d.label,url:origin+`/web-design/${slug}/`}))});
 p.html=sharedHead(p,s)+`<main id="main"><section class="i-frame"><div class="i-hub-hero"><h1>A website built around<br><em>your business.</em></h1><p>A better enquiry. A first appointment. A direct booking. Start with what your website needs to do, then build the design, content and search foundation around it.</p></div></section>${groups.map(([title,slugs])=>`<section class="i-hub-group i-frame"><h2>${title}</h2><div class="i-hub-grid">${slugs.map(slug=>`<a class="i-hub-card" href="/web-design/${slug}/">${picture(slug)}<h3>${esc(catalogue[slug].label)}</h3><p>${esc(catalogue[slug].focus)}</p></a>`).join('')}</div></section>`).join('')}${close('What could a better website do for your business?')}</main></body></html>`;
 return p;
}

const discoveryBlock=`<section class="industry-discovery" id="industries"><h2>Built around your business.</h2><p>A plumbing enquiry, a hotel booking and a first client consultation need different websites. Explore the content, design and enquiry paths for your industry.</p><nav aria-label="Website industries"><a href="/web-design/plumbers/">Plumbers</a><a href="/web-design/hotels/">Hotels</a><a href="/web-design/law-firms/">Law firms</a><a href="/web-design/charities/">Charities</a><a href="/web-design/industries/">Explore all 24 industries</a></nav></section>`;

export async function buildIndustries(){
 const briefs=JSON.parse(await readFile(new URL('docs/industry-pages-2026-10-07/source-briefs.json',root),'utf8'));
 if(briefs.length!==24||Object.keys(catalogue).length!==24)throw new Error('Expected all 24 researched industries');
 const pages=briefs.map(brief=>{if(!catalogue[brief.slug])throw new Error(`Missing ${brief.slug}`);return renderIndustry(brief.slug,catalogue[brief.slug],brief)});
 pages.push(renderHub());
 for(const p of pages){for(const prefix of ['','v2/']){const target=new URL(prefix+p.path.slice(1),root);await mkdir(target,{recursive:true});await writeFile(new URL('index.html',target),p.html);}}
 await writeFile(new URL('v2/industries/routes.json',root),JSON.stringify(pages.map(p=>p.path),null,2)+'\n');
 // Preserve the current service pages; insert only their link into this new collection.
 for(const prefix of ['','v2/']){
  const path=new URL(prefix+'web-design/index.html',root);
  let html=await readFile(path,'utf8');
  html=html.replace(/<section class="industry-discovery"[\s\S]*?<\/section>/,'');
  html=html.replace('</main>',discoveryBlock+'</main>');
  if(!html.includes('/v2/industries/industries.css'))html=html.replace('</head>',css+'</head>');
  await writeFile(path,html);
 }
 const services=[];
 for(const path of ['/ai-implementation/','/web-design/','/marketing-branding/']){
  const html=await readFile(new URL(path.slice(1)+'index.html',root),'utf8');
  services.push({path,html,heading:html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||path,description:html.match(/<meta name="description" content="([^"]*)"/)?.[1]||''});
 }
 await writeDiscovery([...services,...pages],root);
 const sitemapPath=new URL('sitemap.xml',root);let sitemap=await readFile(sitemapPath,'utf8');
 for(const p of pages){if(!sitemap.includes(`<loc>${origin}${p.path}</loc>`))sitemap=sitemap.replace('</urlset>',`  <url><loc>${origin}${p.path}</loc></url>\n</urlset>`);}
 await writeFile(sitemapPath,sitemap);
 const manifest=pages.map(p=>({path:p.path,title:p.title,words:markdown(p.html).split(/\s+/).length,image:p.image}));
 await writeFile(new URL('docs/industry-pages-2026-10-07/build-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
 console.log(`Built ${pages.length-1} industry pages and their index, Markdown, schema, sitemap and discovery files.`);
 return pages;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await buildIndustries();
