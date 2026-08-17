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

    form.addEventListener('submit',event=>{
      event.preventDefault();
      const data=new FormData(form);
      const email=String(data.get('email')||'').trim();
      const consent=data.get('consent')==='on';
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

      const timestamp=new Date().toISOString();
      const consentVersion=cfg.consentVersion||'2026-08-17';
      button?.setAttribute('disabled','');
      setStatus('Preparing your signup…','pending');

      const destination=cfg.email||'serpentcianide@gmail.com';
      const subject=encodeURIComponent(`[FFL-SUBSCRIBER] ${cfg.dispatchName||'Flight Fix Dispatch'} signup`);
      const body=encodeURIComponent([
        `email=${email}`,
        `consent=true`,
        `consent_version=${consentVersion}`,
        `consent_timestamp=${timestamp}`,
        '',
        'I consent to receive FoldFlight Lab updates about paper-flight experiments, diagnostic tools, guides, and occasional directly related commercial or affiliate content. I understand I can unsubscribe at any time.'
      ].join('\n'));
      window.location.href=`mailto:${destination}?subject=${subject}&body=${body}`;
      setStatus('Your email app is opening. Send the prefilled message to complete the signup.','success');
      button?.removeAttribute('disabled');
    });
  });
})();
