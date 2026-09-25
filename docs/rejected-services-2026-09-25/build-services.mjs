import { mkdir, writeFile } from 'node:fs/promises';

// Editorial source and templates for the services extension. No runtime dependency.
const root = new URL('../', import.meta.url);
const domain = 'https://michaelmck.site';
const email = 'mailto:michael.mckerracher@gmail.com?subject=Let%E2%80%99s%20discuss%20a%20project';
const consult = 'mailto:michael.mckerracher@gmail.com?subject=Free%20initial%20consultation';
const caseURL = '/v2/work/local-search-magnet.html';
const workflow = '/v2/workflows/content-production.html';
const rows = (items) => `<div class="service-list">${items.map(([title, copy, url, label]) => `<article class="service-row"><h3>${title}</h3><p>${copy}</p><a href="${url}">${label || 'Explore the service'} <span aria-hidden="true">&nbsp;↗</span></a></article>`).join('')}</div>`;
const bullets = (items) => `<ul class="service-bullets">${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
const section = (title, body, id = '') => `<section class="service-section page-frame"${id ? ` id="${id}"` : ''}><h2>${title}</h2>${body}</section>`;
const links = (items) => `<div class="service-links">${items.map(([title, url]) => `<a href="${url}">${title} <span aria-hidden="true">&nbsp;↗</span></a>`).join('')}</div>`;
const dimensions = {
  '/assets/screens/cool-runnings-home.webp': [1440, 900],
  '/assets/screens/vertical-impression-why-elevators.png': [1440, 900],
  '/v2/assets/workflows/content-production-approved-desktop.png': [1672, 941],
  '/v2/assets/workflows/content-production-approved-mobile.png': [864, 1821],
};
const image = (src, alt, caption = '', mobile = '') => `<figure class="service-evidence"><picture>${mobile ? `<source media="(max-width: 760px)" srcset="${mobile}" width="${dimensions[mobile][0]}" height="${dimensions[mobile][1]}">` : ''}<img src="${src}" width="${dimensions[src][0]}" height="${dimensions[src][1]}" alt="${alt}" loading="lazy" decoding="async"></picture>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
const faqs = (items) => section('A few things you might be wondering.', `<div class="service-faq">${items.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`);
const evidence = () => `<section class="service-section page-frame service-feature">${image('/assets/screens/cool-runnings-home.webp', 'Cool Runnings landscaping website with project photography and service information')}<div class="service-feature-copy"><h2>A local business.<br>A useful website.<br>A system behind it.</h2><p>For Cool Runnings, the work connected a new website with local service pages, practical guides, calculators and search measurement.</p><p class="service-quote">30%</p><p class="service-note">Client-reported increase in sales after launch.</p>${links([['Read the case study', caseURL], ['View the performance report', `${caseURL}#results-title`]])}</div></section>`;
const aiProof = () => section('See the work behind the offer.', `${image('/v2/assets/workflows/content-production-approved-desktop.png', 'Approved content workflow showing research, briefing, drafting, human review and publishing', 'An existing content workflow. Research, brand context, review and publishing each have a defined place.', '/v2/assets/workflows/content-production-approved-mobile.png')}${links([['Explore the content workflow', workflow], ['Try the proposal builder', '/proposal-generator.html'], ['See the reporting dashboard', '/v2/workflows/agency-management-dashboard.html']])}`);
const offers = () => section('A clear place to start.', `<div class="service-offers"><article><h3>Understand the opportunity.</h3><p class="service-price">$900 <small>audit</small></p><p>Five hours on site, spread over two to three weeks. A detailed report covering your current setup, automation opportunities, off-the-shelf tools and recommended next steps.</p>${links([['Explore the AI audit', '/services/ai-audit/']])}</article><article><h3>Have it built for you.</h3><p class="service-price"><small>From </small>$2,500<small> / month</small></p><p>Custom AI systems, designed around your work and maintained as your business changes. We agree the priorities and scope before building.</p>${links([['Discuss a custom system', consult]])}</article></div><p class="service-note">Prices in Canadian dollars. Implementation scope and third-party software costs are agreed separately.</p>`, 'engagements');

