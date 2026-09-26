import {serviceProcess} from './service-process.mjs';

const bookingCalendar = `<figure class="booking-calendar" role="img" aria-label="Illustrative calendar with enquiries, follow-ups and confirmed bookings"><div class="booking-calendar-head"><h2>Bookings</h2><span>This week</span></div><div class="booking-calendar-week"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div><div class="booking-calendar-grid"><span class="calendar-time">9:00</span><span class="calendar-time">10:00</span><span class="calendar-time">11:00</span><span class="calendar-time">12:00</span><div class="booking-event booking-event-enquiry">New enquiry<br><small>Ready for follow-up</small></div><div class="booking-event booking-event-call">Discovery call<br><small>On the calendar</small></div><div class="booking-event booking-event-confirmed">Booking confirmed<br><small>Details sent</small></div></div></figure>`;

const schoolFilm = `<figure class="service-hero-film"><video controls playsinline preload="none" poster="/assets/selected-work/st-james-film.jpg" aria-label="St. James School patronage film"><source src="https://st-james-school-prototype.vercel.app/videos/st-james-donor-film-2026-09-21-16x9.mp4" type="video/mp4"></video></figure>`;

export function saasServices(pages) {
 const [ai, web, marketing] = pages;
 ai.heading = 'More bookings.<br><em>Less busywork.</em>';
 ai.hero = bookingCalendar;
 ai.image = '/v2/assets/workflows/content-production-approved-desktop.png';
 web.heading = 'Beautiful websites.<br><em>Built for business.</em>';
 web.heroProject = true;
 marketing.hero = schoolFilm;
 marketing.image = '/assets/selected-work/st-james-film.jpg';

 for (const page of pages) {
  page.saas = true;
  page.caption = '';
  page.body = page.body.replaceAll('<br>', ' ');
  page.cta = ['Book a free consultation', page.cta[1], page === web ? 'Explore AI Catalyst' : 'See the work', page === web ? 'https://ai-catalyst-wheat.vercel.app/' : '#selected-work'];
  const sections = page.body.match(/<section\b[\s\S]*?<\/section>/g) || [];
  const capabilities = sections.find(s => s.includes('class="offer-columns"'));
  if (capabilities) page.body = capabilities + sections.filter(s => s !== capabilities).join('');
 }
 serviceProcess(pages);
}
