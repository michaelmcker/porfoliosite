import {serviceProcess} from './service-process.mjs';

// An illustrative service situation, not a client result or a working calendar.
const bookingExample = `<figure class="service-booking-scene" role="img" aria-label="Illustrative service example: a customer asks for a quote, receives a follow-up, and a Thursday 10 am visit is booked">
 <div class="service-booking-window" aria-hidden="true">
  <div class="service-booking-heading"><strong>Appointments</strong><span>This week</span></div>
  <div class="service-booking-days"><span></span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
  <div class="service-booking-week"><span class="booking-hour">9 am</span><span class="booking-hour">10 am</span><span class="booking-hour">11 am</span><span class="booking-hour">12 pm</span><div class="booking-slot booking-slot-monday">Site visit<small>9:00–10:00</small></div><div class="booking-slot booking-slot-wednesday">Consultation<small>11:00–12:00</small></div><div class="booking-slot booking-slot-new">Quote visit<small>10:00–11:00</small><b>Confirmed</b></div></div>
 </div>
 <div class="service-booking-message" aria-hidden="true"><p class="booking-message-title">A new enquiry</p><p>“Could you come by for a quote this week?”</p><div class="booking-message-result"><span>Follow-up handled</span><strong>Thursday, 10 am. Booked.</strong></div></div>
 </figure>`;

const schoolFilm = `<figure class="service-hero-film"><video controls playsinline preload="none" poster="/assets/selected-work/st-james-film.jpg" aria-label="St. James School patronage film"><source src="https://st-james-school-prototype.vercel.app/videos/st-james-donor-film-2026-09-21-16x9.mp4" type="video/mp4"></video></figure>`;

const introductions = [
 ['AI implementation &amp; business automation in the Okanagan.', 'An enquiry waiting for an answer. An appointment that needs confirming. Admin that follows you home. We start with the work that gets in your way, then build a practical way to get it done.'],
 ['Web design &amp; development in the Okanagan.', 'Give people a feel for the stay, confidence in the service or a reason to visit. Your website should make the quality of your business visible, then make calling, enquiring or booking feel like the obvious next step.'],
 ['Branding &amp; marketing for Okanagan businesses.', 'People need to understand what makes you worth choosing. I bring the message and visual direction together across branding, websites, ads and video, so every piece helps tell the same story.']
];
const serviceIntroduction = ([title, copy]) => `<section class="service-introduction page-frame"><h2>${title}</h2><p>${copy}</p></section>`;

export function saasServices(pages) {
 const [ai, web, marketing] = pages;
 ai.heading = 'More bookings.<br><em>Less busywork.</em>';
 ai.hero = bookingExample;
 ai.image = '/v2/assets/workflows/agency-dashboard-desktop.png';
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
  page.cta = ['Book a free consultation', page.cta[1], page === ai ? 'How it works' : page === web ? 'Explore AI Catalyst' : 'See the work', page === ai ? '#how-it-works' : page === web ? 'https://ai-catalyst-wheat.vercel.app/' : '#selected-work'];
 }
 serviceProcess(pages);
}
