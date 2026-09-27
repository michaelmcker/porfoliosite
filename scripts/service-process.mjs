// The process follows the proof and answers a business owner's practical questions.
const process = (title, intro, steps) => `<section class="service-process page-frame"><div class="service-process-panel"><header><h2>${title}</h2><p>${intro}</p></header><ol>${steps.map(([title, copy]) => `<li><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol></div></section>`;

export function serviceProcess(pages) {
 const content = [
  ['I build the system.<br>You build the business.', 'We choose an improvement you can measure: quicker replies, proposals prepared faster or less time spent on recurring work.', [
   ['Find the thing worth fixing', 'Show me where the work piles up. We look at enquiries, follow-up, preparation and reporting, then choose a useful first project. You get a clear plan before committing to a build.'],
   ['Build it around your working day', 'I build and test the custom workflows, AI skills or connections you need. That may include ChatGPT, Claude Cowork or Gemini. The choice follows the job, and you keep control over what goes to a customer.'],
   ['Make it easy to use', 'Your team gets practical training and clear instructions. Ongoing implementation includes maintenance and agreed improvements, so you have someone to call when the business changes.']
  ]],
  ['A better website starts<br>with your objectives.', 'A beautiful site should also make it easier to win business. We agree what that means for you before drawing the first page.', [
   ['Understand the customer', 'What are they looking for? Why should they choose you? We turn those answers into a brief covering the pages, content and customer actions that matter.'],
   ['Make the quality visible', 'I bring copy, imagery and design together into a direction you can review. The website should feel like your business, with the same care on a phone as on a large screen.'],
   ['Build it and put it to work', 'I develop the site, connect the agreed booking or enquiry tools and check the customer journey. Search foundations, measurement and handover are part of the plan. The scope, timing and project price are agreed before work begins.']
  ]],
  ['Good work starts<br>with a clear brief.', 'A new offer, an identity that no longer fits or marketing that leaves people unsure. We find the problem and make the work to solve it.', [
   ['Find the reason to choose you', 'We look at your customers, your offer and what makes the business valuable. Together, we agree the message and the response you want from your audience.'],
   ['Give the idea a distinctive form', 'I develop the visual direction and language, then carry it into the agreed branding, website, ads or video. You see the direction before the full production.'],
   ['Deliver work you can use', 'You receive the finished materials for the places they need to appear. Projects are custom quoted, with deliverables, timing and cost agreed up front. You can start with one campaign or a focused piece of work.']
  ]]
 ];
 pages.forEach((page, index) => {
  page.body = page.body.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, section => section.includes('class="offer-columns"') ? process(...content[index]) : section);
 });
}
