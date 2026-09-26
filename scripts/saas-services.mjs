import {serviceProcess} from './service-process.mjs';

const calendarEvents = new Map([[5, ['New enquiry', 'enquiry', 'New']], [9, ['Call booked', 'booked', 'Call']], [13, ['Follow-up sent', 'followup', 'Follow']], [16, ['Site visit', 'booked', 'Visit']], [22, ['Call booked', 'booked', 'Call']], [28, ['Booking confirmed', 'confirmed', 'Booked']]]);
const calendarDays = Array.from({length: 35}, (_, index) => {
 const day = index - 2;
 if (day < 1 || day > 31) return '<span class="calendar-day calendar-day-empty" aria-hidden="true"></span>';
 const event = calendarEvents.get(day);
 return `<span class="calendar-day${event ? ` calendar-day-${event[1]}` : ''}"><span class="calendar-date">${day}</span>${event ? `<span class="calendar-note" data-short="${event[2]}">${event[0]}</span>` : ''}</span>`;
}).join('');
const bookingCalendar = `<figure class="booking-calendar" role="img" aria-label="Illustrative full-month booking calendar with enquiries, follow-ups, calls and confirmed bookings"><div class="booking-calendar-head"><h2>Bookings</h2><span>Month view</span></div><div class="booking-calendar-week"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="booking-calendar-grid">${calendarDays}</div><div class="booking-calendar-foot">More time for the work that moves your business forward.</div></figure>`;

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
