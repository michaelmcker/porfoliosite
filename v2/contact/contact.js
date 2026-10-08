const form=document.querySelector('#contact-form');
if(form&&!new URLSearchParams(location.search).has('native')){
 const status=document.querySelector('#contact-status'),button=form.querySelector('button[type=submit]');
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  if(form.elements._honey.value)return;
  button.disabled=true;status.dataset.state='sending';status.textContent='Sending your message…';
  try{
   const fields=Object.fromEntries(new FormData(form));delete fields._next;
   const response=await fetch('https://formsubmit.co/ajax/michael.mckerracher@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(fields),signal:AbortSignal.timeout(20000)});
   const result=await response.json();

   if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Submission not accepted');
   if(/activat|confirm your email/i.test(result.message||''))throw new Error('Mailbox activation pending');
   status.dataset.state='success';status.textContent='Thanks. Your message has been submitted. I’ll reply to the email you provided.';
   window.gtag?.('event','generate_lead',{method:'contact_form'});form.reset();
  }catch(error){status.dataset.state='error';status.textContent='Your message hasn’t been confirmed. Please try again, or email michael.mckerracher@gmail.com. Your message is still here.';}
  finally{button.disabled=false;}
 });
}