const pages = [
  {
    path: '/services/', title: 'AI Implementation, Web Design & Marketing in the Okanagan',
    description: 'Work with Michael McKerracher in Coldstream, BC. AI implementation, web design and development, branding and marketing. Start with a free consultation.',
    heading: 'Good work.<br><em>Built around your business.</em>',
    intro: 'AI systems that do useful work. Websites that help people choose you. A clearer story for what you sell. I work with Okanagan businesses to make those things happen.',
    secondary: ['Explore the services', '#services'],
    body: section('What can we build together?', rows([
      ['AI implementation', 'Find the right opportunities, connect your tools, build custom agents and help your team put them to work.', '/services/ai-implementation/'],
      ['Web design &amp; development', 'Give your business a considered website, with useful content, clear customer journeys and a foundation for search.', '/services/web-design-development/'],
      ['Branding &amp; marketing', 'Clarify your positioning and bring it into your messaging, visual direction, campaigns and sales material.', '/services/branding-marketing/'],
    ]), 'services') + evidence() + section('One person who can connect the pieces.', `<div class="service-split"><p>A website, a campaign and an internal workflow often depend on the same thing: understanding the business. I bring the strategy, design and implementation together so the work has a clear purpose from the start.</p><div><p>My background spans marketing, customer experience, product stories and the systems that support delivery. The portfolio shows what that looks like in practice.</p>${links([['Explore selected work', '/#work'], ['A little about me', '/#about']])}</div></div>`) + section('Start with a conversation.', `<p>Tell me what you are trying to improve, what you have already tried and where the work gets stuck. The initial consultation is free. We can work out whether you need an assessment, a defined project or ongoing implementation.</p>${links([['See the $900 AI audit', '/services/ai-audit/'], ['Read practical guides', '/guides/']])}`) + faqs([
      ['Where do you work?', 'I’m based in Coldstream, BC, and work with businesses across the Okanagan. We agree on-site locations and scheduling before an engagement; remote collaboration is available too.'],
      ['Can we start with one project?', 'Yes. You can bring a website, a positioning problem or one workflow to improve. We define the work around the problem you need solved.'],
      ['Do I need all three services?', 'No. Each service can stand on its own. When the work overlaps, we can plan it together.'],
    ]),
  },
  {
    path: '/services/ai-implementation/', title: 'AI Implementation & Workflow Automation in the Okanagan',
    description: 'Custom AI agents, workflow automation and ongoing maintenance for Okanagan businesses. $900 audits and custom systems from $2,500/month.',
    heading: 'Put AI to work.<br><em>In your actual business.</em>',
    intro: 'I help you identify useful applications of AI, design systems around your work and maintain them as your business changes. Custom agents, connected workflows and a team that knows how to use them.',
    secondary: ['Explore the $900 audit', '/services/ai-audit/'],
    body: section('Start with a task worth improving.', `<div class="service-split"><p>Reports take too long to assemble. Proposals start from scratch. Useful information is scattered across documents and inboxes. These are the kinds of problems we can examine together.</p><p>Sometimes the answer is a feature in software you already use. Sometimes it is a predictable automation. Sometimes a custom AI assistant is a better fit. The first step is choosing the right approach.</p></div>`) + section('What implementation can include.', rows([
      ['Custom AI agents', 'Assistants that use your business information to help with a defined job, with clear boundaries and review points.', '/guides/ai-agent-or-automation/', 'Understand the options'],
      ['Connected workflows', 'Connect inputs, tools and outputs so a repeatable process needs fewer manual handoffs. Test the exceptions as well as the happy path.', workflow, 'See a working example'],
      ['Team training', 'Work through real tasks with your team, document what works and help people evaluate the output.', '/services/ai-training/', 'Explore training'],
    ])) + offers() + aiProof() + section('Build it. Use it. Keep it working.', `<div class="service-split"><div><h3>Define and build.</h3><p>We choose a priority, map the current process, confirm the information and tools involved, and agree what a successful result looks like. The first version is tested on representative work before it becomes part of the routine.</p></div><div><h3>Maintain and improve.</h3><p>Tools, inputs and business needs change. Ongoing work covers agreed maintenance and improvements, with a prioritized backlog rather than an undefined promise of unlimited development.</p></div></div>`) + faqs([
      ['What does the $2,500 monthly starting price cover?', 'Custom design, development and ongoing maintenance within an agreed scope. We define priorities, delivery capacity, support and software costs before starting.'],
      ['Can AI work with my existing software?', 'Often, but it depends on the tools and the access they provide. We check integration options and permissions before proposing the system.'],
      ['Will it act without someone checking the work?', 'That depends on the task. We define which actions can run automatically, which require approval and what happens when information is missing or the system fails.'],
      ['Can I implement the audit recommendations myself?', 'Yes. The report includes actionable recommendations and off-the-shelf options. You can use it independently of the custom implementation service.'],
    ]),
  },
  {
    path: '/services/ai-audit/', title: '$900 AI Audit & Readiness Assessment | Okanagan',
    description: 'Five hours on site across two to three weeks. Get a detailed AI readiness report with automation opportunities, off-the-shelf tools and an actionable roadmap.',
    heading: 'Know where AI<br><em>could help you most.</em>',
    intro: 'A $900 assessment of how your business works today, where AI and automation could help, and what to do next. Five hours on site, spread across a two-to-three-week engagement.',
    secondary: ['See a sample report', '/services/ai-audit/sample-report/'],
    body: section('A detailed report you can act on.', `<div class="service-split"><p>We look at the work your team repeats, the software you use and the information those processes depend on. The aim is to find useful improvements and give you enough detail to make a decision.</p><p>You leave with a written assessment and prioritized recommendations. Implement suitable off-the-shelf tools yourself, work through the plan with your team, or have me build the custom systems.</p></div>`) + section('What the report covers.', rows([
      ['Your current setup', 'The agreed workflows, tools, handoffs and sources of information, including where work slows down.', '#engagement', 'How we assess it'],
      ['Automation opportunities', 'The tasks worth investigating, what would change and what needs to be in place first.', '/services/ai-audit/sample-report/', 'See an example'],
      ['Off-the-shelf options', 'Existing tools and features that could meet the need, with the tradeoffs and setup considerations explained.', '/guides/ai-agent-or-automation/', 'Explore the approaches'],
      ['An actionable roadmap', 'A recommended order of work, requirements, likely effort and ways to judge whether each improvement is worthwhile.', '/services/ai-audit/sample-report/', 'Explore the sample'],
    ])) + section('Five hours together. Space to investigate.', `<div class="service-split"><div><h3>On site, over two to three weeks.</h3><p>We spread five hours of on-site time across the engagement so there is room to understand the business, inspect representative tasks and return with informed recommendations. We agree the schedule and workflows at the start.</p></div><div><h3>Analysis, report and next steps.</h3><p>The engagement includes the assessment and written recommendations. The report separates observations from estimates, identifies missing information and explains which opportunities are ready to act on.</p><p class="service-price">$900 <small>CAD / engagement</small></p></div></div>`, 'engagement') + section('Buy the plan. Choose how to use it.', `<p>The audit does not commit you to a monthly implementation service. Some recommendations may be things you can do yourself. Where a custom system makes sense, the report explains the proposed work so you can decide whether to proceed.</p>${links([['Custom systems from $2,500/month', '/services/ai-implementation/#engagements'], ['View a sample report', '/services/ai-audit/sample-report/']])}`) + faqs([
      ['What should I prepare?', 'A list of the tools you use, examples of recurring work and the questions you want answered. We agree what is needed beforehand so you can avoid sharing unnecessary sensitive information.'],
      ['Does the audit include building the automations?', 'No. It covers assessment and a detailed, actionable report. Custom implementation and ongoing maintenance are a separate engagement.'],
      ['Will the report guarantee savings?', 'No. It can estimate opportunities using information from your business, with assumptions clearly identified. Actual results need to be measured after an improvement is implemented and used.'],
      ['Can the assessment cover every part of the company?', 'We agree the areas and workflows up front to keep the engagement useful within the available time. A broader or more complex assessment can be scoped separately.'],
    ]),
  },
  {
    path: '/services/web-design-development/', title: 'Okanagan Web Design & Development | Michael McKerracher',
    description: 'Custom web design and development for Okanagan businesses. Strategy, content, responsive design and local search, with the Cool Runnings case study.',
    heading: 'A better website.<br><em>A stronger reason to choose you.</em>',
    intro: 'I design and build websites around your business, your customers and the action you want them to take. Clear content, considered design and useful paths from discovery to enquiry.',
    secondary: ['See the Cool Runnings case study', caseURL],
    body: evidence() + section('A website needs more than a good first impression.', `<div class="service-split"><div><h3>Make the business clear.</h3><p>Who is it for? What do you do well? What does someone need to know before they call? Those questions shape the pages, messaging and navigation before the design becomes detailed.</p></div><div><h3>Make the next step easy.</h3><p>From a phone screen to a desktop, customers should be able to understand your services, inspect the work and get in touch. The design has to support that journey at each size.</p></div></div>`) + section('What we can work on.', bullets([
      '<strong>New websites and redesigns.</strong> Structure, copy, visual direction and development, scoped around your goals.',
      '<strong>Service and landing pages.</strong> Explain an offer with the evidence and practical details a buyer needs.',
      '<strong>Local search foundations.</strong> Useful service information, crawlable pages, internal links, metadata and sitemap discovery.',
      '<strong>Tools and interactive content.</strong> Calculators, guides and demonstrations that help customers make a decision.',
      '<strong>Measurement and improvement.</strong> Define the important actions and use available evidence to guide the next changes.',
    ])) + section('From source material to a working site.', `<p>We start with your business information, real photography and existing materials. Then we work through structure, visual direction and a responsive page before extending the design across the site. You review the work at meaningful stages.</p>${links([['See the website production workflow', '/v2/workflows/image-to-website-production.html'], ['Explore more website work', '/#work']])}`) + section('Give people useful reasons to find you.', `<p>Cool Runnings connects service information with local guides and practical tools. The principle is worth carrying into other projects: make the site genuinely useful to the people you want to reach. The right content depends on their questions and your business, rather than a fixed page count.</p>${links([['Read about local service websites', '/guides/local-business-website/']])}`) + faqs([
      ['How much does a website cost?', 'Website projects are quoted after an initial conversation about scope, content, functionality and timing. The $900 AI audit is a separate service, not the price of a website.'],
      ['Can we keep parts of my existing website?', 'Yes. We can assess the content, design, search performance and functionality worth preserving before deciding what to change.'],
      ['Do you guarantee rankings?', 'No. I can build the content and technical foundations for discovery and measure performance, but search engines determine crawling, indexing and rankings.'],
    ]),
  },
  {
    path: '/services/branding-marketing/', title: 'Branding & Marketing Services in the Okanagan',
    description: 'Positioning, messaging, visual direction, websites and sales material for Okanagan businesses. Explore Michael McKerracher’s product marketing work.',
    heading: 'Make what you do<br><em>easier to understand.</em>',
    intro: 'Positioning, messaging and creative work that help the right people see why your business matters. Then bring that story into your website, campaigns and sales conversations.',
    secondary: ['Explore the work', '/#work'],
    body: `<section class="service-section page-frame service-feature">${image('/assets/screens/vertical-impression-why-elevators.png', 'Vertical Impression product story explaining elevator advertising')}<div class="service-feature-copy"><h2>Give an overlooked medium a clearer story.</h2><p>The Vertical Impression work explains where elevator advertising reaches people, how the medium works and why a buyer might consider it. Positioning becomes a story people can explore.</p>${links([['Explore the product story', 'https://www.verticalimpression.com/why-elevators'], ['See the work in context', '/#work']])}</div></section>` + section('From the central idea to the material you use.', rows([
      ['Positioning &amp; messaging', 'Define the audience, the problem you solve and the reasons someone should choose you. Turn that into language your team can use.', consult, 'Discuss your positioning'],
      ['Brand &amp; visual direction', 'Connect your identity, typography, imagery and tone to the business you want people to recognize.', consult, 'Discuss your brand'],
      ['Campaigns &amp; sales material', 'Bring the story into landing pages, presentations, proposals and creative that supports the next conversation.', '/proposal-generator.html', 'Explore the proposal tool'],
    ])) + section('Make the strategy useful in practice.', `<div class="service-split"><p>We start with what customers need to understand and what your business can genuinely support. The work might begin with a positioning session, a messaging review or a specific campaign that needs a clearer idea.</p><p>Then we decide what needs to be made. That may be a focused set of messages, a website, a presentation or a repeatable way to produce sales material. Scope follows the work you will actually use.</p></div>`) + section('A story can become a system.', `<p>Once the message is clear, repeatable work can be supported by reusable templates, structured brand instructions and AI-assisted workflows. That connection is useful when a small team needs consistency across many outputs.</p>${links([['Explore AI implementation', '/services/ai-implementation/'], ['Explore web design & development', '/services/web-design-development/']])}`) + faqs([
      ['Can you help without a full rebrand?', 'Yes. We can work on a specific message, campaign, presentation or page while retaining the parts of your brand that already work.'],
      ['How is this priced?', 'Branding and marketing engagements are quoted around the agreed deliverables and scope. Start with a free consultation to discuss the work.'],
      ['Can you build the website or materials too?', 'Yes. Design and implementation can be included in the scope, so the positioning carries through into the finished work.'],
    ]),
  },
  {
    path: '/services/ai-training/', title: 'Practical AI Training for Okanagan Businesses',
    description: 'Hands-on AI training around your team’s real tasks. Learn to provide context, check output and build repeatable ways of working with Michael McKerracher.',
    heading: 'Learn AI.<br><em>Through work you actually do.</em>',
    intro: 'Practical training for business owners and teams, shaped around your tasks, your experience and the tools you use. Learn a process you can repeat after the session.',
    secondary: ['Explore implementation', '/services/ai-implementation/'],
    body: section('Bring the work that keeps coming back.', `<p>A proposal to draft. A report to understand. Research to organize. A set of documents you need to find answers in. Real tasks give the training a purpose and make it easier to judge what is useful.</p>`) + section('What we can cover.', bullets([
      'Choosing a suitable task and giving the AI enough business context.',
      'Working with your documents and source material while being deliberate about what you share.',
      'Reviewing claims, checking sources and recognizing an answer that needs more work.',
      'Saving instructions and building a repeatable process from a successful result.',
      'Using a custom system, understanding its boundaries and knowing when to step in.',
    ])) + section('A format that fits the team.', `<div class="service-split"><div><h3>Individual or team sessions.</h3><p>We agree the tools, experience level, format and tasks in advance. Training is quoted by scope, with on-site arrangements agreed around your location.</p></div><div><h3>Training with implementation.</h3><p>When I build a system for your business, we can include training and documentation in the implementation scope so people understand how to operate it.</p></div></div>`) + aiProof(),
  },
  {
    path: '/services/ai-audit/sample-report/', title: 'Sample AI Audit Report | Michael McKerracher',
    description: 'An illustrative AI audit report showing current assessment, opportunities, off-the-shelf recommendations and a phased action plan.',
    heading: 'A plan you can<br><em>put to work.</em>',
    intro: 'An illustrative excerpt from an AI opportunity report. This fictional service business shows the level of practical thinking the assessment is designed to produce. It is not a client result or a completed assessment.',
    secondary: ['See the $900 audit', '/services/ai-audit/'],
    body: section('The example: enquiries to proposal drafts.', `<div class="service-report"><h3>Current process</h3><p>In this fictional example, enquiries arrive by email. An owner copies requirements into a document, checks past proposals and prepares a draft for review. Details are sometimes missing, so the draft waits while someone follows up.</p><table><tbody><tr><th scope="row">Recommended first move</th><td>Standardize the enquiry questions and proposal template. Start with a better input and a consistent document.</td></tr><tr><th scope="row">Off-the-shelf option</th><td>Use the existing form, shared storage and document-template features if they cover the need. Confirm availability in the company’s current plan.</td></tr><tr><th scope="row">Potential AI role</th><td>Summarize the enquiry and prepare a draft from approved service descriptions. Flag missing facts rather than inventing them.</td></tr><tr><th scope="row">Human approval</th><td>The owner checks scope, pricing, dates and commitments before sending anything.</td></tr><tr><th scope="row">Custom-build trigger</th><td>Consider a connected workflow if repeated copying between tools remains a substantial part of the process after the simpler changes.</td></tr></tbody></table></div>`) + section('A sequenced action plan.', bullets([
      '<strong>First:</strong> review representative enquiries and proposals. Document required fields, approved descriptions and the person responsible for review.',
      '<strong>Next:</strong> try the improved form and template on a small, representative set of work. Record the time and corrections needed.',
      '<strong>Then:</strong> test AI-assisted drafting on approved sample material. Compare accuracy and review effort with the existing process.',
      '<strong>Only if useful:</strong> connect the steps into a maintained system with clear failure handling and approval before sending.',
    ])) + section('What would need validating.', `<p>Actual task volume, staff time, tool access, permissions and recurring costs. This example does not assign invented savings or promise a return. A real report would distinguish observed facts, estimates and questions that still need answering.</p>${links([['Discuss an audit for your business', consult], ['Learn how to assess an opportunity', '/guides/what-to-automate/']])}`),
  },
  {
    path: '/guides/', title: 'Practical Guides to AI, Websites & Marketing',
    description: 'Plain-language guides to choosing automation opportunities, understanding AI agents and building useful local business websites.',
    heading: 'Understand the work.<br><em>Make a better decision.</em>',
    intro: 'Practical explanations of the choices behind an AI system or a useful website. Start with the problem you are trying to solve.',
    secondary: ['Explore services', '/services/'],
    body: section('Start here.', rows([
      ['What should you automate?', 'Assess repetition, inputs, review effort and the cost of getting it wrong before choosing a tool.', '/guides/what-to-automate/', 'Read the guide'],
      ['AI agent or automation?', 'Understand when a fixed workflow, an AI-assisted step or a custom agent is appropriate.', '/guides/ai-agent-or-automation/', 'Read the guide'],
      ['What does a local website need?', 'Service information, useful proof and a clear route from discovery to enquiry.', '/guides/local-business-website/', 'Read the guide'],
    ])),
  },
];

