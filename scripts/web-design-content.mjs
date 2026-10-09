// Practical buying information for the existing Kelowna service page.
// Keep questions and answers together so visible copy and structured data agree.
export const webDesignFaqs = [
  ['How much does a business website cost?', 'Every project has a written quote based on the pages, copy, design and functionality you need. A focused service website has a different scope from a booking system or online shop. Your proposal separates the build from hosting, software subscriptions and any ongoing support. The initial consultation is free.'],
  ['Can you improve my existing WordPress or Wix website?', 'Yes. We start with the pages, enquiries and search visibility you already have. The recommendation may be a focused improvement, a redesign on the same platform or a move to a better fit. A rebuild includes planning redirects for changed URLs and preserving useful content.'],
  ['Is SEO included in the website build?', 'The build includes agreed search foundations: page structure, descriptive titles and headings, crawlable content, internal links, a sitemap and appropriate structured data. Service and location pages are planned around what you actually offer. Ongoing SEO and Google Business Profile management can be scoped separately.'],
  ['Can you help my website appear in Google and AI search?', 'I structure your services, project evidence and answers so search engines can discover and understand them. Clear business information and useful, accessible content give Google and AI search tools material to work with. Placement in Google, ChatGPT or another answer engine is decided by that platform.'],
  ['Will I be able to edit the website myself?', 'If you want to manage content, we choose an editing setup that fits your team and include the agreed training and handover. You know where the domain, hosting, website and accounts live, what you control and which costs continue after launch.'],
  ['Do you work with businesses in Kelowna?', 'Yes. I am based in Coldstream and work with businesses in Kelowna, West Kelowna, Lake Country, Vernon and across the Okanagan. You work directly with me on the brief, design and build. We agree meeting arrangements, delivery dates and review stages at the start.']
];

export const webDesignDetails = () => `
<section class="concept-web-details concept-frame" id="website-deliverables">
  <div><h2>A website built around<br> the next customer.</h2><p>A repair customer needs a quick route to help. A guest needs to picture the stay. A professional-services client needs confidence before booking a call. The pages and the design should reflect that decision.</p></div>
  <dl class="concept-capabilities">
    <div><dt>The right pages, in the right order</dt><dd>Clear service descriptions, real project evidence and answers to buying questions. For businesses serving several Okanagan communities, useful location pages explain the work and coverage in each area.</dd></div>
    <div><dt>Design that earns attention</dt><dd>A consistent design system, strong imagery and layouts that work on a phone. People should understand the offer and find the call, enquiry or booking option without hunting for it.</dd></div>
    <div><dt>Search foundations, handled</dt><dd>Page titles, headings, internal links, structured data and sitemap discovery are part of the build. The site gives Google and AI search tools clear information about your business and the services customers can book.</dd></div>
    <div><dt>A working enquiry path</dt><dd>Contact forms, click-to-call links and booking integrations, with the agreed actions measured. We can also connect the next step to your team through <a href="/ai-implementation/">enquiry and follow-up workflows</a>.</dd></div>
  </dl>
</section>
<section class="concept-web-details concept-frame" id="website-platforms">
  <div><h2>The right platform.<br> Clear ownership.</h2><p>Your website should fit how you want to run it. We consider who will make updates, the features you need and the cost of keeping it working.</p><a href="/blog/kelowna-business-website-guide/">Plan your Kelowna business website</a></div>
  <dl class="concept-capabilities">
    <div><dt>WordPress websites &amp; redesigns</dt><dd>For businesses that need flexible content and an established editing system. An existing WordPress website can be reviewed for design, content, usability and maintenance needs before deciding how much to rebuild.</dd></div>
    <div><dt>Webflow, Wix &amp; Squarespace</dt><dd>Managed platforms can suit teams that want a visual editor and hosted tools. We compare them against the actual brief, including subscriptions, integrations and the changes you want to make yourself.</dd></div>
    <div><dt>Custom development &amp; handover</dt><dd>A custom build can offer more control over design, hosting and functionality. The proposal explains the editing setup, account ownership, training and ongoing support before you commit.</dd></div>
  </dl>
</section>`;

export const webDesignQuestions = () => `<section class="concept-web-faq concept-frame" id="website-questions"><h2>Before we build.</h2>${webDesignFaqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}<p><a href="/contact/">Tell me about your website</a>, and we can work through the right scope together.</p></section>`;
