import {writeFile,mkdir,readFile} from 'node:fs/promises';
const origin='https://michaelmck.site';
const person={'@type':'Person','@id':origin+'/#person',name:'Michael McKerracher',url:origin+'/',jobTitle:'AI implementation, web design and marketing consultant',homeLocation:{'@type':'Place',name:'Coldstream, British Columbia'}};
const serviceAreas=['Coldstream','Vernon','Lake Country','Kelowna','West Kelowna'].map(name=>({'@type':'Place',name:name+', British Columbia, Canada'}));
const plain=s=>s.replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
export function schemaFor(p){
 const page={'@type':p.article?'BlogPosting':p.path==='/blog/'?'CollectionPage':'WebPage','@id':origin+p.path,name:plain(p.heading),description:p.description,url:origin+p.path,inLanguage:'en-CA',author:{'@id':person['@id']},isPartOf:{'@id':origin+'/#website'}};
 if(p.article)Object.assign(page,{headline:plain(p.heading),datePublished:'2026-09-25',dateModified:'2026-09-25',image:origin+p.image});
 if(p.dateModified)page.dateModified=p.dateModified;
 const graph=[person,{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Michael McKerracher',publisher:{'@id':person['@id']}},page,{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},...(p.article?[{'@type':'ListItem',position:2,name:'Blog',item:origin+'/blog/'}]:[]),{'@type':'ListItem',position:p.article?3:2,name:plain(p.heading),item:origin+p.path}]}];
 if(!p.path.startsWith('/blog/')){const service={'@type':'Service','@id':origin+p.path+'#service',serviceType:p.serviceTypes||p.context,name:p.context,provider:{'@id':person['@id']},areaServed:[...serviceAreas,{'@type':'Place',name:'Okanagan, British Columbia, Canada'}],url:origin+p.path,description:p.description};if(p.path==='/ai-implementation/')service.hasOfferCatalog={'@type':'OfferCatalog',name:'AI implementation services',itemListElement:[{'@type':'Offer',name:'Free initial consultation',price:'0',priceCurrency:'CAD'},{'@type':'Offer',name:'AI audit and recommendations: five on-site hours across two to three weeks',price:'900',priceCurrency:'CAD'},{'@type':'Offer',name:'Custom implementation and maintenance from CAD 2,500 per month',priceSpecification:{'@type':'UnitPriceSpecification',minPrice:'2500',priceCurrency:'CAD',unitText:'month'}}]};graph.push(service);}
 if(p.faqs?.length)graph.push({'@type':'FAQPage','@id':origin+p.path+'#website-questions',mainEntity:p.faqs.map(([question,answer])=>({'@type':'Question',name:plain(question),acceptedAnswer:{'@type':'Answer',text:plain(answer)}}))});
 return {'@context':'https://schema.org','@graph':graph};
}
export function markdown(html){
 let s=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||html;
 s=s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g,'')
  .replace(/<table\b[^>]*>([\s\S]*?)<\/table>/g,(_,table)=>{
   const cell=value=>value.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,(_,href,label)=>`[${plain(label)}](${href.startsWith('/')?origin+href:href})`).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replaceAll('|','\\|').trim();
   const rows=[...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(([,row])=>[...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(([,v])=>cell(v)));
   if(!rows.length)return '';
   const caption=table.match(/<caption[^>]*>([\s\S]*?)<\/caption>/)?.[1];
   return `\n\n${caption?plain(caption)+'\n\n':''}| ${rows[0].join(' | ')} |\n| ${rows[0].map(()=>'---').join(' | ')} |\n${rows.slice(1).map(r=>'| '+r.join(' | ')+' |').join('\n')}\n\n`;
  })
  .replace(/<img[^>]*alt="([^"]*)"[^>]*>/g,(_,alt)=>`\n${alt}\n`)
  .replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/g,(_,attrs,body)=>{
   const label=attrs.match(/aria-label="([^"]+)"/)?.[1]||'Project video';
   const src=body.match(/(?:data-)?src="([^"]+)"/)?.[1];
   return src ? `\n[${label}](${src.startsWith('/')?origin+src:src})\n` : label;
  })
  .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,(_,href,label)=>`[${plain(label)}](${href.startsWith('/')?origin+href:href})\n`)
  .replace(/<li[^>]*>\s*(?=<h[1-6])/g,'')
  .replace(/<dt[^>]*>/g,'\n\n### ')
  .replace(/<\/dt>/g,'\n\n')
  .replace(/<\/?dd[^>]*>/g,'\n\n')
  .replace(/<h([1-6])[^>]*>/g,(_,n)=>'\n\n'+'#'.repeat(Number(n))+' ')
  .replace(/<br\s*\/?\s*>|<\/?span\b[^>]*>/g,' ')
  .replace(/<li[^>]*>/g,'\n- ')
  .replace(/<\/(p|h[1-6]|section|article|ul|figure|details|summary|div)>/g,'\n\n')
  .replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&nbsp;',' ')
  .replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
 return s.trim()+'\n';
}
export async function writeDiscovery(pages,root){
 // A partial service rebuild must not silently remove published collections.
 const merged=new Map(pages.map(p=>[p.path,p]));
 for(const manifest of ['v2/industries/routes.json','v2/resources/routes.json','v2/contact/routes.json','v2/free-website-preview/routes.json','v2/privacy/routes.json']){
  let routes=[];try{routes=JSON.parse(await readFile(new URL(manifest,root),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  for(const path of routes){if(merged.has(path))continue;let html;try{html=await readFile(new URL(path.slice(1)+'index.html',root),'utf8');}catch(error){if(error.code==='ENOENT')continue;throw error;}
   merged.set(path,{path,html,heading:plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||path),description:html.match(/<meta name="description" content="([^"]*)"/)?.[1]||''});
  }
 }
 pages=[...merged.values()];
 for(const p of pages){await mkdir(new URL(p.path.slice(1),root),{recursive:true});await writeFile(new URL(p.path.slice(1)+'index.md',root),`Source: ${origin+p.path}\n\n${markdown(p.html)}`);}
 const line=p=>`- [${plain(p.heading)}](${origin+p.path}index.md): ${p.description}`;
 const listing=pages.filter(p=>!p.path.startsWith('/blog/')&&p.path!=='/privacy/').map(line).join('\n')+'\n\n## Website guides, checklists and comparisons\n'+pages.filter(p=>p.path.startsWith('/blog/')).map(line).join('\n');
 await writeFile(new URL('llms.txt',root),`# Michael McKerracher\n\n> Independent AI implementation, web design and marketing services based in Coldstream, serving the Okanagan, British Columbia.\n\n## Portfolio\n- [Portfolio](${origin}/): Selected work and background.\n- [Cool Runnings case study](${origin}/v2/work/local-search-magnet.html): Website, local SEO and conversion work; 30% increase in qualified bookings.\n\n## Services\n${listing}\n\n## Contact\nFree initial consultation: michael.mckerracher@gmail.com.\nAI audit: CAD 900 once, five on-site hours across two to three weeks. Custom AI implementation and maintenance from CAD 2,500/month. Free homepage preview: https://michaelmck.site/free-website-preview/. Custom homepage design preview at no charge, with no obligation to commission a website. Full websites from CAD 2,500. Marketing is custom-quoted.\nPrivacy: https://michaelmck.site/privacy/ — enquiry, booking and website measurement information.\n`);
 await writeFile(new URL('llms-full.txt',root),pages.map(p=>`Source: ${origin+p.path}\n\n${markdown(p.html)}`).join('\n---\n\n'));
 await writeFile(new URL('robots.txt',root),'User-agent: *\nDisallow: /api/\n\nSitemap: https://michaelmck.site/sitemap.xml\n');
}
