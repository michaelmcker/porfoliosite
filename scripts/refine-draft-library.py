"""Apply source-led main-editor corrections after the separate Echo pass."""
from pathlib import Path
import json,re,html
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'content/resources/draft-library';DOC=ROOT/'docs/draft-library-2026-10-08'
FIXES={
'small-business-branding-deliverables':[
('The answer is that a branding project should begin with positioning, not a logo.','A branding project should begin by deciding who the business serves and why someone would choose it.'),
('The table below is not a universal standard. It is a practical checklist for asking better questions before you approve a branding proposal.','Use this checklist to agree the deliverables before approving a branding proposal.')],
'small-business-website-brief':[
('If a committee has to review the website, that should be known before the designer proposes a simple, direct voice that the committee will slowly complicate.','If a committee has to review the website, agree who consolidates its feedback and who makes the final decision before production begins.')],
'before-buying-ai-workflow':[
('I don\'t just want to swap out the industry name. I want it to be very specific to the thing. A workflow for a service business should reflect the way that business actually handles enquiries, bookings and follow-ups.','A service-business workflow should reflect the actual enquiry channels, booking rules and follow-up responsibilities in that business.'),
('The result is a faster first reply and fewer missed enquiries, without asking the AI to make final decisions on its own.','The goal is a faster first reply and fewer missed enquiries. Check that against the baseline while staff retain the final decision.'),
('A skill can be built with clear boundaries, so it knows when to act and when to ask.','A skill can document when to act and when to ask. Tool permissions and approval controls must enforce any consequential limits; instructions alone are not an access-control system.')],
'plumber-website-design':[
('That is the cheap work.','That is a practical place to start.'),
('A blocked drain is often urgent, comparatively low ticket, and decided in minutes. A water heater is usually planned, higher ticket, and full of questions about size, fuel type, warranty, and whether the old one can be repaired.','A blocked drain and a failed water heater can both need urgent attention. A planned water-heater replacement raises a different set of questions about the existing equipment, replacement options, warranty and arranging the visit.'),
('For most plumbing businesses, the focused pages win.','Separate pages are useful when each service has enough distinct scope, questions and examples to justify its own explanation.'),
('The mistake I see most often is putting the booking form before the visitor knows whether you even do the work.','A booking form placed before the service explanation asks the visitor to act before they know whether you handle the job.'),
('They are worse than no photos, because they tell the visitor you could not be bothered to show your own work.','Those images give a visitor little evidence of the work your business actually does.'),
('A small site that answers the right questions will usually outperform a larger site full of duplicated pages.','Start with a small, useful set of pages that you can keep accurate, and expand when another page answers a genuinely different customer question.')],
'website-subscription-vs-upfront-build':[
('An upfront build trades a larger initial cheque for a website that belongs to you, after which you choose what you pay for and when.','An upfront build separates the initial project fee from ongoing running costs. Ownership, editing access and support still depend on the contract and the platform.'),
('Second, the gap narrows with every year that passes, and it can disappear entirely if the subscription also layers on charges for extra pages, extra products, additional editor seats or premium add-ons.','In this particular example, the subscription stays cheaper and the gap grows: the upfront option also has the higher monthly running cost. A different subscription fee, buyout, support allowance or change budget can reverse the result. Compare equivalent scope before treating either total as a better deal.'),
('Owners ask me for a simple way to score two quotes against each other, so here is the version I use in my own head when reviewing proposals.','Here is a simple worksheet for comparing two quotes.'),
('The last two rows are the ones most proposals prefer you skip.','The final rows make the long-term commitment and exit terms explicit.'),
('In an upfront build, you get to decide.','An upfront project can give you that choice if the editing access and support arrangement are included in the agreement.'),
('usually gets more value from ownership than from a perpetual monthly fee','should compare long-term control, editing and support alongside the initial fee'),
('Everything else is negotiable; being able to leave without starting over is not.','Decide whether those exit terms are acceptable before choosing the payment model.')]
}
FIXES.update({
'retail-website-platforms':[
('an app ecosystem','a range of apps'),
('plans and app ecosystem','plans and available apps'),
('presents its checkout as converting better than many competing platforms. Even if you set that claim aside, the practical advantage is clear','describes an integrated commerce platform. The practical advantage to evaluate is'),
('Full control over checkout and choice of payment gateways','Configurable checkout and compatible payment gateways; confirm the required setup'),
('custom fields possible with apps','confirm the product fields and integrations your catalogue needs'),
('Basic content and blogging available','Pages and blogging alongside the store; test the required content model'),
('Very strong content management through WordPress','WordPress publishing alongside products and commerce'),
('because that often points toward WordPress and WooCommerce','and demonstrate the required publishing workflow on each proposed platform'),
('A full online checkout would create constant inventory and expectation problems.','A checkout that treats every piece as ready-to-ship could create inventory and expectation problems.'),
('A beautiful catalogue with strong photography, clear options and a simple enquiry form does the job better.','A catalogue with strong photography, clear options and an enquiry form may fit better until the business has a defined made-to-order purchasing process.')],
'template-vs-custom-website':[
('Use a template when you need to get online quickly with a simple offer. Choose custom design when your website must win competitive enquiries, support specific booking or content flows, and grow without a rebuild. The right choice depends on whether you are buying a basic presence or investing in a business asset.','Use a template when its structure suits your content, brand and customer journey with modest changes. Consider custom design when adapting that structure would compromise the experience or require extensive work. Either approach can support a successful business website; compare the actual fit, platform, implementation and lifetime cost.'),
('Yes, but plan for the content and design work to be redone. If you know growth is coming, it is worth weighing the cost of custom work against the time and money a later rebuild would take.','Yes. Some layouts may need rebuilding, but useful content and assets can often be retained. Record the export options, URL structure and ownership terms early so a later redesign does not discard good work unnecessarily.'),
('No. However, custom design gives you more control over site structure, speed and content, which makes it easier to do search engine optimization well.','No. Both template-based and custom-designed sites can support good search fundamentals. The platform, content structure and implementation determine what you can maintain and improve; the word custom is not an SEO advantage by itself.')],
'small-business-website-accessibility':[
('every interactive element needs to be reachable with the Tab key','interactive features need to work from the keyboard, using Tab to move between controls and the appropriate keys within controls such as menus'),
('If you use video, provide captions.','For video with speech or meaningful sound, provide accurate captions.'),
('Zoom to 200% and check that text is readable','Use a contrast checker on the actual text and background colours; also test readability at 200% zoom')],
'website-measurement-budget':[
('Most owners open a spreadsheet, look at last year\'s traffic, and add ten percent. That misses the point.','Starting with last year’s traffic and an arbitrary budget increase leaves the business problem unresolved.'),
('This tells you the problem is probably not awareness or page quality. The problem is the action step.','Those signals do not establish the cause. Check whether the visitors have buying intent, whether the offer matches their needs, whether tracking works and whether the contact path is usable.'),
('the problem is usually what happens after the first contact','review enquiry quality as well as what happens after the first contact'),
('the number of tyre kickers who waste your estimator\'s time','the number of requests that fall outside your estimator’s service scope')],
'professional-services-homepage-design':[
('That decision rarely happens because of animation, awards, or clever slogans. It happens when the page feels specific, calm, and clearly organized around the visitor\'s concern.','I would make the client’s question the organising idea, then use the typography, imagery and motion to give that explanation an appropriate character.'),
('If they have to scroll, guess, or decode vague language, you have already lost some of them.','Treat this as a quick review exercise: ask someone unfamiliar with the firm what they understand from the opening screen, then use their answer to improve it.'),
('Book a confidential consultation.','Request an introductory conversation.'),
('Here are three examples of opening structures that work because they are specific and calm.','Here are three sample opening structures to adapt to the firm’s actual services and review process.'),
('If you use testimonials or examples, they should be truthful and verifiable.','Have the practice review any proposed testimonial or example. The BC advisory treats subjective praise as a problem; a review being public elsewhere does not automatically make it suitable for the firm’s marketing.'),
('If the page offers five competing buttons, visitors often choose none of them.','Give the main action a clear visual priority and use secondary links only when they help a different, necessary task.'),
('Awards and testimonials can help, but the visitor needs to know whether the firm understands their situation before they care about decorations.','Verified professional information can support that fit. Any testimonial or award claim needs to be appropriate to the profession and reviewed before use.')],
'physiotherapy-website-design':[
('Most of the industry websites I see are built the other way around.','A clinic website can easily become organised around internal service labels instead of the patient’s first-appointment questions.')],
'winery-website-visitor-planning':[
('our <a href="/web-design/wineries/">winery website design</a> work starts with exactly this kind of architecture.','I would plan <a href="/web-design/wineries/">a winery website</a> around this kind of visitor-focused architecture.')],
'ai-skills-versus-prompts':[
('A prompt is a one-off request. An AI skill is a saved set of instructions, reference files and rules that your team can reuse every week.','A prompt is a request to an AI system and can be saved and reused. An AI skill packages a task’s instructions with reference material and, where supported, procedures or tools so a team has a maintained way to repeat the work.'),
('The trouble is that prompting has no memory of its own. Every new task needs a new request, and the good prompts you wrote last month are easy to forget or lose.','A prompt library can preserve useful instructions. The difficulty is keeping the right instructions, examples and current business information together so the team uses the intended version.'),
('One-off request','A request that can be saved or reused'),
('Easy to forget or lose','Needs an organised prompt library'),
('Output follows agreed rules and format','Provides shared rules and format; output still needs checking'),
('Hard to test systematically','Can be tested against repeatable examples'),
('something the business can rely on','a shared process the business can test and maintain'),
('a skill usually pays for itself quickly','compare the expected savings with setup, review and maintenance time'),
('a vague promise to transform the business','a vague promise to change everything at once')],
'custom-workflow-maintenance':[
('and when the workflow is central enough that you would notice quickly if it stopped','and when failure would create meaningful delays, errors or lost work'),
('It also needs to be central enough to your business that you would notice quickly if it stopped.','A failure should be detectable through alerts and checks, including when the process is quiet enough that people might otherwise miss it.'),
('Would you notice within hours if it stopped?','Would an unnoticed failure create meaningful cost or delay?'),
('The workflow is probably becoming infrastructure.','Assign monitoring, a fallback and an accountable owner.'),
('It may not be central enough to justify ongoing support.','Match the support level to the actual cost and risk of failure.')],
'automate-before-more-admin':[
('Quotes, prices, booking confirmations, service limitations, refunds, complaints, sensitive personal situations and anything with legal or financial consequences need human approval.','Define which commitments can follow approved business rules and which require a person. A connected booking system can confirm an available appointment within agreed rules; an unusual price, complaint, refund exception or sensitive situation may need staff approval.'),
('Usually yes, if the work is frequent, repetitive and easy to review. Automating first helps you see whether you need a person for judgment, exceptions and client care, or whether software can remove part of the workload.','Review the work before deciding. If much of it is repetitive and easy to check, a small automation trial can show what capacity it frees. If the need is judgement, customer care or handling exceptions, hiring may be the more useful step.')],
'landscaping-website-seasonal-demand':[
('If you are planning a rebuild, our <a href="/web-design/landscapers/">landscaping website design</a> work starts with exactly this calendar so the right pages exist before the season, not after.','If you are planning <a href="/web-design/landscapers/">a landscaping website</a>, use the service calendar to decide which pages need to be ready before each season.')],
'good-small-business-website-design':[
('First impressions are mostly visual. When a page looks dated, cluttered or generic, visitors have little reason to stay and read the copy, however well it is written.','A visitor encounters the layout, typography and imagery before reading every word. I want those first choices to make the business feel distinctive and the information easy to approach.'),
('A clean, deliberate design answers both faster than a paragraph of marketing language.','A deliberate layout can bring the answer and the next step into view together.'),
('Two things have to be true at once, and most websites only manage one.','I judge a business website on visual quality and how well it supports the customer’s task.'),
('A gorgeous design that hides the enquiry form produces admiration and no calls. A functional form sitting on an ugly page produces hesitation, because people reasonably assume the business behind it is equally rough. I want both, in that order, because the look earns the attention the function then converts.','A beautiful page still needs a visible enquiry path. A functional page can also use better typography, photography and spacing to express the quality of the business. Design those together, then check whether real visitors understand and use the page.'),
('Designing to that standard almost always produces a page that looks better to everyone, and the same checks cover things like front-loaded page titles and sensible image alt text that also help search engines understand the page.','Readable contrast gives the composition a clear foundation. The same introductory checks cover descriptive page titles, headings and appropriate text alternatives for images.'),
('Appliance repair, booked for this week. We come to you across the Okanagan and Shuswap.','Appliance repair across the Okanagan and Shuswap. Tell us what has stopped working and request a visit.'),
('what is on offer, where it is available and when they could have it','what is on offer, where it is available and how to request it'),
('Get a repair booked, fast','Make a repair request and understand what happens next')],
'website-photography-video-animation':[
('Still photography proves things instantly and loads fast, video earns its weight when process, scale or emotion matter, and animation should stay small, precise and optional.','Still photography can show the work at a glance; video can explain process, scale or emotion; animation can guide attention or give the brand a distinctive feel. Each needs a sensible file budget and an accessible presentation.'),
('It is fast to load, easy to scan, and it still works when a platform crops it into a square or a thumbnail.','A well-composed photograph is easy to scan. Supply appropriate crops and compressed sizes for the page, social previews and thumbnails instead of assuming one large file will suit every use.'),
('Used as decoration it mostly adds weight and motion sickness.','Decorative motion can also contribute atmosphere and craft. Keep it restrained, check its performance cost and provide a comfortable experience for visitors who prefer less motion.'),
('If the answer is nothing, the animation is filler. If the answer is orientation or meaning, it is probably earning its keep.','Sometimes the benefit is orientation; sometimes it is a memorable expression of the brand. Be clear about which benefit you want, and keep the page useful when the motion is reduced or stopped.'),
('Ask for images sized to the space they actually fill, compressed properly, and loaded lazily so offscreen media does not slow the first screen.','Ask for images sized to the space they fill and compressed appropriately. Lazy-load images below the first screen; let the important visible hero image load promptly.'),
('A room tour video needs captions and a transcript. A purely decorative clip needs none of that, and should not autoplay with sound in the first place.','For a narrated room tour, caption the speech and relevant sound, and provide a useful text alternative. A silent tour may need description of the important visual information instead. A purely decorative clip still needs appropriate motion controls and should never be the only way to understand the page.'),
('stills compressed and lazy loaded, video behind a poster frame','stills compressed, below-the-fold images lazy-loaded, video behind a poster frame'),
('Usually no. Autoplaying video is heavy, often blocked or muted by browsers, and easy for a visitor to resent. A strong still or a poster frame that invites a click is almost always the better homepage choice. Save autoplay for nothing, or at most for a muted, genuinely decorative loop you are willing to delete.','My default is a strong still or a poster frame that lets the visitor choose to play. A short muted loop can work when it adds useful atmosphere, loads efficiently, has a pause control and respects reduced-motion preferences. The headline and next step must remain clear without the video.')],
'kelowna-branding-partners':[
('Most small businesses in Kelowna, Vernon and across the Okanagan approach branding in the wrong order. They look for an agency name they recognise, then try to make the project fit.','If you are choosing a branding partner in Kelowna, Vernon or the wider Okanagan, define the work before building your shortlist.'),
('An owned look at three local options','Three local options for different kinds of project'),
('I am Michael McKerracher, and this is an owned comparison.','I am Michael McKerracher, the author of this comparison and one of the providers included below.')],
'private-school-website-design':[
('Admissions is where most school websites quietly fail.','An unclear admissions path can leave an interested family unsure what to do next.'),
('Student first name and current grade or entry year.','Intended entry grade and year; leave the child’s name and records for the school’s approved application process.'),
('Everything else can be gathered later, by email, on a call or through the school\'s own application system.','Additional information can be requested later through the school’s approved admissions system.'),
('All of those can be reasonable.','I would publish the tuition and compulsory charges where possible, with the applicable school year, payment arrangements and a clear route to ask about assistance.'),
('A short line such as "We would rather talk with you about fit and affordability than have you rule us out from a table of numbers" is much better than silence.','Make the next step concrete: identify the admissions contact, what information is available before a visit, and how the family can request a full fee breakdown.'),
('The worksheet above is a useful way to have that conversation internally before asking for quotes.','Use this worksheet to turn the discussion into decisions before asking for quotes.</p><table><caption>Admissions website decisions to settle before design</caption><thead><tr><th>Decision</th><th>What to prepare</th><th>Who checks it</th></tr></thead><tbody><tr><td>Family fit</td><td>Entry ages, programmes and the questions families ask before visiting</td><td>Admissions lead</td></tr><tr><td>Visit and application</td><td>Actual steps, dates, response owner and the approved application system</td><td>Admissions team</td></tr><tr><td>Fees</td><td>Current-year tuition, compulsory charges, payment options and assistance information</td><td>Finance and admissions</td></tr><tr><td>Proof and media</td><td>Current school photographs and permission records for their intended use</td><td>School communications lead</td></tr><tr><td>Current families</td><td>Public notices, private portal links and an owner for keeping each current</td><td>School administrator</td></tr></tbody></table><p>Assign a person to each decision so missing information does not become a design problem.')],
'appliance-repair-website-lessons':[
('Warranty work is a genuine specialty, not a slogan','Customers can find brand-specific information before enquiring'),
('common appliance types in that area','documented local project examples'),
('A clear "we serve Vernon and Coldstream" beats ten empty city pages every time.','A clear statement such as "we serve Vernon and Coldstream" is more useful to a customer than a set of location pages with no additional information.'),
('That small bit of honesty prevents the most common service business problem, which is a customer who thinks a form submission is a confirmed booking.','That wording helps distinguish a submitted request from a confirmed appointment, so the customer knows they still need a response.'),
('Put the brand on the intake form so requests arrive pre-sorted','Use the submitted brand to route the request to the right person'),
('Most shops will find they have one or two of the pieces, like a services list or a decent contact form, and are missing the rest.','Look for the specific gaps in your own site: a customer may find the service list but still be unable to confirm coverage or understand what happens after submitting the form.'),
('common local appliance issues','documented local service examples'),
('nothing about it rewards thin pages that swap a city name in and out','a customer still needs useful information about whether and how you serve their area'),
('our appliance repair website design service','my appliance repair website design service')],
'self-hosted-custom-website-ownership':[
('Self-hosting gives you full control and full responsibility.','Self-hosting gives you more control over deployment, with responsibilities that depend on the hosting and support arrangement.'),
('The software can be free, the control can be total, and the ongoing responsibility is also total.','Open-source software may have no licence fee, but hosting, maintenance and third-party services still have costs. Decide which responsibilities the host, your developer and your business will each take on.'),
('A self-hosted WordPress site can be genuinely yours: the files, the database, the server, all of it.','A self-hosted WordPress setup can put the files and database under an account you control. A rented server remains the host’s infrastructure; licences and access rights still matter.'),
('Even then, you are still in the server administration business unless someone does that work for you.','Managed WordPress hosting can handle much of the infrastructure work. Confirm who maintains themes, plugins, application settings and integrations.'),
('You own the code and the content. You do not administer a server.','Your contract can assign the custom code and content to you, while the host operates the underlying infrastructure. Application updates, integrations and deployment support still need an owner.'),
('It avoids the two common failure points of the other options: the self-hosted site nobody has time to maintain, and the platform site whose best content and features do not fully come with you when you leave.','It can separate control of the code from operation of the infrastructure. Check any host-specific features and external services too, because a custom site can have migration dependencies of its own.'),
('Search performance belongs to your domain\'s history and your content, and Google says its usual SEO fundamentals apply to AI search features too.','Nobody owns a search position. Search engines decide rankings, and changing hosts does not preserve or improve a position by itself.'),
('A server or VPS you rent and administer','A hosting account under your control; administration can be managed or delegated'),
('On your server, under your control','In your deployment or repository; rights depend on the contract and licences'),
('Your own database on your server','A database you can access and export under the agreed setup')],
'medical-practice-website-design':[
('A medical practice website should not diagnose, recommend treatment, promise results or imply guaranteed privacy through a generic web form.','Service explanations and patient education should be reviewed by the practice’s clinical team. A general enquiry form should not be presented as a diagnostic service or a guarantee of privacy.'),
('so launch-day compliance is not enough.','so launch checks need to be followed by regular review.')],
'medical-spa-website-design':[
('My <a href="/web-design/medical-spas/">medical spa website design</a> work starts from that path rather than from decoration alone.','I would plan <a href="/web-design/medical-spas/">a medical spa website</a> around that consultation path, then use the visual design to support it.'),
('If either half is weak, the site starts leaking good prospects.','If either half is weak, a visitor has less to work with when deciding whether to enquire.'),
('That kind of writing builds trust because it respects the reader\'s uncertainty.','Have the responsible clinician review that explanation before publication, including candidacy, preparation and aftercare wording.')],
'financial-advisor-website-design':[
('This article is educational website advice, not investment, tax or legal advice.','The useful first step is a clear map from client situation to the right kind of introductory conversation.'),
('For my own <a href="/web-design/financial-advisors/">financial-advisor website design</a> work, that means I do not want to begin with a generic professional-services template and simply swap in a new logo.','When planning <a href="/web-design/financial-advisors/">a financial-advisor website</a>, I would start with the client situation and the firm’s actual service model.'),
('My website advice is about structure, writing and design. It is not investment, tax or legal advice, and I would not want an owner to treat a web designer\'s opinion as permission to make a regulated claim.','Include that review in the project schedule before the pages are approved for launch.')],
'framer-webflow-custom-website':[
('Webflow fits teams needing a deeper content management system and scalable design systems. A custom setup suits owners who want full control over hosting, data, and exit costs.','Webflow is worth considering for a team that likes working with classes, reusable components and CMS templates. A custom setup can offer more control over hosting and implementation when its contract and dependencies support that control.'),
('For a small team that wants to make attractive pages without learning a deeper class-based design system, Framer often feels like the shortest path.','For a small team that likes this visual workflow, Framer is worth trying with a real service page and a CMS entry before committing.'),
('Webflow\'s <a href="https://webflow.com/cms">CMS</a> is also deeper for many content teams.','Webflow’s <a href="https://webflow.com/cms">CMS</a> supports a structured publishing workflow.'),
('If you plan to publish regularly, Webflow usually gives you more room to grow without rebuilding. Webflow also offers more integration surface through APIs and its app ecosystem.','Framer also supports collection-based publishing. Compare the content relationships, editor tasks and integrations your own site needs in a working demonstration; the presence of a CMS alone does not decide between them.'),
('The common thread is ownership.','The common thread is a tailored implementation. Ownership and the handover still need to be written into the agreement.'),
('You control the code, the hosting choice, and the migration path.','Ask for ownership or agreed rights to the code, access to the hosting account, and a documented migration path.'),
('A custom static website can also be very fast and very stable because there is less platform overhead.','A static build serves prebuilt pages and can keep the runtime simple. Images, scripts, caching and the quality of the implementation still determine the visitor’s experience.'),
('Lighter CMS for smaller collections','Collections and reusable content templates'),
('Deeper collections and template system','Collections and reusable content templates'),
('Stronger for reusable systems','Classes, components and shared styles'),
('Good for page-level design','Visual layouts, components and shared styles'),
('Highest control if the codebase is clean','Depends on contract, dependencies and documented handover'),
('If the business wants the simplest long-term ownership and has access to a developer, custom starts to look attractive.','If the business wants control over the implementation and has dependable development support, a custom build deserves consideration.'),
('Framer usually feels easier for a non-designer because editing happens directly on the page in a more visual way. Webflow is more powerful for design systems, but it asks more from the person maintaining it.','Ask the intended editor to update a service description, replace an image and publish a CMS entry in each proposed setup. Both tools can support an editing workflow; the permissions, templates and training you configure matter more than a blanket ease-of-use ranking.')],
'holiday-hours-website-checklist':[
('https://www.michaelmckerracher.com/','/')],
'before-buying-ai-workflow': FIXES['before-buying-ai-workflow']+[
('promises to transform a task you barely do','promises a dramatic improvement to a task you barely do')]
})
events=[]
for slug,fixes in FIXES.items():
 p=DATA/(slug+'.json')
 if not p.exists():continue
 a=json.loads(p.read_text())
 if 'editorialReview' not in a:continue
 applied=[]
 def change(v):
  if isinstance(v,str):
   for old,new in fixes:
    if old in v:v=v.replace(old,new);applied.append({'original':old,'replacement':new})
   return v
  if isinstance(v,list):return [change(x) for x in v]
  if isinstance(v,dict):return {k:change(x) for k,x in v.items()}
  return v
 for field in ['summary','sections','faqs','takeaways']:a[field]=change(a[field])
 if slug=='website-subscription-vs-upfront-build' and not a.get('mainEditorOwnershipFix'):
  for s in a['sections']:
   if s['id']=='cancellation-content-ownership-and-migration' or 'Framer\'s plan pricing' in s['body'] or 'Framer’s plan pricing' in s['body']:
    old=re.search(r'<p>Platform terms also change[\s\S]*?</p>',s['body'])
    if old:
     new='<p>Check the actual exit process before buying on portability. Framer’s <a href="https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/">HTML-export help</a> and <a href="https://www.framer.com/help/articles/porting-your-data-from-framer/">data-portability help</a> currently give conflicting descriptions of moving a site to other hosting. Ask for a working demonstration covering the pages, content and ongoing editing. <a href="https://help.webflow.com/hc/en-us/articles/33961386739347-How-do-I-export-my-Webflow-site-code">Webflow’s code-export documentation</a> distinguishes the exported files from hosted features such as CMS content, form processing and search. A downloadable copy of the design is not necessarily a working replacement for the original site.</p>'
     s['body']=s['body'].replace(old.group(),new);applied.append({'original':old.group(),'replacement':new})
  urls=[('Framer HTML-export help','https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/'),('Framer data-portability help','https://www.framer.com/help/articles/porting-your-data-from-framer/'),('Webflow code-export documentation','https://help.webflow.com/hc/en-us/articles/33961386739347-How-do-I-export-my-Webflow-site-code'),('WordPress features','https://wordpress.org/about/features/')]
  a['sources']=[{'name':n,'url':u} for n,u in urls];a['mainEditorOwnershipFix']=True
 if applied:
  text=html.unescape(re.sub('<[^>]+>',' ',' '.join([a['summary']]+[s['title']+' '+s['body'] for s in a['sections']]+[' '.join(x) for x in a['faqs']])))
  a['wordCount']=len(text.split());a.setdefault('mainEditorEdits',[]).extend(applied);p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n');events.append({'slug':slug,'edits':len(applied)})
  if slug=='landscaping-website-seasonal-demand':
   a['editorialReview']['state']='pass-for-draft-review'
   a['editorialReview']['mainEditorResolution']='Retained the relevant requested service link while rewriting the unsupported calendar-process claim.'
   p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
  if slug=='template-vs-custom-website':
   a['editorialReview']['state']='pass-for-draft-review'
   a['editorialReview']['mainEditorResolution']='The rejected duplicate patch targeted wording already absent from the current article. Main editor also corrected custom-versus-template ownership and SEO assumptions.'
   p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(events))
