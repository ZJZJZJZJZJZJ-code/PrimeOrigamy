(()=>{
  const host=document.querySelector('#diagnose .wrap');
  if(!host || host.querySelector('[data-flight-lab]')) return;

  const states={
    turn:{
      label:'Persistent turn',
      headline:'It keeps turning left or right.',
      summary:'Start with geometry before adding weight or changing the whole design. A repeated turn often points to asymmetry, body twist, unequal trailing-edge trim, or a launch bias.',
      checks:['Compare left and right wing angles from the front.','Sight down the body for twist or a skewed center fold.','Compare trailing edges before making any trim change.'],
      variables:['Wing symmetry','Body twist','Trailing-edge trim','Launch direction'],
      guide:'/articles/flight-variables.html',
      guideLabel:'Open the full flight-variable diagnosis →',
      shopKey:'bookChampion',
      shopLabel:'See the tuning reference on Amazon.de · Affiliate-Link',
      shopCopy:'For readers who want deeper adjustment and flight-theory context after the free checks.'
    },
    dive:{
      label:'Immediate dive',
      headline:'It dives soon after release.',
      summary:'Inspect damage and pitch-related geometry before adding mass. Keep the launch repeatable so a change in throwing angle is not mistaken for a design fix.',
      checks:['Inspect the nose for crushed or softened folds.','Compare wing angle and left/right symmetry.','Check for excessive downward trailing-edge trim.'],
      variables:['Nose condition','Wing angle','Downward trim','Launch angle'],
      guide:'/articles/flight-variables.html',
      guideLabel:'See the diagnostic order for dives →',
      shopKey:'a4_80',
      shopLabel:'Find fresh A4 80 gsm test paper on Amazon.de · Affiliate-Link',
      shopCopy:'A fresh, consistent baseline helps separate damaged-paper effects from geometry changes.'
    },
    stall:{
      label:'Climb then stall',
      headline:'It climbs, slows, then drops.',
      summary:'Treat the repeated climb-and-drop pattern as a pitch problem to investigate, not proof of one single cause. Test trim, mass distribution, and launch consistently.',
      checks:['Check for too much upward trailing-edge trim.','Keep mass distribution unchanged while testing trim.','Repeat the same launch angle and force before judging the result.'],
      variables:['Upward trim','Mass distribution','Launch angle','Launch force'],
      guide:'/articles/flight-variables.html',
      guideLabel:'Open the stall diagnostic path →',
      shopKey:'bookChampion',
      shopLabel:'See the tuning reference on Amazon.de · Affiliate-Link',
      shopCopy:'Optional deeper reading on adjustment and flight theory—after the free trim checks.'
    },
    inconsistent:{
      label:'Inconsistent flights',
      headline:'Every throw behaves differently.',
      summary:'Reduce launch noise before blaming the design. A useful comparison needs the same release point, similar angle and force, and repeated trials.',
      checks:['Mark a consistent release point and launch direction.','Use the same thrower and similar force across trials.','Record several throws before changing the plane.'],
      variables:['Release point','Launch angle','Launch force','Trial count'],
      guide:'/articles/test-paper-planes.html',
      guideLabel:'Run the five-trial method →',
      shopKey:'a4_80',
      shopLabel:'Find a consistent A4 80 gsm baseline on Amazon.de · Affiliate-Link',
      shopCopy:'Use one pack and one configuration when material consistency is part of the problem.'
    }
  };

  const section=document.createElement('section');
  section.className='flight-lab';
  section.dataset.flightLab='';
  section.dataset.state='turn';
  section.setAttribute('aria-labelledby','flight-lab-title');
  section.innerHTML=`
    <div class="lab-intro">
      <div><span class="section-label">Interactive diagnostic · v1</span><h2 id="flight-lab-title">Show us the symptom.</h2></div>
      <p>Choose the behavior you can repeat. The lab narrows the first checks, helps you change one variable, then lets you summarize five of your own throws.</p>
    </div>
    <div class="lab-shell">
      <div class="lab-visual-panel">
        <div class="lab-panel-top"><span><i></i> Live diagnostic</span><b>Theory + test path</b></div>
        <div class="flight-viz" aria-hidden="true">
          <svg viewBox="0 0 720 430" role="presentation">
            <defs>
              <linearGradient id="labSky" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#dcecf2"/><stop offset=".56" stop-color="#f7eee5"/><stop offset="1" stop-color="#f0dfd8"/></linearGradient>
              <filter id="planeShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#172033" flood-opacity=".18"/></filter>
            </defs>
            <rect width="720" height="430" rx="30" fill="url(#labSky)"/>
            <g class="lab-grid" opacity=".4"><path d="M0 86H720M0 172H720M0 258H720M0 344H720M120 0V430M240 0V430M360 0V430M480 0V430M600 0V430"/></g>
            <path class="flight-trace" d="M70 280 C180 210 300 180 430 190 S610 235 670 142"/>
            <g class="plane-wrap" filter="url(#planeShadow)">
              <path class="plane-main" d="M183 205 L528 103 L396 260 L330 216 L245 277 Z"/>
              <path class="plane-side" d="M330 216 L528 103 L384 206 L396 260 Z"/>
              <path class="plane-fold" d="M330 216 L396 260 L364 222 Z"/>
            </g>
            <g class="viz-label viz-label-a"><rect width="116" height="34" rx="17"/><text x="58" y="22" text-anchor="middle">GEOMETRY</text></g>
            <g class="viz-label viz-label-b"><rect width="96" height="34" rx="17"/><text x="48" y="22" text-anchor="middle">TRIM</text></g>
            <g class="viz-label viz-label-c"><rect width="104" height="34" rx="17"/><text x="52" y="22" text-anchor="middle">LAUNCH</text></g>
          </svg>
          <div class="viz-status"><span>Observed symptom</span><strong data-viz-label>Persistent turn</strong></div>
        </div>
        <div class="symptom-picker" role="group" aria-label="Choose a paper-airplane flight symptom">
          <button type="button" data-symptom="turn" aria-pressed="true"><span>↶</span><b>Turns</b><small>left / right</small></button>
          <button type="button" data-symptom="dive" aria-pressed="false"><span>↓</span><b>Dives</b><small>after release</small></button>
          <button type="button" data-symptom="stall" aria-pressed="false"><span>↗</span><b>Stalls</b><small>climb + drop</small></button>
          <button type="button" data-symptom="inconsistent" aria-pressed="false"><span>≈</span><b>Varies</b><small>every throw</small></button>
        </div>
      </div>
      <div class="lab-diagnostic-panel">
        <div class="lab-step" aria-live="polite"><span>01</span><div><small>Symptom</small><h3 data-lab-headline>It keeps turning left or right.</h3><p data-lab-summary></p></div></div>
        <div class="lab-checks"><span class="lab-mini-label">Check these first</span><ol data-lab-checks></ol></div>
        <div class="lab-step lab-variable-step"><span>02</span><div><small>Change one variable</small><label for="lab-variable">Choose the single variable you will inspect or change first</label><select id="lab-variable" data-lab-variable></select><p class="variable-note" data-variable-note></p></div></div>
        <a class="button button-primary lab-guide" data-lab-guide href="/articles/flight-variables.html">Open the full diagnosis →</a>
        <div class="lab-commerce" data-lab-commerce><span>Optional next purchase</span><p data-lab-shop-copy></p><a data-lab-shop href="#">Amazon.de · Affiliate-Link</a><small>Werbung · Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.</small></div>
      </div>
    </div>
    <div class="trial-lab" aria-labelledby="trial-lab-title">
      <div class="trial-copy"><span class="section-label">Your five-throw summary</span><h3 id="trial-lab-title">Measure before you celebrate a fix.</h3><p>Enter up to five distances from the same configuration. We calculate only your arithmetic summary; these entries are not FoldFlight Lab test results and are not sent anywhere.</p><div class="trial-privacy"><span>Local-only inputs</span><span>No account</span><span>No upload</span></div></div>
      <div class="trial-console">
        <div class="trial-inputs" aria-label="Flight distances in metres">
          ${[1,2,3,4,5].map(n=>`<label><span>Throw ${n}</span><input data-trial type="number" min="0" step="0.01" inputmode="decimal" placeholder="m" aria-label="Throw ${n} distance in metres"></label>`).join('')}
        </div>
        <div class="trial-results" aria-live="polite">
          <div><small>Trials entered</small><strong data-trial-count>0 / 5</strong></div>
          <div><small>Average</small><strong data-trial-average>—</strong></div>
          <div><small>Range</small><strong data-trial-range>—</strong></div>
        </div>
        <div class="trial-actions"><button type="button" class="lab-clear" data-clear-trials>Clear measurements</button><a href="/articles/test-paper-planes.html">Open the full field-test method →</a></div>
      </div>
    </div>`;

  const anchor=host.querySelector('.section-heading');
  host.insertBefore(section,anchor||host.firstChild);

  const headline=section.querySelector('[data-lab-headline]');
  const summary=section.querySelector('[data-lab-summary]');
  const checks=section.querySelector('[data-lab-checks]');
  const variable=section.querySelector('[data-lab-variable]');
  const variableNote=section.querySelector('[data-variable-note]');
  const guide=section.querySelector('[data-lab-guide]');
  const vizLabel=section.querySelector('[data-viz-label]');
  const shopCopy=section.querySelector('[data-lab-shop-copy]');
  const shopLink=section.querySelector('[data-lab-shop]');
  const symptomButtons=[...section.querySelectorAll('[data-symptom]')];

  const affiliateHref=(key)=>{
    const c=window.FOLDFLIGHTLAB||{};
    const item=(c.links||{})[key];
    if(!item || !c.commercializationEnabled) return null;
    const domain=c.amazonDomain||'https://www.amazon.de';
    if(item.type==='direct' && /^[A-Z0-9]{10}$/i.test(item.asin||'')){
      const params=new URLSearchParams(); if(c.associateTag)params.set('tag',c.associateTag);
      return `${domain}/dp/${encodeURIComponent(item.asin)}${params.toString()?'?'+params.toString():''}`;
    }
    const params=new URLSearchParams({k:item.query||key}); if(c.associateTag)params.set('tag',c.associateTag);
    return `${domain}/s?${params.toString()}`;
  };

  const render=(key)=>{
    const data=states[key]||states.turn;
    section.dataset.state=key;
    symptomButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.symptom===key)));
    headline.textContent=data.headline;
    summary.textContent=data.summary;
    checks.replaceChildren(...data.checks.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    variable.replaceChildren(...data.variables.map(text=>{const option=document.createElement('option');option.value=text;option.textContent=text;return option;}));
    variableNote.textContent=`Test discipline: keep the rest as steady as practical while you inspect ${data.variables[0].toLowerCase()}.`;
    guide.href=data.guide;
    guide.textContent=data.guideLabel;
    vizLabel.textContent=data.label;
    shopCopy.textContent=data.shopCopy;
    const href=affiliateHref(data.shopKey);
    shopLink.textContent=data.shopLabel;
    shopLink.href=href||'#';
    shopLink.target=href?'_blank':'';
    shopLink.rel='sponsored nofollow noopener';
    shopLink.setAttribute('aria-label',`Werbung · ${data.shopLabel}`);
  };

  symptomButtons.forEach(btn=>btn.addEventListener('click',()=>render(btn.dataset.symptom)));
  variable.addEventListener('change',()=>{
    variableNote.textContent=`Test discipline: keep the rest as steady as practical while you inspect ${variable.value.toLowerCase()}.`;
  });

  const inputs=[...section.querySelectorAll('[data-trial]')];
  const countOut=section.querySelector('[data-trial-count]');
  const averageOut=section.querySelector('[data-trial-average]');
  const rangeOut=section.querySelector('[data-trial-range]');
  const updateTrials=()=>{
    const values=inputs.map(input=>Number.parseFloat(input.value)).filter(Number.isFinite).filter(value=>value>=0);
    countOut.textContent=`${values.length} / 5`;
    if(!values.length){averageOut.textContent='—';rangeOut.textContent='—';return;}
    const average=values.reduce((sum,value)=>sum+value,0)/values.length;
    const range=Math.max(...values)-Math.min(...values);
    averageOut.textContent=`${average.toFixed(2)} m`;
    rangeOut.textContent=values.length>1?`${range.toFixed(2)} m`:'—';
  };
  inputs.forEach(input=>input.addEventListener('input',updateTrials));
  section.querySelector('[data-clear-trials]').addEventListener('click',()=>{inputs.forEach(input=>input.value='');updateTrials();inputs[0].focus();});

  const viz=section.querySelector('.flight-viz');
  if(viz && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    viz.addEventListener('pointermove',event=>{
      const rect=viz.getBoundingClientRect();
      viz.style.setProperty('--pointer-x',`${((event.clientX-rect.left)/rect.width)*100}%`);
      viz.style.setProperty('--pointer-y',`${((event.clientY-rect.top)/rect.height)*100}%`);
    },{passive:true});
  }

  render('turn');
})();
