import {writeFile,mkdir,readFile} from 'node:fs/promises';
const origin='https://michaelmck.site';
const person={'@type':'Person','@id':origin+'/#person',name:'Michael McKerracher',url:origin+'/',jobTitle:'AI implementation, web design and marketing consultant',homeLocation:{'@type':'Place',name:'Coldstream, British Columbia'}};
const serviceAreas=['Coldstream','Vernon','Lake Country','Kelowna','West Kelowna'].map(name=>({'@type':'Place',name:name+', British Columbia, Canada'}));
const plain=s=>s.replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
export function schemaFor(p){
 const page={'@type':p.article?'BlogPosting':p.path==='/blog/'?'CollectionPage':'WebPage','@id':origin+p.path,name:plain(p.heading),description:p.description,url:origin+p.path,inLanguage:'en-CA',author:{'@id':person['@id']},isPartOf:{'@id':origin+'/#website'}};
 if(p.article)Object.assign(page,{headline:plain(p.heading),datePublished:'2026-09-25',dateModified:'2026-09-25',image:origin+p.image});
 const graph=[person,{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Michael McKerracher',publisher:{'@id':person['@id']}},page,{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},...(p.article?[{'@type':'ListItem',position:2,name:'Blog',item:origin+'/blog/'}]:[]),{'@type':'ListItem',position:p.article?3:2,name:plain(p.heading),item:origin+p.path}]}];
 if(!p.path.startsWith('/blog/')){const service={'@type':'Service','@id':origin+p.path+'#service',serviceType:p.serviceTypes||p.context,name:p.context,provider:{'@id':person['@id']},areaServed:[...serviceAreas,{'@type':'Place',name:'Okanagan, British Columbia, Canada'}],url:origin+p.path,description:p.description};if(p.path==='/ai-implementation/')service.hasOfferCatalog={'@type':'OfferCatalog',name:'AI implementation services',itemListElement:[{'@type':'Offer',name:'Free initial consultation',price:'0',priceCurrency:'CAD'},{'@type':'Offer',name:'AI audit and recommendations: five on-site hours across two to three weeks',price:'900',priceCurrency:'CAD'},{'@type':'Offer',name:'Custom implementation and maintenance from CAD 2,500 per month',priceSpecification:{'@type':'UnitPriceSpecification',minPrice:'2500',priceCurrency:'CAD',unitText:'month'}}]};graph.push(service);}
 return {'@context':'https://schema.org','@graph':graph};
}
export function markdown(html){
 let s=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||html;
 s=s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g,'')
  .replace(/<img[^>]*alt="([^"]*)"[^>]*>/g,(_,alt)=>`\n${alt}\n`)
  .replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/g,(_,attrs,body)=>{
   const label=attrs.match(/aria-label="([^"]+)"/)?.[1]||'Project video';
   const src=body.match(/(?:data-)?src="([^"]+)"/)?.[1];
   return src ? `\n[${label}](${src.startsWith('/')?origin+src:src})\n` : label;
  })
  .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,(_,href,label)=>`[${plain(label)}](${href.startsWith('/')?origin+href:href})\n`)
  .replace(/<li[^>]*>\s*(?=<h[1-6])/g,'')
  .replace(/<h([1-6])[^>]*>/g,(_,n)=>'\n\n'+'#'.repeat(Number(n))+' ')
  .replace(/<br\s*\/?\s*>|<\/?span\b[^>]*>/g,' ')
  .replace(/<li[^>]*>/g,'\n- ')
  .replace(/<\/(p|h[1-6]|section|article|ul|figure|details|summary|div)>/g,'\n\n')
  .replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&nbsp;',' ')
  .replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
 return s.trim()+'\n';
}
export async function writeDiscovery(pages,root){
 for(const p of pages){await mkdir(new URL(p.path.slice(1),root),{recursive:true});await writeFile(new URL(p.path.slice(1)+'index.md',root),`Source: ${origin+p.path}\n\n${markdown(p.html)}`);}
 const listing=pages.map(p=>`- [${plain(p.heading)}](${origin+p.path}index.md): ${p.description}`).join('\n');
 await writeFile(new URL('llms.txt',root),`# Michael McKerracher\n\n> Independent AI implementation, web design and marketing services based in Coldstream, serving the Okanagan, British Columbia.\n\n## Portfolio\n- [Portfolio](${origin}/): Selected work and background.\n- [Cool Runnings case study](${origin}/v2/work/local-search-magnet.html): Local website and search work; sales result attributed to client report.\n\n## Services and articles\n${listing}\n\n## Contact\nFree initial consultation: michael.mckerracher@gmail.com.\nAI audit: CAD 900 once, five on-site hours across two to three weeks. Custom AI implementation and maintenance from CAD 2,500/month. Web design and marketing are custom-quoted.\n`);
 await writeFile(new URL('llms-full.txt',root),pages.map(p=>`Source: ${origin+p.path}\n\n${markdown(p.html)}`).join('\n---\n\n'));
 await writeFile(new URL('robots.txt',root),'User-agent: *\nDisallow: /api/\n\nSitemap: https://michaelmck.site/sitemap.xml\n');
}
