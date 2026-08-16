(()=>{
  const c=window.FOLDFLIGHTLAB||{};
  const domain=c.amazonDomain||'https://www.amazon.de';
  document.querySelectorAll('[data-amazon]').forEach(a=>{
    if(!c.commercializationEnabled){
      a.href='#'; a.removeAttribute('target'); a.rel='nofollow'; a.setAttribute('aria-disabled','true');
      a.addEventListener('click',e=>e.preventDefault()); return;
    }
    const key=a.dataset.amazon;
    const item=(c.links||{})[key];
    if(!item){
      a.href='#'; a.setAttribute('aria-disabled','true'); a.addEventListener('click',e=>e.preventDefault()); return;
    }
    let url;
    if(item.type==='direct' && /^[A-Z0-9]{10}$/i.test(item.asin||'')){
      const p=new URLSearchParams(); if(c.associateTag)p.set('tag',c.associateTag);
      url=`${domain}/dp/${encodeURIComponent(item.asin)}${p.toString()?'?'+p.toString():''}`;
    }else{
      const p=new URLSearchParams({k:item.query||key}); if(c.associateTag)p.set('tag',c.associateTag);
      url=`${domain}/s?${p.toString()}`;
    }
    a.href=url; a.target='_blank'; a.rel='sponsored nofollow noopener';
    const label=a.dataset.amazonLabel||item.title||a.textContent.trim()||'Amazon.de';
    a.setAttribute('aria-label',`Werbung · Affiliate-Link: ${label}`);
    a.title='Werbung · Affiliate-Link zu Amazon.de';
  });
})();