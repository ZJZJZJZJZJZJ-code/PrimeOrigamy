(()=>{
  const ensureStylesheet=(href)=>{
    if(!document.querySelector(`link[href="${href}"]`)){
      const link=document.createElement('link');
      link.rel='stylesheet'; link.href=href; document.head.appendChild(link);
    }
  };
  ensureStylesheet('/community.css');
  ensureStylesheet('/social-commerce.css');
  ensureStylesheet('/business.css');

  const c=window.FOLDFLIGHTLAB||{};
  const domain=c.amazonDomain||'https://www.amazon.de';

  const affiliateHref=(key)=>{
    const item=(c.links||{})[key];
    if(!item || !c.commercializationEnabled) return null;
    if(item.type==='direct' && /^[A-Z0-9]{10}$/i.test(item.asin||'')){
      const p=new URLSearchParams(); if(c.associateTag)p.set('tag',c.associateTag);
      return `${domain}/dp/${encodeURIComponent(item.asin)}${p.toString()?'?'+p.toString():''}`;
    }
    const p=new URLSearchParams({k:item.query||key}); if(c.associateTag)p.set('tag',c.associateTag);
    return `${domain}/s?${p.toString()}`;
  };

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
    a.href=affiliateHref(key);
    a.target='_blank'; a.rel='sponsored nofollow noopener';
    const label=a.dataset.amazonLabel||item.title||a.textContent.trim()||'Amazon.de';
    a.setAttribute('aria-label',`Werbung · Affiliate-Link: ${label}`);
    a.title='Werbung · Affiliate-Link zu Amazon.de';
  });

  const instagram=(c.social||{}).instagram;
  const addInstagramLink=(parent,label='Instagram ↗',className='')=>{
    if(!parent || !instagram || parent.querySelector(`a[href="${instagram}"]`)) return;
    const a=document.createElement('a');
    a.href=instagram; a.target='_blank'; a.rel='me noopener noreferrer';
    a.textContent=label; if(className)a.className=className;
    a.setAttribute('aria-label','FoldFlight Lab on Instagram');
    parent.appendChild(a);
  };

  const desktopNav=document.querySelector('.desktop-nav');
  addInstagramLink(desktopNav,'Instagram ↗','social-nav-link');

  if(desktopNav && !desktopNav.querySelector('a[href="/paper-airplane-troubleshooting.html"]')){
    const fixLink=document.createElement('a');
    fixLink.href='/paper-airplane-troubleshooting.html';
    fixLink.textContent='Fix a flight';
    fixLink.className='fix-nav-link';
    desktopNav.prepend(fixLink);
  }

  const footerBottom=document.querySelector('.footer-bottom');
  if(footerBottom){
    const group=footerBottom.querySelector('span:last-child');
    if(group){
      if(!group.querySelector('a[href="/community-questions.html"]')){
        const link=document.createElement('a');
        link.href='/community-questions.html'; link.textContent='Community questions';
        group.prepend(document.createTextNode(' · ')); group.prepend(link);
      }
      if(!group.querySelector('a[href="/join.html"]')){
        group.append(document.createTextNode(' · '));
        const join=document.createElement('a');
        join.href='/join.html'; join.textContent='Flight Fix Dispatch';
        group.appendChild(join);
      }
      if(instagram && !group.querySelector(`a[href="${instagram}"]`)){
        group.append(document.createTextNode(' · '));
        const ig=document.createElement('a');
        ig.href=instagram; ig.target='_blank'; ig.rel='me noopener noreferrer';
        ig.textContent='Instagram'; ig.setAttribute('aria-label','FoldFlight Lab on Instagram');
        group.appendChild(ig);
      }
    }
  }

  if(instagram && !document.querySelector('script[data-foldflight-brand-schema]')){
    const schema=document.createElement('script');
    schema.type='application/ld+json';
    schema.dataset.foldflightBrandSchema='true';
    schema.text=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'Brand',
      name:'FoldFlight Lab',
      url:'https://foldflightlab.github.io/',
      sameAs:[instagram]
    });
    document.head.appendChild(schema);
  }

  const bookColor=(key)=>{
    const palettes=[
      ['#20304d','#ef8f72'],['#6d3151','#f1c36d'],['#244d49','#a8d7c9'],
      ['#3f3a67','#d8b6ee'],['#6b3d2e','#f2b18e'],['#223a5e','#8fc8dc']
    ];
    let n=0; for(const ch of key)n=(n+ch.charCodeAt(0))%palettes.length;
    return palettes[n];
  };

  document.querySelectorAll('.selection-card').forEach(card=>{
    const amazon=card.querySelector('a[data-amazon]');
    if(!amazon) return;
    const key=amazon.dataset.amazon||'';
    const item=(c.links||{})[key];
    if(!item || item.type!=='direct') return;
    if(card.querySelector('.book-cover-preview')) return;
    card.classList.add('book-product-card');
    const title=(card.querySelector('h3')?.textContent||item.title||'Book').trim();
    const [bg,accent]=bookColor(key);
    const preview=document.createElement('a');
    preview.className='book-cover-preview';
    preview.href=amazon.href||affiliateHref(key)||'#';
    preview.target='_blank'; preview.rel='sponsored nofollow noopener';
    preview.setAttribute('aria-label',`View ${title} on Amazon.de`);
    if(item.image){
      const img=document.createElement('img');
      img.src=item.image; img.alt=`Cover of ${title}`; img.loading='lazy'; img.decoding='async';
      preview.appendChild(img);
      const source=document.createElement('span');
      source.className='official-cover-badge'; source.textContent='Official product image';
      preview.appendChild(source);
    }else{
      const mock=document.createElement('span');
      mock.className='book-cover-fallback';
      mock.style.setProperty('--book-bg',bg);
      mock.style.setProperty('--book-accent',accent);
      const short=title.replace(/,\s*Second Edition/i,'').slice(0,54);
      mock.innerHTML=`<i>FoldFlight shelf</i><strong>${short}</strong><b>Book reference</b>`;
      preview.appendChild(mock);
    }
    card.prepend(preview);
  });

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

  if(isHome && instagram && !document.querySelector('.social-proof-section')){
    const anchor=document.querySelector('.method-section');
    if(anchor){
      const section=document.createElement('section');
      section.className='social-proof-section';
      section.innerHTML=`<div class="wrap social-proof-grid"><div><span class="section-label">Now on Instagram</span><h2>See the folding lab in motion.</h2><p>Short visual diagnostics, carousel explainers and controlled paper-flight lessons from the same FoldFlight Lab method used on the site.</p><div class="social-proof-actions"><a class="button button-dark" href="${instagram}" target="_blank" rel="me noopener noreferrer">Follow @foldflightlab on Instagram ↗</a><span>No embedded Meta tracker — the connection happens only when you click.</span></div></div><a class="instagram-preview" href="${instagram}" target="_blank" rel="me noopener noreferrer" aria-label="Open FoldFlight Lab on Instagram"><div class="instagram-top"><span class="ig-mark" aria-hidden="true">◎</span><strong>@foldflightlab</strong><small>FoldFlight Lab</small></div><div class="instagram-post-art" aria-hidden="true"><span class="ig-plane"></span><span class="ig-path"></span><b>FOLD · TEST · LEARN</b></div><div class="instagram-caption"><strong>Visual paper-flight diagnostics</strong><span>Educational posts → deeper guides on FoldFlight Lab</span></div></a></div>`;
      anchor.parentNode.insertBefore(section,anchor);
    }
  }

  if(isHome && !document.querySelector('.conversion-section')){
    const anchor=document.querySelector('.method-section');
    if(anchor){
      const section=document.createElement('section');
      section.className='conversion-section';
      section.setAttribute('aria-labelledby','conversion-heading');
      section.innerHTML=`<div class="wrap conversion-grid"><div class="conversion-copy"><span class="section-label">The free Flight Fix Dispatch</span><h2 id="conversion-heading">One useful diagnosis.<br>Then one better test.</h2><p>Get practical paper-flight troubleshooting, test protocols and carefully matched material or book recommendations. No daily noise, no copied marketplace claims and no hidden tracker.</p><div class="conversion-points"><span><b>01</b> Symptom-first fixes</span><span><b>02</b> Repeatable field tests</span><span><b>03</b> Criteria-first buying notes</span></div><a class="text-link" href="/paper-airplane-troubleshooting.html">Open the complete troubleshooting center →</a></div><form class="subscribe-card" data-subscribe-form data-source="homepage" novalidate><span class="subscribe-kicker">Build your flight log</span><h3>Join the Flight Fix Dispatch.</h3><p>Occasional lab notes for people who want fewer random tweaks and more repeatable flights.</p><label><span>Email address</span><input name="email" type="email" autocomplete="email" inputmode="email" required placeholder="redacted-email@example.invalid"></label><label class="consent-row"><input name="consent" type="checkbox" required><span>I agree to receive FoldFlight Lab emails about diagnostics, experiments and relevant affiliate recommendations. I can unsubscribe at any time.</span></label><button class="button button-primary" type="submit">Join the free dispatch →</button><p class="subscribe-fineprint">Consent is recorded with the signup. Your address is not sold. <a href="/privacy.html#newsletter">Privacy details</a>.</p><div class="subscribe-status" data-subscribe-status role="status" aria-live="polite"></div></form></div></section>`;
      anchor.parentNode.insertBefore(section,anchor);
    }
  }

  const loadSubscription=()=>{
    if(!document.querySelector('[data-subscribe-form]') || document.querySelector('script[data-subscription-script]')) return;
    const script=document.createElement('script');
    script.src='/subscription.js'; script.defer=true; script.dataset.subscriptionScript='true';
    document.body.appendChild(script);
  };
  loadSubscription();

  const isFlightHub=location.pathname==='/paper-airplanes.html' || location.pathname.endsWith('/paper-airplanes.html');
  if(isFlightHub){
    const loadFlightDiagnostic=()=>{
      if(document.querySelector('script[data-flight-diagnostic-script]')) return;
      const script=document.createElement('script');
      script.src='/diagnostic.js';
      script.defer=true;
      script.dataset.flightDiagnosticScript='true';
      document.body.appendChild(script);
    };
    const existingDiagnosticStyles=document.querySelector('link[href="/diagnostic.css"]');
    if(existingDiagnosticStyles){
      if(existingDiagnosticStyles.sheet) loadFlightDiagnostic();
      else existingDiagnosticStyles.addEventListener('load',loadFlightDiagnostic,{once:true});
    }else{
      const diagnosticStyles=document.createElement('link');
      diagnosticStyles.rel='stylesheet';
      diagnosticStyles.href='/diagnostic.css';
      diagnosticStyles.addEventListener('load',loadFlightDiagnostic,{once:true});
      document.head.appendChild(diagnosticStyles);
    }
  }
})();
