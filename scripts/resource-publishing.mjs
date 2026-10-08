import {readFileSync,existsSync,readdirSync} from 'node:fs';
const root=new URL('../',import.meta.url);
export const publishing=JSON.parse(readFileSync(new URL('content/resources/publishing.json',root),'utf8'));
export function localDate(now=new Date()){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function ready(a,asOf=localDate()){
 const p=publishing.articles[a.slug];
 return Boolean(p?.status==='approved'&&p.publishOn<=asOf);
}
export function dates(a){const p=publishing.articles[a.slug];if(!p)throw new Error(`Missing publication record: ${a.slug}`);return p;}
export function displayDate(day){return new Intl.DateTimeFormat('en-CA',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'}).format(new Date(day+'T12:00:00Z'));}
export function edited(a){
 const path=new URL(`content/resources/edited/${a.slug}.json`,root);
 if(!existsSync(path))return a;
 const e=JSON.parse(readFileSync(path,'utf8'));
 return {...a,...e,sections:a.sections.map((s,i)=>({...s,...e.sections[i]}))};
}
export function futureArticles(){
 const directory=new URL('content/resources/articles/',root);
 if(!existsSync(directory))return [];
 return readdirSync(directory).filter(name=>name.endsWith('.json')).sort().map(name=>JSON.parse(readFileSync(new URL(name,directory),'utf8')));
}
