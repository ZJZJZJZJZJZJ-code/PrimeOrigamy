(()=>{
  const c=window.FOLDFLIGHTLAB||{};
  document.querySelectorAll('[data-amazon]').forEach(a=>{
    if(!c.commercializationEnabled){
      a.href='#';
      a.removeAttribute('target');
      a.rel='nofollow';
      a.setAttribute('aria-disabled','true');
      a.addEventListener('click',e=>e.preventDefault());
      return;
    }
    const key=a.dataset.amazon;
    const q=(c.links||{})[key]||key;
    const p=new URLSearchParams({k:q});
    if(c.associateTag)p.set('tag',c.associateTag);
    a.href=(c.amazonDomain||'https://www.amazon.de')+'/s?'+p.toString();
    a.target='_blank';
    a.rel='sponsored nofollow noopener';
    const label=a.dataset.amazonLabel || a.textContent.trim() || 'Amazon.de';
    a.setAttribute('aria-label',`Werbung · Affiliate-Link: ${label}`);
    a.title='Werbung · Affiliate-Link zu Amazon.de';
  });
})();