const guides = [
  {
    slug: 'what-to-automate', title: 'What Should a Small Business Automate First?',
    description: 'A practical way to assess automation opportunities using repetition, inputs, review effort and the consequences of failure.',
    heading: 'Find the task.<br><em>Then choose the tool.</em>',
    intro: 'The best first automation is usually a well-understood task with clear inputs and a result someone can check. Start by studying the work your team already repeats.',
    content: `<h2>Look for repeated work with a clear result.</h2><p>List the tasks that come back each week: assembling a report, preparing a proposal, moving information between tools or answering the same internal questions. Describe the starting information and the finished result. A task that sounds simple may contain several different decisions.</p><p>For example, “prepare a proposal” could mean gathering requirements, selecting a service, calculating a price, drafting the document and approving the commitment. Those steps do not all need the same kind of automation.</p><h2>Check the inputs before the output.</h2><p>Are the necessary details consistently available? Can the system access them through an appropriate account? Are the documents current? If the process depends on information held only in someone’s head, capture that knowledge before designing the automation.</p><p>A more complete enquiry form or a clearer document template may improve the process immediately. It also creates better conditions for an AI-assisted step later.</p><h2>Measure the work, including corrections.</h2><p>Record how often the task happens, how long it takes and what usually causes rework. Then test an improvement on representative examples. Count the time spent checking and fixing the result as part of the new process.</p><p>A workflow that creates drafts quickly but demands extensive correction may not be an improvement. Useful measures include total handling time, error rate, completion rate and whether the team actually uses it.</p><h2>Decide what happens when it is wrong.</h2><p>Preparing an internal draft and sending a customer a binding quote have different consequences. Define which outputs need approval, how missing information is handled and who receives a failed-run notification. A first project should have manageable failure consequences and a clear fallback.</p><h2>Make a short opportunity list.</h2>${bullets(['What task repeats, and how often?', 'What information does it need, and where does that live?', 'Can an existing feature solve it?', 'What does a good result look like?', 'Who checks it, and what happens if it fails?', 'How will you compare the new process with the old one?'])}<p>These questions form the basis of an actionable assessment. They also make a custom build easier to scope because the system has a defined job.</p>${links([['Explore the $900 audit', '/services/ai-audit/'], ['See an illustrative report', '/services/ai-audit/sample-report/']])}`,
  },
  {
    slug: 'ai-agent-or-automation', title: 'AI Agent or Workflow Automation: Which Do You Need?',
    description: 'Compare fixed workflows, AI-assisted steps and custom agents through practical business tasks, review needs and maintenance.',
    heading: 'Agent or automation?<br><em>It depends on the job.</em>',
    intro: 'A fixed workflow follows defined steps. An AI-assisted workflow uses a model for part of that process. An agent can choose actions within the boundaries you give it. More autonomy adds decisions to design and test.',
    content: `<h2>Use fixed steps when the process is predictable.</h2><p>If a completed form always needs to create a record and notify a team member, the rules may be straightforward. AI may add little value to that transfer. Define the fields, validation, destination and failure handling.</p><p>The important questions are whether the inputs are complete and whether the integration can be operated reliably. A simple process still needs someone responsible for changes and failures.</p><h2>Add AI where the information needs interpretation.</h2><p>An incoming enquiry may contain a long, unstructured description. AI could help summarize it or prepare a draft using approved information. The rest of the workflow can remain explicit: receive the enquiry, validate required details, prepare a draft and send it for review.</p><p>This makes the system easier to evaluate. You can check the summary against the original and examine whether the draft uses supported facts.</p><h2>Consider an agent when the next step varies.</h2><p>A research assistant might need to choose which source to inspect next, compare conflicting information or request a missing detail. That flexibility can be useful, but the permitted tools, stopping conditions and review boundaries need definition.</p><p>Before giving an agent access to a system, specify what it may read, what it may change and which actions require approval. Test ambiguous requests and incomplete data, not only the examples that work cleanly.</p><h2>Apply the distinction to proposal preparation.</h2><p>A form-to-document transfer may be a fixed automation. Summarizing the customer’s needs may be AI-assisted. Investigating which service configuration fits those needs could involve agent-like decisions. Pricing and final commitments can still remain with the business owner.</p><p>The existing proposal builder in this portfolio is a concrete example of a system producing tailored sales material. Explore the output and workflow to see the individual pieces rather than treating “AI” as one undifferentiated feature.</p>${links([['Explore the proposal builder', '/proposal-generator.html'], ['Read the prospecting workflow', '/v2/workflows/local-prospecting-enrichment.html']])}<h2>Include maintenance in the choice.</h2><p>Any approach can be affected by changed fields, permissions, source documents or business rules. The more decisions a system can make, the more important it becomes to define evaluation and oversight. Choose the simplest approach that can do the agreed job, then improve it using real evidence.</p>${links([['Discuss AI implementation', '/services/ai-implementation/']])}`,
  },
  {
    slug: 'local-business-website', title: 'What a Local Business Website Needs to Earn Enquiries',
    description: 'Use clear service pages, relevant evidence, helpful content and measurable contact paths to build a more useful local business website.',
    heading: 'Give a local customer<br><em>a reason to get in touch.</em>',
    intro: 'A local website should help someone understand the service, decide whether the business fits and take the next step. Design, content and search all support that journey.',
    content: `<h2>Answer the practical questions.</h2><p>Explain what the service includes, who it is for, where it is available and how an enquiry works. Where costs vary, explain the factors rather than publishing a misleading single price. Put important details in readable page content, not only in images.</p><h2>Show relevant work.</h2><p>A customer considering a landscaping service wants to inspect the work and understand what was involved. A business looking for an automation needs to see what the system takes in, what it produces and where a person stays involved. Choose evidence that helps the visitor judge the specific service.</p><p>Separate a client’s account of a result from measured analytics. State the period and scope of a metric. A strong case study gives context instead of asking a number to explain itself.</p><h2>Build useful content around the decision.</h2><p>Guides, comparisons and calculators can help a visitor understand a project before contacting the business. For Cool Runnings, the site connects service information with local context, practical guides and tools. The case study explains how those pieces fit together.</p><p>Location pages need their own useful information. Changing only a place name across many near-identical pages does little for a reader deciding whether to hire the business.</p>${links([['Read the Cool Runnings case study', caseURL], ['Inspect the performance report', `${caseURL}#results-title`]])}<h2>Make the enquiry path work on a phone.</h2><p>Review the real mobile experience. Can someone read the text, inspect a project and find the contact option without fighting the layout? Does the form explain what happens next? A beautiful desktop composition still needs a considered phone version.</p><h2>Distinguish discovery from results.</h2><p>Crawling, indexing, ranking, visits and enquiries are different stages. A submitted sitemap does not establish that a page is indexed, and a visit does not establish a sale. Choose meaningful actions to track and use that evidence to improve the site.</p><p>Google’s documentation explains how sitemaps support discovery and why useful, original content matters. Those are foundations for the work, not a promise of rankings.</p>${links([['Google’s sitemap guidance', 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview'], ['Google’s helpful-content guidance', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content']])}${links([['Explore web design & development', '/services/web-design-development/']])}`,
  },
];

