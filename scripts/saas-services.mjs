export function saasServices(pages){
 const [ai,web,marketing]=pages;
 const sections=p=>p.body.match(/<section\b[\s\S]*?<\/section>/g)||[];
 ai.hero=`<figure class="saas-workflow-preview"><picture><source media="(max-width:699px)" srcset="/v2/assets/workflows/content-production-approved-mobile.png"><img src="/v2/assets/workflows/content-production-approved-desktop.png" width="1672" height="941" alt="Actual content-production workflow: research, briefing, review and publishing" fetchpriority="high"></picture></figure>`;
 ai.caption='A working example: research to reviewed, published content.';
 ai.image='/v2/assets/workflows/content-production-approved-desktop.png';
 ai.intro='Turn repetitive work into reliable workflows. Custom AI skills, connected tools and practical training for the team behind your business.';
 web.caption='<a href="https://ai-catalyst-wheat.vercel.app/">AI Catalyst · Explore the website</a>';
 const film=marketing.body.match(/<figure class="school-film[\s\S]*?<\/figure>/)?.[0];
 marketing.hero=film||'';
 marketing.caption='St. James School · Campaign film';
 marketing.image='/assets/selected-work/st-james-film.jpg';
 marketing.body=marketing.body.replace(/<article class="work-object work-object-school">[\s\S]*?<\/article>/,'');
 for(const p of pages){
  p.saas=true;
  p.body=p.body.replaceAll('<br>',' ');
  p.cta=['Book a free consultation',p.cta[1],'See the work','#selected-work'];
  const content=sections(p),features=content.find(x=>x.includes('class="offer-columns"'));
  if(features)p.body=features+content.filter(x=>x!==features).join('');
  p.switcher=`<nav class="offering-switcher" aria-label="Explore the three offerings">${pages.map(q=>`<a href="${q.path}"${q===p?' aria-current="page"':''}>${q===ai?'AI implementation':q===web?'Web design':'Marketing & branding'}</a>`).join('')}</nav>`;
 }
}
