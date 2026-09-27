import {serviceProcess} from './service-process.mjs';

const proposal = `<figure class="service-hero-proposal"><a href="/proposal-generator.html" aria-label="Try the system that creates this tailored sales proposal"><img src="/assets/samples/vertical-impression-local-proposal-current.png" width="1632" height="2112" fetchpriority="high" decoding="async" alt="A finished customer-specific sales proposal produced by the Vertical Impression system, with campaign creative and a local advertising map"></a></figure>`;
const schoolFilm = `<figure class="service-hero-film"><video controls playsinline preload="none" poster="/assets/selected-work/st-james-film.jpg" aria-label="St. James School patronage film"><source src="https://st-james-school-prototype.vercel.app/videos/st-james-donor-film-2026-09-21-16x9.mp4" type="video/mp4"></video></figure>`;

const introductions = [
 ['AI implementation &amp; business automation in the Okanagan.', 'An enquiry waiting for an answer. A proposal that takes an afternoon. A report rebuilt every week. We start with the work that gets in your way, then build a practical way to get it done. The proposal above is an output from the sales system I built for Vertical Impression.'],
 ['Web design &amp; development in the Okanagan.', 'Give people a feel for the stay, confidence in the service or a reason to visit. Your website should make the quality of your business visible, then make calling, enquiring or booking feel like the obvious next step.'],
 ['Branding &amp; marketing for Okanagan businesses.', 'People need to understand what makes you worth choosing. I bring the message and visual direction together across branding, websites, ads and video, so every piece helps tell the same story.']
];
const serviceIntroduction = ([title, copy]) => `<section class="service-introduction page-frame"><h2>${title}</h2><p>${copy}</p></section>`;

export function saasServices(pages) {
 const [ai, web, marketing] = pages;
 ai.heading = 'More bookings.<br><em>Less busywork.</em>';
 ai.hero = proposal;
 ai.image = '/assets/samples/vertical-impression-local-proposal-current.png';
 ai.title = 'AI Implementation & Automation in the Okanagan | Michael McKerracher';
 ai.description = 'AI implementation and business automation for Okanagan businesses. Faster follow-up, less admin and practical team training. Based in Coldstream, serving Vernon and Kelowna.';
 web.heading = 'Beautiful websites.<br><em>Built to win business.</em>';
 web.heroProject = true;
 web.description = 'Custom web design and development for Okanagan businesses. Distinctive websites built around enquiries, calls and bookings. Serving Vernon, Kelowna and beyond.';
 marketing.heading = 'Give people a reason<br><em>to choose you.</em>';
 marketing.hero = schoolFilm;
 marketing.image = '/assets/selected-work/st-james-film.jpg';
 marketing.description = 'Branding and marketing for Okanagan businesses: brand identity, websites, ads and video. Based in Coldstream, serving Vernon and Kelowna. Custom project quotes.';

 for (const [index, page] of pages.entries()) {
  page.saas = true;
  page.caption = '';
  page.body = serviceIntroduction(introductions[index]) + page.body.replaceAll('<br>', ' ');
  page.cta = ['Book a free consultation', page.cta[1], page === ai ? 'Try a working example' : page === web ? 'Explore AI Catalyst' : 'See the work', page === ai ? '/proposal-generator.html' : page === web ? 'https://ai-catalyst-wheat.vercel.app/' : '#selected-work'];
 }
 serviceProcess(pages);
}
