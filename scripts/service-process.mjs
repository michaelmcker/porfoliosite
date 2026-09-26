// A service engagement explained in plain sight, without tabs or reveal controls.
const process = (title, intro, steps) => `<section class="service-process page-frame"><div class="service-process-panel"><header><h2>${title}</h2><p>${intro}</p></header><ol>${steps.map(([title, copy, output]) => `<li><h3>${title}</h3><p>${copy}</p><p class="process-output">${output}</p></li>`).join('')}</ol></div></section>`;

export function serviceProcess(pages) {
 const content = [
  ['Start with the work.<br>Make it work better.', 'AI implementation starts with a business problem: slow follow-up, repetitive preparation or a team spending too much time moving information around.', [
   ['Understand the bottleneck', 'We look at the way your team works, the tools you already use and where time or enquiries get lost. We choose a useful first project and agree what improvement would look like.', 'A clear priority and an actionable plan.'],
   ['Build the right solution', 'That might mean setting up ChatGPT, Claude Cowork or Gemini, creating a custom AI skill, or connecting your tools into a workflow. We test it against real tasks, with review where it matters.', 'A working system built around your business.'],
   ['Help your team use it', 'Practical training, clear instructions and a supported handover make the system part of the working day. Ongoing engagements include maintenance and improvements as your needs change.', 'Tools your team can use, with support to keep them useful.']
  ]],
  ['A better website starts<br>with your objectives.', 'More bookings, better enquiries or a clearer story. We agree what the website needs to achieve before deciding what it needs to look like.', [
   ['Understand your business', 'We talk about your customers, your offer and the action you want visitors to take. We review your current site and material, then agree the pages, priorities, scope and cost.', 'A shared brief, a page plan and a clear quote.'],
   ['Shape the story. Design the site.', 'Your positioning, copy and real work guide the visual direction. You review the key pages before the full build, so the typography, imagery and customer journey feel right together.', 'A considered design with a clear path to call, book or enquire.'],
   ['Build, launch and hand over', 'I build the responsive site, connect the agreed features and check the content, forms and mobile experience. Search foundations, measurement and editing or maintenance arrangements are part of the launch plan.', 'A finished website, ready to use and easy to move forward.']
  ]],
  ['Start with the problem.<br>Give people a reason to choose you.', 'An unclear offer, a launch that needs attention or marketing that no longer fits the business. We find what needs to change, then make the work to change it.', [
   ['Find what is getting in the way', 'We look at your audience, your offer and the material people see today. The first conversation is about the business problem and what you want customers to understand or do.', 'A focused brief with an agreed scope, timing and cost.'],
   ['Develop the idea', 'We shape the positioning, message and visual direction around that problem. You review a clear creative direction before we carry it into the finished materials.', 'One clear story for the audience you want to reach.'],
   ['Make it work in the real world', 'I produce the agreed branding, website, ads or video and prepare it for the places it will appear. We review the finished work together and agree how to judge the response.', 'A connected set of materials your business can put to use.']
  ]]
 ];
 pages.forEach((page, index) => {
  page.body = page.body.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, section => section.includes('class="offer-columns"') ? process(...content[index]) : section);
 });
}
