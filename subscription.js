(()=>{
  const cfg=(window.FOLDFLIGHTLAB||{}).subscription||{};
  const forms=[...document.querySelectorAll('[data-subscribe-form]')];
  if(!forms.length) return;

  const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  forms.forEach(form=>{
    const status=form.querySelector('[data-subscribe-status]');
    const button=form.querySelector('button[type="submit"]');
    const setStatus=(message,state='')=>{
      if(!status) return;
      status.textContent=message;
      status.dataset.state=state;
    };

    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const data=new FormData(form);
      const email=String(data.get('email')||'').trim();
      const consent=data.get('consent')==='on';
      const honeypot=String(data.get('company')||'').trim();
      if(honeypot) return;
      if(!validEmail(email)){
        setStatus('Enter a valid email address.','error');
        form.querySelector('[name="email"]')?.focus();
        return;
      }
      if(!consent){
        setStatus('Please confirm the email consent before joining.','error');
        form.querySelector('[name="consent"]')?.focus();
        return;
      }

      const source=form.dataset.source||location.pathname;
      const timestamp=new Date().toISOString();
      const payload={email,source,consent:true,consent_version:cfg.consentVersion||'2026-08-17',consent_timestamp:timestamp};
      button?.setAttribute('disabled','');
      setStatus('Preparing your signup…','pending');

      if(cfg.mode==='api' && cfg.endpoint){
        try{
          const response=await fetch(cfg.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
          if(!response.ok) throw new Error('Signup request failed');
          form.reset();
          setStatus('Check your inbox to confirm your subscription.','success');
        }catch(error){
          setStatus('Signup could not be completed. Please try again later.','error');
        }finally{
          button?.removeAttribute('disabled');
        }
        return;
      }

      const destination=cfg.email||'serpentcianide@gmail.com';
      const subject=encodeURIComponent(`[FFL-SUBSCRIBER] ${cfg.dispatchName||'Flight Fix Dispatch'} signup`);
      const body=encodeURIComponent([
        `email=${email}`,
        `source=${source}`,
        `consent=true`,
        `consent_version=${payload.consent_version}`,
        `consent_timestamp=${timestamp}`,
        '',
        'I consent to receive FoldFlight Lab emails about paper-flight diagnostics, experiments, resources and relevant affiliate recommendations. I understand I can unsubscribe at any time.'
      ].join('\n'));
      window.location.href=`mailto:${destination}?subject=${subject}&body=${body}`;
      setStatus('Your email app is opening. Send the prefilled message to complete the signup.','success');
      button?.removeAttribute('disabled');
    });
  });
})();
