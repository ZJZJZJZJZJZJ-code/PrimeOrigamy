(()=>{
  if(!document.querySelector('link[href="/community.css"]')){
    const communityStyles=document.createElement('link');
    communityStyles.rel='stylesheet'; communityStyles.href='/community.css';
    document.head.appendChild(communityStyles);
  }

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

  const footerBottom=document.querySelector('.footer-bottom');
  if(footerBottom && !footerBottom.querySelector('a[href="/community-questions.html"]')){
    const group=footerBottom.querySelector('span:last-child');
    if(group){
      const link=document.createElement('a');
      link.href='/community-questions.html';
      link.textContent='Community questions';
      group.prepend(document.createTextNode(' · '));
      group.prepend(link);
    }
  }

  const isHome=location.pathname==='/' || location.pathname.endsWith('/index.html');
  if(isHome && !document.querySelector('.community-section')){
    const anchor=document.querySelector('.method-section');
    if(anchor){
      const section=document.createElement('section');
      section.className='community-section';
      section.setAttribute('aria-labelledby','community-heading');
      section.innerHTML=`<div class="wrap"><div class="section-heading split-heading"><div><span class="section-label">Popular questions</span><h2 id="community-heading">Start with the question you would actually type.</h2></div><p>Fast answer-first routes for common folding and flight problems, with deeper guides when the diagnosis needs more detail.</p></div><div class="community-card-grid"><a class="community-card" href="/articles/choose-origami-paper.html"><span>Origami paper</span><strong>What paper should a beginner use for origami?</strong><small>15 cm is a useful baseline—but stiffness, thickness and memory matter too.</small></a><a class="community-card" href="/articles/flight-variables.html"><span>Paper airplanes</span><strong>Why does my paper airplane dive immediately?</strong><small>Check symmetry, nose condition, wing angle and trim before changing the design.</small></a><a class="community-card" href="/articles/test-paper-planes.html"><span>Flight testing</span><strong>Is 80 gsm or 90 gsm better for paper airplanes?</strong><small>Neither automatically. Compare both with the same plane and repeated launches.</small></a><a class="community-card" href="/origami-books.html"><span>Learning</span><strong>What origami book should a beginner buy?</strong><small>Choose diagram clarity and progression before project count.</small></a></div><div class="community-more"><a class="button button-ghost" href="/community-questions.html">Browse all common questions →</a></div></div>`;
      anchor.parentNode.insertBefore(section,anchor);
    }
  }
})();