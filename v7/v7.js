
/* EZComo V7 — Follow one order. One clock, one fixture, one visible consequence at a time. */
;(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const player=$('#v7Player');
  if(!player)return;

  const fixture=Object.freeze({
    store:'Threads',product:'Studio Tee',variant:'Black / M',quantity:1,
    itemPrice:1490,sampleDelivery:60,total:1550,paymentMethod:'bKash',
    orderId:'1051',courier:'Pathao',bookingRef:'PX-84721'
  });

  const captionsEn=[
    'Start with a storefront you can make your own.',
    'Choose what you want to change.',
    'Change the words. See your brand take shape.',
    'Now see what your customer sees.',
    'Share your store link wherever you sell.',
    'Your customer chooses the product and size.',
    'An order arrives with the details attached.',
    'The same order reaches your workspace.',
    'Review the order. See what needs to happen next.',
    'Arrange delivery from the order.',
    'Later, the courier update appears on the same order.',
    'Your storefront. Your order. Your next step—connected.'
  ];
  const captionsBn=[
    'নিজের মতো করে সাজানোর জন্য একটি স্টোরফ্রন্ট দিয়ে শুরু করুন।',
    'যেটি বদলাতে চান, সেটি বেছে নিন।',
    'লেখা বদলান। সঙ্গে সঙ্গে নিজের ব্র্যান্ডের রূপ দেখুন।',
    'এবার দেখুন, আপনার ক্রেতা কী দেখবেন।',
    'যেখানে বিক্রি করেন, সেখানেই স্টোরের লিংক শেয়ার করুন।',
    'ক্রেতা পণ্য ও সাইজ বেছে নেন।',
    'প্রয়োজনীয় তথ্যসহ অর্ডার আসে।',
    'সেই অর্ডারই আপনার ওয়ার্কস্পেসে পৌঁছে যায়।',
    'অর্ডার দেখুন। পরের কাজটি বুঝে নিন।',
    'অর্ডার থেকেই ডেলিভারির ব্যবস্থা করুন।',
    'পরে কুরিয়ারের আপডেটও একই অর্ডারে দেখা যায়।',
    'আপনার স্টোরফ্রন্ট, অর্ডার আর পরের কাজ—সব একসঙ্গে।'
  ];
  const actorsEn=['YOU','YOU','YOU','YOU → CUSTOMER','YOUR CUSTOMER','YOUR CUSTOMER','CUSTOMER → EZCOMO','EZCOMO → YOU','YOU','YOU → EZCOMO','COURIER UPDATE','RESULT'];
  const actorsBn=['আপনি','আপনি','আপনি','আপনি → ক্রেতা','আপনার ক্রেতা','আপনার ক্রেতা','ক্রেতা → EZCOMO','EZCOMO → আপনি','আপনি','আপনি → EZCOMO','কুরিয়ার আপডেট','ফলাফল'];

  const copy={
    en:{
      eyebrow:'YOUR BUSINESS, CONNECTED',title:'Your storefront. Your next order. Your next move.',
      lead:'See how a customer’s choice becomes an order you can review and prepare for delivery—all in EZComo.',
      watch:'Watch the journey · about 50 sec',watchStep:'Step through the journey',try:'Try it yourself',
      disclosure:'Interactive demo · Sample business and transactions · No real payment or delivery',
      chapterBuild:'Build',chapterBuildNote:'Make it yours',chapterSell:'Sell',chapterSellNote:'Receive an order',
      chapterManage:'Manage',chapterManageNote:'Take the next action',backPage:'Back to page',
      editor:'Store editor',selectedField:'SELECTED FIELD',headline:'Headline',headlineLabel:'Storefront headline',
      previewReady:'Choose the headline to reveal its editing field.',fieldReady:'This field controls the selected storefront headline.',
      savedDemo:'Saved in demo',customerPreview:'Customer preview',shareLabel:'YOUR STORE LINK',
      orderSummary:'ORDER SUMMARY',item:'Item',sampleDelivery:'Sample delivery',total:'Total',checkout:'SAMPLE CHECKOUT',
      sampleCharge:'Illustrative delivery charge',samplePayment:'Simulated payment',placeSample:'Place sample order',
      reviewReady:'Ready for the sample order.',submitting:'Recording sample order…',paymentConfirmed:'Simulated bKash payment confirmed',
      orderCreated:'Order created',sampleResult:'SAMPLE RESULT',order:'Order',orders:'Orders',sampleWorkspace:'SAMPLE WORKSPACE',
      payment:'Payment',delivery:'Delivery',amount:'Amount',activeOrder:'ACTIVE ORDER',simulated:'simulated',
      nextAction:'NEXT ACTION',bookSample:'Book sample delivery',bookingNote:'Sample Pathao booking · no real delivery is created',
      booking:'Booking sample delivery…',awaiting:'Awaiting pickup',ordered:'ORDER',received:'Received',booked:'Booked',
      pickup:'PICKUP',pickedUp:'Picked up',laterCue:'Later that day · Sample courier update',
      storeReady:'Storefront ready',orderReceived:'Order received',deliveryProgress:'Delivery in progress',
      back:'Back',pause:'Pause',continue:'Continue',next:'Next step',tryStep:'Try this step',watchAgain:'Watch again',
      closingLabel:'FOLLOW ONE ORDER',closingTitle:'From storefront to next step. Connected.',
      closingText:'Create your storefront, receive orders with the details attached, and keep the next action clear.',
      createStore:'Create your free store',sampleLoaded:'Sample order loaded',paid:'Paid',notBooked:'Not booked',
      handsOn:'Hands-on mode',handsOnNote:'Full editor and workflow · sample data',returnStory:'Return to story'
    },
    bn:{
      eyebrow:'আপনার ব্যবসা, সংযুক্ত',title:'আপনার স্টোরফ্রন্ট। আপনার পরের অর্ডার। আপনার পরের কাজ।',
      lead:'ক্রেতার পছন্দ কীভাবে এমন একটি অর্ডারে পরিণত হয় যা আপনি দেখে ডেলিভারির জন্য প্রস্তুত করতে পারেন—EZComo-তে তা দেখুন।',
      watch:'যাত্রাটি দেখুন · প্রায় ৫০ সেকেন্ড',watchStep:'ধাপে ধাপে দেখুন',try:'নিজে ব্যবহার করুন',
      disclosure:'ইন্টারঅ্যাকটিভ ডেমো · নমুনা ব্যবসা ও লেনদেন · কোনো বাস্তব পেমেন্ট বা ডেলিভারি নয়',
      chapterBuild:'তৈরি',chapterBuildNote:'নিজের মতো করুন',chapterSell:'বিক্রি',chapterSellNote:'অর্ডার নিন',
      chapterManage:'ম্যানেজ',chapterManageNote:'পরের কাজ করুন',backPage:'পেজে ফিরুন',
      editor:'স্টোর এডিটর',selectedField:'নির্বাচিত ফিল্ড',headline:'শিরোনাম',headlineLabel:'স্টোরফ্রন্ট শিরোনাম',
      previewReady:'শিরোনামটি বেছে নিলে সম্পাদনার ফিল্ড দেখা যাবে।',fieldReady:'এই ফিল্ড থেকেই নির্বাচিত স্টোরফ্রন্ট শিরোনাম নিয়ন্ত্রণ হয়।',
      savedDemo:'ডেমোতে সেভ হয়েছে',customerPreview:'ক্রেতার প্রিভিউ',shareLabel:'আপনার স্টোর লিংক',
      orderSummary:'অর্ডার সারাংশ',item:'পণ্য',sampleDelivery:'নমুনা ডেলিভারি',total:'মোট',checkout:'নমুনা চেকআউট',
      sampleCharge:'শুধু ডেমোর জন্য ডেলিভারি চার্জ',samplePayment:'সিমুলেটেড পেমেন্ট',placeSample:'নমুনা অর্ডার দিন',
      reviewReady:'নমুনা অর্ডারের জন্য প্রস্তুত।',submitting:'নমুনা অর্ডার রেকর্ড হচ্ছে…',paymentConfirmed:'সিমুলেটেড bKash পেমেন্ট নিশ্চিত',
      orderCreated:'অর্ডার তৈরি হয়েছে',sampleResult:'নমুনা ফলাফল',order:'অর্ডার',orders:'অর্ডার',sampleWorkspace:'নমুনা ওয়ার্কস্পেস',
      payment:'পেমেন্ট',delivery:'ডেলিভারি',amount:'পরিমাণ',activeOrder:'সক্রিয় অর্ডার',simulated:'সিমুলেটেড',
      nextAction:'পরের কাজ',bookSample:'নমুনা ডেলিভারি বুক করুন',bookingNote:'নমুনা Pathao বুকিং · বাস্তব ডেলিভারি তৈরি হয় না',
      booking:'নমুনা ডেলিভারি বুক হচ্ছে…',awaiting:'পিকআপের অপেক্ষায়',ordered:'অর্ডার',received:'রিসিভড',booked:'বুকড',
      pickup:'পিকআপ',pickedUp:'পিকআপ হয়েছে',laterCue:'পরে একই দিনে · নমুনা কুরিয়ার আপডেট',
      storeReady:'স্টোরফ্রন্ট প্রস্তুত',orderReceived:'অর্ডার পাওয়া গেছে',deliveryProgress:'ডেলিভারি চলছে',
      back:'পেছনে',pause:'থামান',continue:'চালিয়ে যান',next:'পরের ধাপ',tryStep:'এই ধাপটি ব্যবহার করুন',watchAgain:'আবার দেখুন',
      closingLabel:'একটি অর্ডার অনুসরণ করুন',closingTitle:'স্টোরফ্রন্ট থেকে পরের কাজ—সংযুক্ত।',
      closingText:'স্টোরফ্রন্ট তৈরি করুন, প্রয়োজনীয় তথ্যসহ অর্ডার নিন এবং পরের কাজটি পরিষ্কার রাখুন।',
      createStore:'বিনামূল্যে স্টোর তৈরি করুন',sampleLoaded:'নমুনা অর্ডার লোড হয়েছে',paid:'পেইড',notBooked:'বুক হয়নি',
      handsOn:'নিজে ব্যবহার করুন',handsOnNote:'সম্পূর্ণ এডিটর ও ওয়ার্কফ্লো · নমুনা ডেটা',returnStory:'গল্পে ফিরুন'
    }
  };

  const beats=[
    {id:'establish',chapter:'build',duration:3000,cues:[]},
    {id:'select',chapter:'build',duration:4000,cues:[[180,'select-field'],[400,'reveal-field']]},
    {id:'edit',chapter:'build',duration:4000,cues:[[250,'edit-focus'],[1050,'apply-headline'],[1350,'saved']]},
    {id:'customer-preview',chapter:'build',duration:4000,cues:[[200,'clear-selection'],[500,'customer-preview']]},
    {id:'share-link',chapter:'sell',duration:4000,cues:[[220,'share-link']]},
    {id:'product-summary',chapter:'sell',duration:5000,cues:[[350,'product-focus'],[900,'variant'],[1200,'add-order']]},
    {id:'checkout',chapter:'sell',duration:5000,cues:[[300,'checkout'],[1200,'press-order'],[1380,'pending-order'],[2080,'confirm-order']]},
    {id:'handoff',chapter:'manage',duration:4000,cues:[[180,'handoff-start'],[1400,'handoff-settle']]},
    {id:'review',chapter:'manage',duration:5000,cues:[[200,'open-order'],[900,'next-action']]},
    {id:'book-delivery',chapter:'manage',duration:5000,cues:[[900,'press-book'],[1080,'booking'],[1880,'booked']]},
    {id:'later-update',chapter:'manage',duration:4000,cues:[[0,'later'],[900,'picked-up']]},
    {id:'resolve',chapter:'manage',duration:5000,cues:[[450,'settle-result']]}
  ];
  const totalDuration=beats.reduce((n,b)=>n+b.duration,0);
  const totalBefore=beats.map((_,i)=>beats.slice(0,i).reduce((n,b)=>n+b.duration,0));

  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let business=createBusiness();
  let story={
    beat:0,elapsed:0,beatStarted:0,playback:'idle',pauseReason:null,runId:0,
    fired:new Set(),visited:new Set(['build']),focused:false,paced:false,phase:'idle',
    directSample:false,merchantHeadline:null,baselineHeadline:'Make the everyday unmistakably yours.',demoEditApplied:false
  };
  let raf=0;
  let managedAnimations=[];
  let lastViewport={w:innerWidth,h:innerHeight};

  const els={
    stage:$('#v7Stage'),caption:$('#v7Caption'),actor:$('#v7Actor'),step:$('#v7StepLabel'),time:$('#v7TimeLabel'),
    progress:$('#v7Progress'),headline:$('#v7StoreHeadline'),customerHeadline:$('#v7CustomerHeadline'),
    input:$('#v7HeadlineInput'),saved:$('#v7SavedState'),previewState:$('#v7PreviewState'),
    indicator:$('#v7ActionIndicator'),receipt:$('#v7ReceiptCard'),orderRow:$('#v7OrderRow'),
    checkoutStatus:$('#v7CheckoutStatus'),later:$('#v7LaterCue'),result:$('#v7ResultStrip'),
    watch:$('#v7Watch'),pause:$('#v7Pause'),cont:$('#v7Continue'),next:$('#v7Next'),prev:$('#v7Prev'),
    tryStep:$('#v7TryStep'),watchAgain:$('#v7WatchAgain'),tryComplete:$('#v7TryComplete'),backPage:$('#v7BackPage')
  };

  function createBusiness(){
    return {orderCreated:false,payment:'none',delivery:'not-booked',bookingRef:null};
  }
  const isBn=()=>document.documentElement.lang==='bn'||document.body.classList.contains('bn');
  const t=k=>(copy[isBn()?'bn':'en'][k]||copy.en[k]||k);
  const currentCaptions=()=>isBn()?captionsBn:captionsEn;
  const currentActors=()=>isBn()?actorsBn:actorsEn;
  const money=n=>'৳'+n.toLocaleString('en-US');

  function readLegacyHeadline(){
    const value=$('#heroBlock .editable-title')?.textContent?.trim();
    return value||story.baselineHeadline;
  }
  function effectiveHeadline(){return story.merchantHeadline||story.baselineHeadline}
  function demoHeadline(){return isBn()?'প্রতিদিনের স্টাইলে আপনার নিজস্বতা।':'Everyday essentials. Unmistakably yours.'}

  function applyCopy(){
    $$('[data-v7-copy]').forEach(el=>{
      const k=el.dataset.v7Copy;
      if(copy[isBn()?'bn':'en'][k]||copy.en[k])el.textContent=t(k);
    });
    const watchText=els.watch?.querySelector('[data-v7-copy="watch"]');
    if(watchText)watchText.textContent=isPaced()?t('watchStep'):t('watch');
    renderBeat({preservePhase:true});
    renderControls();
  }

  function isPaced(){
    return reducedMotion.matches||matchMedia('(max-width:760px)').matches||player.dataset.layout==='flow';
  }

  function updateViewportPolicy({pauseOnChange=false}={}){
    const vv=window.visualViewport;
    const w=Math.round(vv?.width||innerWidth),h=Math.round(vv?.height||innerHeight);
    const flow=w>760&&h<650;
    player.dataset.layout=flow?'flow':'fitted';
    story.paced=reducedMotion.matches||w<=760||flow;
    if(story.paced&&story.focused){story.focused=false;document.body.classList.remove('v7-focused')}
    if(!story.paced){
      const navH=$('.site-nav')?.offsetHeight||72;
      const reserve=story.focused?24:navH+32;
      const height=Math.max(620,Math.min(780,h-reserve));
      player.style.setProperty('--v7-player-height',height+'px');
    }else player.style.removeProperty('--v7-player-height');
    const significant=Math.abs(w-lastViewport.w)>40||Math.abs(h-lastViewport.h)>90;
    if(pauseOnChange&&significant&&story.playback==='playing')pauseStory('resize');
    lastViewport={w,h};
    renderControls();
  }

  function chapterForBeat(i){return beats[Math.max(0,Math.min(beats.length-1,i))].chapter}
  function setScene(chapter){
    $$('[data-v7-scene]').forEach(scene=>{
      const active=scene.dataset.v7Scene===chapter;
      scene.hidden=!active;scene.classList.toggle('is-active',active);scene.setAttribute('aria-hidden',String(!active));
    });
    story.visited.add(chapter);player.dataset.chapter=chapter;
    $$('[data-v7-chapter]').forEach(btn=>{
      const active=btn.dataset.v7Chapter===chapter;
      btn.classList.toggle('is-active',active);btn.classList.toggle('is-visited',story.visited.has(btn.dataset.v7Chapter)&&!active);
      if(active)btn.setAttribute('aria-current','step');else btn.removeAttribute('aria-current');
    });
  }

  function setIndicator(target){
    if(!els.indicator||!target)return;
    const sr=els.stage.getBoundingClientRect(),tr=target.getBoundingClientRect();
    els.indicator.style.left=(tr.left-sr.left+Math.min(34,tr.width*.3))+'px';
    els.indicator.style.top=(tr.top-sr.top+Math.min(28,tr.height*.35))+'px';
    els.indicator.classList.add('is-visible');
  }
  function hideIndicator(){els.indicator?.classList.remove('is-visible')}
  function setPhase(phase){story.phase=phase;player.dataset.phase=phase;renderBusiness()}

  function renderBusiness(){
    player.dataset.delivery=business.delivery==='picked-up'?'picked':business.delivery==='awaiting-pickup'?'awaiting':'none';
    const paymentText=business.payment==='paid'?t('paid'):'—';
    const deliveryText=business.delivery==='picked-up'?t('pickedUp'):business.delivery==='awaiting-pickup'?t('awaiting'):t('notBooked');
    const detailStatus=business.delivery==='awaiting-pickup'&&business.bookingRef?deliveryText+' · '+business.bookingRef:deliveryText;
    $$('[data-v7-payment]').forEach(el=>el.textContent=paymentText);
    $$('[data-v7-delivery]').forEach(el=>el.textContent=deliveryText);
    $('[data-v7-status]').forEach(el=>el.textContent=detailStatus);
    $$('[data-v7-progress="booked"]').forEach(el=>el.classList.toggle('is-current',business.delivery==='awaiting-pickup'));
    $$('[data-v7-progress="pickup"]').forEach(el=>el.classList.toggle('is-current',business.delivery==='picked-up'));

    if(els.checkoutStatus){
      const strong=$('strong',els.checkoutStatus);
      if(story.phase==='pending'){if(strong)strong.textContent=t('submitting')}
      else if(story.phase==='confirmed'){if(strong)strong.textContent=t('paymentConfirmed')}
      else if(strong)strong.textContent=t('reviewReady');
    }
    if(els.receipt)els.receipt.setAttribute('aria-hidden',String(!(business.orderCreated&&story.phase==='confirmed')));
    const book=$('#v7BookDelivery');
    if(book){
      book.disabled=business.delivery!=='not-booked';
      const label=$('[data-v7-copy="bookSample"]',book);
      const buttonText=business.delivery==='not-booked'?t('bookSample'):business.delivery==='awaiting-pickup'?t('awaiting'):t('pickedUp');
      if(label)label.textContent=buttonText;else book.textContent=buttonText;
    }
  }

  function renderBeat({preservePhase=false}={}){
    const i=Math.max(0,Math.min(beats.length-1,story.beat)),beat=beats[i];
    player.dataset.beat=String(i);
    if(!preservePhase){
      const phase=i===6?'checkout':i===9?(business.delivery==='not-booked'?'ready':'booked'):i===10?'later':i===11?'result':'idle';
      setPhase(phase);
    }
    const sceneChapter=(i===7&&!story.paced)?'sell':beat.chapter;
    setScene(sceneChapter);
    if(els.caption)els.caption.textContent=(story.directSample&&beat.chapter==='manage'&&story.pauseReason==='chapter')?t('sampleLoaded'):currentCaptions()[i];
    if(els.actor)els.actor.textContent=currentActors()[i];
    if(els.step)els.step.textContent=(isBn()?'ধাপ ':'Step ')+(i+1)+(isBn()?' / ':' of ')+beats.length;
    const headline=story.merchantHeadline||story.demoEditApplied?story.merchantHeadline||demoHeadline():effectiveHeadline();
    if(els.headline)els.headline.textContent=headline;if(els.customerHeadline)els.customerHeadline.textContent=headline;if(els.input)els.input.value=headline;
    if(els.saved)els.saved.textContent=i===1?t('fieldReady'):i===2?t('savedDemo'):t('previewReady');
    if(els.previewState)els.previewState.textContent=i>=3?t('customerPreview'):'Preview';
    hideIndicator();if(i===1)setIndicator($('#v7HeadlineWrap'));if(i===2)setIndicator(els.input);
    renderBusiness();renderProgress(story.elapsed);
  }

  function formatClock(ms){const sec=Math.max(0,Math.floor(ms/1000)),m=Math.floor(sec/60),s=String(sec%60).padStart(2,'0');return m+':'+s}
  function renderProgress(elapsed=story.elapsed){
    const done=totalBefore[story.beat]||0,global=Math.min(totalDuration,done+Math.min(elapsed,beats[story.beat]?.duration||0)),pct=Math.round(global/totalDuration*100);
    if(els.progress){els.progress.style.setProperty('--v7-progress',pct+'%');els.progress.setAttribute('aria-valuenow',String(pct))}
    if(els.time){els.time.textContent=formatClock(global)+' / '+formatClock(totalDuration);els.time.hidden=story.paced}
  }

  function renderControls(){
    story.paced=isPaced();
    const playing=story.playback==='playing',paused=story.playback==='paused',complete=story.playback==='complete';
    if(els.pause)els.pause.hidden=!playing;if(els.cont)els.cont.hidden=!paused||story.paced;
    if(els.prev)els.prev.hidden=!story.paced||(story.beat<=0)||complete;if(els.next)els.next.hidden=!story.paced||complete;
    if(els.tryStep)els.tryStep.hidden=!paused||story.paced;if(els.watchAgain)els.watchAgain.hidden=!complete;if(els.tryComplete)els.tryComplete.hidden=!complete;
    player.dataset.playback=story.playback;if(els.watch)els.watch.disabled=playing;
    const watchText=els.watch?.querySelector('[data-v7-copy="watch"]');if(watchText)watchText.textContent=story.paced?t('watchStep'):t('watch');
  }

  function cancelManagedAnimations({finish=false}={}){
    managedAnimations.forEach(a=>{try{finish?a.finish():a.cancel()}catch{}});managedAnimations=[];$$('.v7-transfer-proxy').forEach(el=>el.remove());
    if(els.orderRow)els.orderRow.style.visibility='';if(els.receipt)els.receipt.style.visibility='';
  }
  function manageAnimation(a){if(!a)return;managedAnimations.push(a);a.finished.catch(()=>{}).finally(()=>{managedAnimations=managedAnimations.filter(x=>x!==a)});return a}
  function pauseManagedAnimations(){managedAnimations.forEach(a=>{try{a.pause()}catch{}})}
  function resumeManagedAnimations(){managedAnimations.forEach(a=>{try{a.play()}catch{}})}

  function runSignatureTransfer(){
    if(story.paced||reducedMotion.matches||!els.receipt||!els.orderRow){setScene('manage');return}
    cancelManagedAnimations();
    const from=els.receipt.getBoundingClientRect();
    if(!from.width){setScene('manage');return}
    const proxy=els.receipt.cloneNode(true);
    proxy.removeAttribute('id');proxy.classList.add('v7-transfer-proxy');proxy.setAttribute('aria-hidden','true');
    Object.assign(proxy.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});
    document.body.appendChild(proxy);els.receipt.style.visibility='hidden';
    setScene('manage');renderBusiness();
    requestAnimationFrame(()=>{
      const to=els.orderRow.getBoundingClientRect();
      if(!to.width){proxy.remove();els.receipt.style.visibility='';return}
      els.orderRow.style.visibility='hidden';
      const dx=to.left-from.left,dy=to.top-from.top,sx=to.width/from.width,sy=Math.min(1,to.height/from.height);
      const a=manageAnimation(proxy.animate([
        {transform:'translate(0,0) scale(1)',transformOrigin:'top left',opacity:1},
        {transform:'translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')',transformOrigin:'top left',opacity:1}
      ],{duration:700,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}));
      a?.finished.then(()=>{
        proxy.remove();els.receipt.style.visibility='';els.orderRow.style.visibility='';
        manageAnimation(els.orderRow.animate([{boxShadow:'0 0 0 0 rgba(29,79,61,0)'},{boxShadow:'0 0 0 4px rgba(29,79,61,.18)'},{boxShadow:'0 0 0 0 rgba(29,79,61,0)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'}));
      }).catch(()=>{proxy.remove();els.receipt.style.visibility='';els.orderRow.style.visibility=''});
    });
  }

  function fireCue(action){
    switch(action){
      case 'select-field':setIndicator($('#v7HeadlineWrap'));break;
      case 'reveal-field':setIndicator(els.input);break;
      case 'edit-focus':setIndicator(els.input);break;
      case 'apply-headline':
        if(!story.merchantHeadline){story.demoEditApplied=true;if(els.headline)els.headline.textContent=demoHeadline();if(els.customerHeadline)els.customerHeadline.textContent=demoHeadline();if(els.input)els.input.value=demoHeadline()}break;
      case 'saved':if(els.saved)els.saved.textContent=t('savedDemo');break;
      case 'clear-selection':hideIndicator();break;
      case 'customer-preview':hideIndicator();break;
      case 'share-link':setIndicator($('#v7ShareCue'));break;
      case 'product-focus':setIndicator($('#v7ProductFocus'));break;
      case 'variant':setIndicator($('.v7-variant-choice .selected'));break;
      case 'add-order':setIndicator($('#v7ProductFocus button'));break;
      case 'checkout':setPhase('checkout');break;
      case 'press-order':setIndicator($('#v7PlaceOrder'));break;
      case 'pending-order':setPhase('pending');break;
      case 'confirm-order':business.orderCreated=true;business.payment='paid';setPhase('confirmed');hideIndicator();break;
      case 'handoff-start':if(!business.orderCreated){business.orderCreated=true;business.payment='paid'}renderBusiness();runSignatureTransfer();break;
      case 'handoff-settle':setScene('manage');cancelManagedAnimations({finish:true});break;
      case 'open-order':setIndicator(els.orderRow);break;
      case 'next-action':setIndicator($('#v7BookDelivery'));break;
      case 'press-book':setIndicator($('#v7BookDelivery'));break;
      case 'booking':setPhase('booking');{const book=$('#v7BookDelivery'),label=book&&$('[data-v7-copy="bookSample"]',book);if(label)label.textContent=t('booking');else if(book)book.textContent=t('booking')}break;
      case 'booked':business.delivery='awaiting-pickup';business.bookingRef=fixture.bookingRef;setPhase('booked');hideIndicator();break;
      case 'later':setPhase('later');break;
      case 'picked-up':business.delivery='picked-up';setPhase('picked');break;
      case 'settle-result':setPhase('result');break;
    }
    renderBusiness();
  }

  function runDueCues(elapsed){
    const beat=beats[story.beat];if(!beat)return;
    beat.cues.forEach(([at,action])=>{const key=story.runId+':'+story.beat+':'+action;if(elapsed>=at&&!story.fired.has(key)){story.fired.add(key);fireCue(action)}});
  }

  function tick(now){
    if(story.playback!=='playing')return;
    const elapsed=story.elapsed+(now-story.beatStarted);runDueCues(elapsed);renderProgress(elapsed);const beat=beats[story.beat];
    if(elapsed>=beat.duration){
      story.beat++;story.elapsed=0;story.beatStarted=now;hideIndicator();
      if(story.beat>=beats.length){completeStory();return}
      renderBeat();runDueCues(0);
    }
    raf=requestAnimationFrame(tick);
  }

  function startClock(){
    if(story.paced)return;cancelAnimationFrame(raf);story.playback='playing';story.pauseReason=null;story.beatStarted=performance.now();renderControls();raf=requestAnimationFrame(tick);
  }
  function pauseStory(reason='user'){
    if(story.playback!=='playing')return;story.elapsed+=performance.now()-story.beatStarted;cancelAnimationFrame(raf);pauseManagedAnimations();story.playback='paused';story.pauseReason=reason;renderProgress();renderControls();
  }
  function resumeStory(){
    if(story.playback!=='paused'||story.paced)return;story.playback='playing';story.pauseReason=null;story.beatStarted=performance.now();resumeManagedAnimations();renderControls();raf=requestAnimationFrame(tick);
  }
  function completeStory(){
    cancelAnimationFrame(raf);cancelManagedAnimations({finish:true});hideIndicator();story.beat=11;story.elapsed=beats[11].duration;story.playback='complete';story.pauseReason=null;
    business.orderCreated=true;business.payment='paid';business.delivery='picked-up';
    renderBeat({preservePhase:true});setPhase('result');renderProgress(beats[11].duration);renderControls();exitFocus({pause:false,scroll:false});
  }

  function resetDemoEvents(){
    business=createBusiness();story.elapsed=0;story.beat=0;story.phase='idle';story.directSample=false;story.pauseReason=null;story.demoEditApplied=false;story.fired.clear();story.runId++;
    cancelManagedAnimations();hideIndicator();renderBeat();renderBusiness();
  }

  function alignPlayer(){
    const top=Math.max(0,player.getBoundingClientRect().top+scrollY-12),root=document.documentElement,old=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';scrollTo({top,left:0,behavior:'auto'});root.style.scrollBehavior=old;
  }
  function enterFocus(){
    if(story.paced)return;story.focused=true;document.body.classList.add('v7-focused');updateViewportPolicy();requestAnimationFrame(()=>requestAnimationFrame(alignPlayer));
  }
  function exitFocus({pause=true,scroll=false}={}){
    if(pause&&story.playback==='playing')pauseStory('leave-focus');story.focused=false;document.body.classList.remove('v7-focused');updateViewportPolicy();
    if(scroll)$('#features')?.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
  }

  function beginStory(){
    story.paced=isPaced();resetDemoEvents();
    if(story.paced){exitFocus({pause:false});story.playback='paused';story.pauseReason='paced';renderControls();player.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});return}
    enterFocus();requestAnimationFrame(()=>requestAnimationFrame(()=>{alignPlayer();startClock()}));
  }
  function replayStory(){resetDemoEvents();beginStory()}

  function stepTo(next){
    cancelManagedAnimations();hideIndicator();story.beat=Math.max(0,Math.min(beats.length-1,next));story.elapsed=0;story.playback='paused';story.pauseReason='paced';story.runId++;story.fired.clear();
    story.demoEditApplied=story.beat>=2&&!story.merchantHeadline;
    if(story.beat>=6){business.orderCreated=true;business.payment='paid'}else business=createBusiness();
    if(story.beat>=9){business.delivery='awaiting-pickup';business.bookingRef=fixture.bookingRef}if(story.beat>=10)business.delivery='picked-up';if(story.beat===11)story.playback='complete';
    renderBeat();
    if(story.beat===6)setPhase('confirmed');
    renderBusiness();renderControls();
  }

  function jumpChapter(chapter){
    if(story.playback==='playing')pauseStory('chapter');cancelManagedAnimations();story.directSample=false;
    if(chapter==='build'){story.beat=0;business=createBusiness();story.demoEditApplied=false}
    if(chapter==='sell'){story.beat=5;business=createBusiness()}
    if(chapter==='manage'){story.beat=8;business={orderCreated:true,payment:'paid',delivery:'not-booked',bookingRef:null};story.directSample=true}
    story.elapsed=0;story.playback='paused';story.pauseReason='chapter';story.runId++;story.fired.clear();renderBeat();renderBusiness();renderControls();
    if(story.focused)requestAnimationFrame(()=>requestAnimationFrame(alignPlayer));
    else player.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'center'})
  }

  function syncLegacyFixture(){
    const checkoutTotals=$('#workflowDemo .checkout-total strong'),checkoutTotal=checkoutTotals[checkoutTotals.length-1];if(checkoutTotal)checkoutTotal.textContent=money(fixture.total);
    const paymentEm=$('.workflow-step[data-step="payment"] em');if(paymentEm)paymentEm.textContent=money(fixture.total);
    const rowAmount=$('#workspaceOrderRow > strong');if(rowAmount)rowAmount.textContent=money(fixture.total);
    const detailPayment=$('#workspacePaymentDetail + small');if(detailPayment)detailPayment.textContent=money(fixture.total);
    const paymentMetric=$('#workspacePaymentMetric')?.nextElementSibling;if(paymentMetric)paymentMetric.textContent='bKash · '+money(fixture.total);
    const checkout=$('#workflowDemo .workflow-checkout');
    if(checkout&&!$('.v7-legacy-delivery-row',checkout)){
      const total=$('.checkout-total',checkout),row=document.createElement('div');row.className='checkout-total v7-legacy-delivery-row';
      row.innerHTML='<span>'+t('sampleDelivery')+'</span><strong>'+money(fixture.sampleDelivery)+'</strong>';total?.before(row);
    }
  }

  function ensureHandsOnBar(){
    const legacy=$('#v7HandsOnLegacy');if(!legacy||$('.v7-hands-on-bar',legacy))return;
    const bar=document.createElement('div');bar.className='v7-hands-on-bar';
    bar.innerHTML='<div><strong data-v7-hands-title></strong><small data-v7-hands-note></small></div><button type="button" id="v7ReturnStory"></button>';
    legacy.querySelector('.shell')?.prepend(bar);$('#v7ReturnStory',bar)?.addEventListener('click',closeHandsOn);
  }
  function renderHandsOnBar(){
    const title=$('[data-v7-hands-title]'),note=$('[data-v7-hands-note]'),btn=$('#v7ReturnStory');
    if(title)title.textContent=t('handsOn');if(note)note.textContent=t('handsOnNote');if(btn)btn.textContent='← '+t('returnStory');
  }
  function openHandsOn(chapter='build'){
    if(story.playback==='playing')pauseStory('hands-on');exitFocus({pause:false});ensureHandsOnBar();syncLegacyFixture();renderHandsOnBar();document.body.classList.add('v7-hands-on');
    requestAnimationFrame(()=>{const btn=$('[data-journey-chapter="'+chapter+'"]');btn?.click();$('#v7HandsOnLegacy')?.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'})});
  }
  function closeHandsOn(){
    const legacyHeadline=readLegacyHeadline();story.merchantHeadline=legacyHeadline&&legacyHeadline!==story.baselineHeadline?legacyHeadline:null;
    document.body.classList.remove('v7-hands-on');story.playback='paused';story.pauseReason='hands-on';renderBeat();renderControls();
    requestAnimationFrame(()=>player.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'center'}));
  }

  function bookFromStage(){
    if(story.playback==='playing')pauseStory('interaction');if(!business.orderCreated){business.orderCreated=true;business.payment='paid'}if(business.delivery!=='not-booked')return;
    business.delivery='awaiting-pickup';business.bookingRef=fixture.bookingRef;story.phase='booked';renderBusiness();renderControls();
  }

  els.watch?.addEventListener('click',beginStory);
  $('#v7Explore')?.addEventListener('click',()=>openHandsOn('build'));
  $('#v7ExploreBottom')?.addEventListener('click',()=>openHandsOn('build'));
  els.tryComplete?.addEventListener('click',()=>openHandsOn(chapterForBeat(story.beat)));
  els.tryStep?.addEventListener('click',()=>openHandsOn(chapterForBeat(story.beat)));
  els.pause?.addEventListener('click',()=>pauseStory('user'));els.cont?.addEventListener('click',resumeStory);els.watchAgain?.addEventListener('click',replayStory);
  els.next?.addEventListener('click',()=>stepTo(story.beat+1));els.prev?.addEventListener('click',()=>stepTo(story.beat-1));els.backPage?.addEventListener('click',()=>exitFocus({pause:true,scroll:true}));
  $('#v7BookDelivery')?.addEventListener('click',bookFromStage);
  $$('[data-v7-chapter]').forEach(btn=>btn.addEventListener('click',()=>jumpChapter(btn.dataset.v7Chapter)));

  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&story.focused)exitFocus({pause:true,scroll:false})});
  $('.site-nav')?.addEventListener('focusin',()=>{if(story.focused)exitFocus({pause:true,scroll:false})});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&story.playback==='playing'){pauseStory('hidden');exitFocus({pause:false})}});

  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{const entry=entries[0];if(entry&&story.playback==='playing'&&entry.intersectionRatio<.65){pauseStory('visibility');exitFocus({pause:false})}},{threshold:[0,.65,.9]}).observe(els.stage);
  }

  const languageObserver=new MutationObserver(()=>{if(story.playback==='playing')pauseStory('language');applyCopy();renderHandsOnBar();syncLegacyFixture()});
  languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  reducedMotion.addEventListener?.('change',()=>{if(story.playback==='playing')pauseStory('motion-preference');cancelManagedAnimations();updateViewportPolicy();renderControls()});
  let resizeFrame=0;
  addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{cancelManagedAnimations();updateViewportPolicy({pauseOnChange:true});renderBeat({preservePhase:true})})});
  visualViewport?.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>updateViewportPolicy({pauseOnChange:true}))});

  ensureHandsOnBar();story.baselineHeadline=readLegacyHeadline();updateViewportPolicy();applyCopy();renderBeat();renderControls();syncLegacyFixture();

  window.__ezcomoV7={
    fixture,getState:()=>({business:{...business},story:{beat:story.beat,elapsed:story.elapsed,playback:story.playback,pauseReason:story.pauseReason,focused:story.focused,paced:story.paced,phase:story.phase,merchantHeadline:story.merchantHeadline}}),
    play:beginStory,pause:pauseStory,resume:resumeStory,next:()=>stepTo(story.beat+1),prev:()=>stepTo(story.beat-1),jump:jumpChapter,openHandsOn,closeHandsOn,replay:replayStory
  };
})();
