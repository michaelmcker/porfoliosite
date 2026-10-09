const form=document.querySelector('#preview-form');
if(form){
 const status=document.querySelector('#preview-status'),button=form.querySelector('button[type=submit]');
 const uuid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
 let requestId=uuid(),sending=false,complete=false;
 const allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
 const params=new URLSearchParams(location.search),attribution={landing_path:location.pathname};
 for(const key of allowed)if(params.has(key))attribution[key]=params.get(key).slice(0,200);
 try {if(document.referrer)attribution.referrer_host=new URL(document.referrer).hostname;}catch{}
 if(window.portfolioAttribution){attribution.first_touch=window.portfolioAttribution.first;attribution.last_touch=window.portfolioAttribution.last;}
 form.elements.attribution.value=JSON.stringify(attribution);
 form.elements.request_id.value=requestId;
 form.elements.submitted_at.value=new Date().toISOString();
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(sending||complete||!form.reportValidity()||form.elements._honey.value)return;
  sending=true;button.disabled=true;status.dataset.state='sending';status.textContent='Sending your brief…';
  try{
   form.elements.submitted_at.value=new Date().toISOString();
   const fields=Object.fromEntries(new FormData(form));delete fields._next;
   const response=await fetch('https://formsubmit.co/ajax/michael.mckerracher@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(fields),signal:AbortSignal.timeout(25000)});
   const data=await response.json();
   if(!response.ok||!(data.success===true||data.success==='true')||/activat|confirm your email/i.test(data.message||''))throw Error('Not confirmed');
   complete=true;status.dataset.state='success';status.textContent='Your preview request is in. I’ll review your brief and reply by email. You can also book a free call below.';
   window.gtag?.('event','generate_lead',{method:'homepage_preview',offer:'free_homepage_design'});
   form.reset();button.textContent='Preview requested';
  }catch{status.dataset.state='error';status.textContent='Your request hasn’t been confirmed. Your details are still here — try again or email michael.mckerracher@gmail.com.';button.disabled=false;}
  finally{sending=false;}
 });
}
const calendarButton=document.querySelector('#load-calendar');
calendarButton?.addEventListener('click',()=>{
 const url=new URL(calendarButton.dataset.calUrl);url.searchParams.set('embed','true');url.searchParams.set('theme','light');url.searchParams.set('layout','month_view');
 const iframe=document.createElement('iframe');iframe.src=url.href;iframe.title='Book a free 30-minute call with Michael';iframe.referrerPolicy='strict-origin-when-cross-origin';
 document.querySelector('#calendar-container').append(iframe);calendarButton.hidden=true;
 window.gtag?.('event','booking_calendar_open',{method:'inline_calendar'});
});
document.querySelectorAll('[data-booking-link]').forEach(a=>a.addEventListener('click',()=>window.gtag?.('event','booking_link_click',{method:'cal_com'})));
