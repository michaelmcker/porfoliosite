// Service pages use stills of the actual work. The homepage keeps its interactive showcases.
const chapter = (intro, body) => `<section class="service-cases" id="selected-work"><div class="page-frame"><header class="service-cases-heading"><h2>Selected work</h2><p>${intro}</p></header><div class="service-case-list">${body}</div></div></section>`;

const caseStudy = ({title, meta, copy, image, alt, href, action, kind = 'screen', width = 1440, height = 900}) => `<article class="service-case"><div class="service-case-copy"><h3>${title}</h3><p class="service-case-meta">${meta}</p><p>${copy}</p><a class="service-case-link" href="${href}">${action}</a></div><figure class="service-case-media service-case-media-${kind}"><img src="${image}" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${alt}"></figure></article>`;

const workflow = ({title, copy, image, mobile, href}) => `<article class="service-case"><div class="service-case-copy"><h3>${title}</h3><p>${copy}</p><a class="service-case-link" href="${href}">See how it works</a></div><figure class="service-case-media service-case-media-workflow"><picture><source media="(max-width:699px)" srcset="/v2/assets/workflows/${mobile}"><img src="/v2/assets/workflows/${image}" width="1672" height="941" loading="lazy" decoding="async" alt="Artwork from the ${title.toLowerCase()} workflow"></picture></figure></article>`;

export function selectedServices(pages, {section, columns, closing}) {
 const [ai, web, marketing] = pages;
 const pricing = (ai.body.match(/<section\b[\s\S]*?<\/section>/g) || []).find(s => s.includes('id="pricing"')) || '';

 ai.intro = 'AI implementation that helps you respond faster, win more bookings and spend less time on repeat work. I build custom workflows and skills, set up the right tools and train your team to use them.';
 ai.body = chapter('Real systems for research, sales preparation and reporting.', [
  workflow({title:'Content that brings the right people in', copy:'Research, briefing, drafting and human review connected to publishing and measurement.', image:'content-production-approved-desktop.png', mobile:'content-production-approved-mobile.png', href:'/v2/workflows/content-production.html'}),
  workflow({title:'From a prospect to a tailored proposal', copy:'Local business research and nearby inventory become a proposal that a salesperson reviews before outreach.', image:'local-prospecting-desktop.png', mobile:'local-prospecting-mobile.png', href:'/v2/workflows/local-prospecting-enrichment.html'}),
  workflow({title:'The numbers in one working view', copy:'A dashboard that puts performance, content operations and client notes where a team can act on them.', image:'agency-dashboard-desktop.png', mobile:'agency-dashboard-mobile.png', href:'/v2/workflows/agency-management-dashboard.html'})
 ].join('')) + section('How I can help.', 'Custom AI skills, connected workflows and practical tool implementation. Training and ongoing support are part of the work.', columns([
  ['Custom workflows', 'Connect research, enquiries, content, proposals and reporting to the next step in your process.'],
  ['Custom AI skills', 'Reusable instructions, reference material and checks that help AI do a specific job your way.'],
  ['Tools and training', 'Set up ChatGPT, Claude Cowork or Gemini around real team tasks, then teach your people how to use them.']
 ])) + pricing + closing('What would you like<br>to take off your plate?', 'Let’s look at the work together and choose a useful place to start.');

 web.intro = 'A website should look like your business and make the next step easy. I bring the story, imagery, design and development together around the calls, enquiries or bookings you need.';
 web.hero = `<figure class="service-hero-website" aria-label="AI Catalyst website preview"><div class="catalyst-window"><iframe src="/v2/catalyst-preview/index.html?v=3" title="Still preview of the AI Catalyst website" data-service-preview tabindex="-1" loading="eager"></iframe></div></figure>`;
 web.image = '/v2/catalyst-preview/imported-01-5eab9f1356.webp';
 web.cta = ['Discuss your website', web.cta[1], 'Explore AI Catalyst', 'https://ai-catalyst-wheat.vercel.app/'];
 web.body = chapter('Different businesses. Different sites. Each one built around the decision a visitor needs to make.', [
  caseStudy({title:'A community site, made easier to use.', meta:'RCCV · Website design and development', copy:'A new parish website with clear paths to Mass times, sacraments, community information and the interactive Stations of the Cross.', image:'/assets/device-mockups/laptop-three-quarter-rccv-cutout.webp', alt:'RCCV website displayed in its original laptop composition', href:'/#work', action:'Explore the project', kind:'laptop', width:1170, height:814}),
  caseStudy({title:'A place worth staying for.', meta:'Okanagan Treehouse · Website design and development', copy:'The property’s own imagery anchors distinct stories for the Treehouse and Cabin, with a clear path from discovery to booking.', image:'/v2/okanagan-preview/assets/overview-final.webp', alt:'Original Okanagan Treehouse website hero image showing the illuminated property among trees', href:'/#work', action:'See selected work', kind:'photo', width:1920, height:1080})
 ].join('')) + section('From first impression<br>to the next step.', 'Website projects include the agreed content, design, development, search foundations and launch support. We scope pages and functionality together, then set a clear cost.', columns([
  ['Design', 'Distinctive layouts, considered typography and real imagery. Mobile gets its own composition.'],
  ['Build', 'Responsive development and clear routes to call, book or enquire.'],
  ['Launch', 'Content review, accessibility checks, SEO metadata, schema, sitemap and an agreed handover.']
 ])) + closing('A website that feels<br>like your business.', 'Start with a free consultation. Website work is custom scoped and quoted.');

 marketing.heading = 'Work that gets<br><em>people interested.</em>';
 marketing.intro = 'Branding, websites, ads and video design. A clear idea, carried through the things your customers actually see.';
 marketing.body = chapter('A film, a product story and a local business presence: three different jobs for design and marketing.', [
  caseStudy({title:'Make the opportunity clear.', meta:'Vertical Impression · Product marketing', copy:'A page that explains where elevator advertising reaches people and gives the sales team a concrete story to use in conversation.', image:'/assets/screens/vertical-impression-why-elevators.png', alt:'Vertical Impression product website explaining elevator advertising', href:'https://www.verticalimpression.com/why-elevators', action:'Explore the product story'}),
  caseStudy({title:'Be found when local customers are looking.', meta:'Cool Runnings · Local marketing and website', copy:'Service pages, useful guides and clear contact routes give customers more ways to discover the business and ask for an estimate.', image:'/assets/screens/cool-runnings-home.webp', alt:'Cool Runnings website showing its local landscaping offer and enquiry options', href:'/v2/work/local-search-magnet.html', action:'Read the case study'})
 ].join('')) + section('One idea.<br>Carried through the work.', 'Marketing and branding projects are scoped around your audience, offer and next business priority.', columns([
  ['Branding and websites', 'Positioning, messaging and visual direction brought into a site that helps people understand and choose you.'],
  ['Ads and campaigns', 'Creative and landing pages built around a specific offer and customer action.'],
  ['Video design', 'Story, visual direction and edited film that make an idea or project easier to see.']
 ])) + closing('What should people<br>know you for?', 'We agree the deliverables, timing and cost before work begins.');
}
