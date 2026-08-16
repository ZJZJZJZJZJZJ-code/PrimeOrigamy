(()=>{
  const c=window.FOLDFLIGHTLAB||{};
  document.querySelectorAll('[data-amazon]').forEach(a=>{
    if(!c.commercializationEnabled){
      a.href='#';
      a.removeAttribute('target');
      a.rel='nofollow';
      a.setAttribute('aria-disabled','true');
      a.textContent='Commercial link temporarily paused';
      a.addEventListener('click',e=>e.preventDefault());
      return;
    }
    const q=(c.links||{})[a.dataset.amazon]||a.dataset.amazon;
    const p=new URLSearchParams({k:q});
    if(c.associateTag)p.set('tag',c.associateTag);
    a.href=(c.amazonDomain||'https://www.amazon.de')+'/s?'+p.toString();
    a.target='_blank';
    a.rel='sponsored nofollow noopener';
  });
})();