for (const g of guides) pages.push({ ...g, path: `/guides/${g.slug}/`, secondary: ['All guides', '/guides/'], body: `<section class="service-section page-frame"><article class="service-article"><p class="service-note">By Michael McKerracher · September 25, 2026</p>${g.content}</article></section>` });

function render(p) {
  const parent = p.path.startsWith('/guides/') ? '/guides/' : '/services/';
  const parentName = parent === '/guides/' ? 'Guides' : 'Services';
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: p.title, description: p.description, url: domain + p.path, author: { '@type': 'Person', name: 'Michael McKerracher', url: domain + '/#about' } };
  return `<!doctype html>
<html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${p.title.includes("Michael McKerracher") ? p.title : p.title + " | Michael McKerracher"}</title><meta name="description" content="${p.description}"><link rel="canonical" href="${domain}${p.path}">
<meta property="og:type" content="website"><meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.description}"><meta property="og:url" content="${domain}${p.path}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/v2/styles.css"><link rel="stylesheet" href="/v2/services/services.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="service-page"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header service-header"><a class="monogram" href="/" aria-label="Michael McKerracher, portfolio home">MM</a><nav class="service-nav" aria-label="Primary navigation"><a href="/#work">Work</a><a href="/services/"${parent === '/services/' ? ' aria-current="true"' : ''}>Services</a><a href="/guides/"${parent === '/guides/' ? ' aria-current="true"' : ''}>Guides</a></nav><a class="service-contact" href="${consult}">Let’s talk <span aria-hidden="true">↗</span></a></header>
<main id="main"><section class="service-hero page-frame"><nav class="service-breadcrumb" aria-label="Breadcrumb"><a href="/">Portfolio</a><span aria-hidden="true">/</span>${p.path === parent ? `<span aria-current="page">${parentName}</span>` : `<a href="${parent}">${parentName}</a>`}</nav><h1>${p.heading}</h1><p class="service-intro">${p.intro}</p><div class="hero-actions"><a class="button button-primary" href="${consult}">Book a free consultation</a><a class="button button-quiet" href="${p.secondary[1]}">${p.secondary[0]}</a></div><p class="service-local">Michael McKerracher · Based in Coldstream, serving the Okanagan.</p></section>${p.body}
<section class="service-end"><div class="page-frame"><h2>Let’s build something useful.</h2><p>Tell me about the business, the project or the task that keeps getting in the way. We’ll start with a free conversation.</p><a class="button" href="${consult}">Email me to arrange a consultation</a>${links([['Explore the portfolio', '/#work'], ['See all services', '/services/']])}</div></section></main>
<footer class="service-footer page-frame"><span>© 2026 Michael McKerracher · Coldstream, BC</span><nav aria-label="Footer"><a href="/services/ai-implementation/">AI implementation</a><a href="/services/web-design-development/">Web design</a><a href="/services/branding-marketing/">Branding &amp; marketing</a><a href="${email}">Email Michael</a></nav></footer></body></html>`;
}

for (const p of pages) {
  const dir = new URL(`v2${p.path}`, root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), render(p));
}
await writeFile(new URL('v2/services/routes.json', root), JSON.stringify(pages.map(p => p.path), null, 2) + '\n');
console.log(`Built ${pages.length} service and guide pages in v2/.`);
