// Commercial pages stay concise; detailed reading remains in the linked blog.
export function compactServices(pages, {section, columns, link, closing}) {
 const [ai, web, marketing] = pages;
 const sections = html => html.match(/<section\b[\s\S]*?<\/section>/g) || [];
 const pick = (html, phrase) => sections(html).find(s => s.includes(phrase)) || '';
 const consult = 'mailto:michael.mckerracher@gmail.com?subject=Free%20initial%20consultation';
 ai.heading = 'More bookings.<br><em>Less busywork.</em>';
 ai.intro = 'Custom workflows that help your team reply sooner, follow up consistently and spend less time preparing the same work.';
 ai.cta = ['Book a free consultation', consult];
 ai.hero = `<figure class="offer-workflow"><a href="/v2/workflows/local-prospecting-enrichment.html" aria-label="Explore the local prospecting and proposal workflow"><picture><source media="(max-width: 699px)" srcset="/v2/assets/workflows/local-prospecting-mobile.png" width="864" height="1821"><img src="/v2/assets/workflows/local-prospecting-desktop.png" width="1660" height="948" alt="Actual portfolio workflow: local prospect research, nearby advertising inventory, tailored proposal and reviewed outreach" fetchpriority="high"></picture></a></figure>`;
 ai.image = '/v2/assets/workflows/local-prospecting-desktop.png';
 ai.caption = 'From the portfolio: local prospecting, tailored proposals and reviewed outreach. Explore the workflow.';
 ai.body = section('Make the next step happen.', 'I design, build and maintain workflows around the way your business works.', columns([
 ['Reply sooner.','Collect the details from an enquiry and prepare a useful response for your team to review.'],
 ['Keep following up.','Make the next action visible, with a clear owner and fewer enquiries left waiting.'],
 ['Cut the preparation.','Bring customer information and approved material together for proposals, content and reporting.']
 ])+'<p class="offer-note">Setup and practical training with ChatGPT, Claude Cowork and Gemini, plus custom connections where needed. We test the workflow with your team and maintain the agreed system.</p>')
 + pick(ai.body,'Less preparation.')
 + pick(ai.body,'id="pricing"')
 + closing('Where is the work<br>getting stuck?',`Start with a free conversation, or ${link('read how to choose your first workflow','/blog/what-to-automate-first/')}.`);
 web.body = pick(web.body,'id="design-work"')
 + pick(web.body,'Design with a sense') .replace('offer-proof page-frame offer-proof-reverse','offer-proof page-frame offer-proof-reverse rccv-proof-band')
 + section('Beautiful to look at.<br>Easy to act on.','Custom web design and development for Okanagan businesses, from the first page plan to launch.',columns([
 ['Design & content','A visual direction built from your business, real imagery and clear writing. Responsive layouts that give every page a purpose.'],
 ['Search & enquiries','Useful service pages, search metadata, schema and a sitemap. Clear routes to call, enquire or book, checked on mobile.'],
 ['Build & handover','The functionality you need, tested customer journeys and agreed editing and maintenance arrangements.']
 ]))
 + pick(web.body,'id="proof"')
 + pick(web.body,'Custom work.')
 + closing('Let’s build a site<br>worth choosing.',`Tell me what it needs to achieve. ${link('Read what makes a website earn an enquiry','/blog/website-that-turns-visits-into-enquiries/')}.`);
 marketing.intro = 'Get found by the right people. Make your offer clear. Give them a reason to call, book or buy.';
 marketing.hero = '<figure class="offer-screen"><img src="/assets/screens/vertical-impression-proposal-story-boomerang-poster.jpg" width="1440" height="900" alt="Vertical Impression product story from the portfolio" fetchpriority="high"></figure>';
 marketing.image = '/assets/screens/vertical-impression-proposal-story-boomerang-poster.jpg';
 marketing.caption = 'Actual work: the Vertical Impression product story, featured in the portfolio.';
 marketing.cta = ['Discuss your marketing',consult,'View the product story','https://www.verticalimpression.com/proposal-story'];
 marketing.body = section('From being found<br>to being chosen.','Marketing and branding support built around your next business priority.',columns([
 ['Positioning & brand','Clarify your audience, offer and reasons to choose you. Turn that into messaging and a visual direction for your website and materials.'],
 ['Local search & content','Improve service pages, local SEO and Google Business Profile information. Create case studies and useful content around real customer questions.'],
 ['Campaigns & sales support','Connect campaign creative, landing pages, email and sales materials to a clear action. Agree what to measure and use it to guide the next improvement.']
 ]))
 + pick(marketing.body,'id="proof"')
 + pick(marketing.body,'Scoped to the work.')
 + closing('What do you want<br>to be known for?',`Let’s work out what your customers need to see next. ${link('Read the local marketing plan','/blog/local-marketing-plan/')}.`);
 for(const p of pages)p.compact=true;
}
