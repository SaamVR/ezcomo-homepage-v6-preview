/* EZComo story controller: a single clock, deterministic projections, local sample data only. */
(()=>{'use strict';
 const $=id=>document.getElementById(id),player=$('storyPlayer');if(!player)return;
 const stage=$('storyStage'),editor=$('editorDemo'),headline=document.querySelector('#heroBlock .editable-title');
 const chapters=[...document.querySelectorAll('[data-story-chapter]')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:700px)');
 const durations=[3000,4000,4000,4000,4000,5000,5000,4000,5000,5000,4000,5000];
 const phases=['establish','select','edit','preview','share','choose','checkout','arrive','review','book','pickup','result'];
 const total=durations.reduce((a,b)=>a+b,0),animations=new Set();
 const en={};document.querySelectorAll('[data-story-copy]').forEach(n=>en[n.dataset.storyCopy]=n.innerHTML);
 const bn={eyebrow:'একটি অর্ডারের গল্প',title:'আপনার স্টোর থেকে<br><em>আপনার পরের পদক্ষেপ।</em>',intro:'ক্রেতার পছন্দ কীভাবে অর্ডার হয়ে আপনার কাছে আসে, দেখুন। স্টোর থেকে ডেলিভারির প্রস্তুতি—সব EZComo-তে।',try:'নিজে ব্যবহার করে দেখুন',disclosure:'ইন্টার‍্যাক্টিভ ডেমো · নমুনা লেনদেন · আসল পেমেন্ট বা ডেলিভারি নয়',build:'তৈরি',buildSub:'নিজের মতো সাজান',sell:'বিক্রি',sellSub:'অর্ডার গ্রহণ করুন',manage:'পরিচালনা',manageSub:'পরের কাজটি করুন',exit:'পেজে ফিরুন ↗',shared:'আপনার স্টোরের লিংক',shareNote:'পোস্ট বা মেসেজ থেকে সরাসরি আপনার স্টোরে।',openStore:'স্টোর খুলুন →',customerView:'ক্রেতার ভিউ',newDrop:'প্রতিদিনের সংগ্রহ',teeDescription:'প্রতিদিনের জন্য। আপনার নিজের পছন্দ।',colour:'রং',black:'কালো',size:'সাইজ',add:'অর্ডারে যোগ করুন',yourOrder:'আপনার অর্ডার',cartTitle:'একটি পছন্দ থেকে একটি অর্ডার।',cartNote:'পণ্য, রং, সাইজ—সব তথ্য একসঙ্গে।',variant:'কালো / M · পরিমাণ ১',subtotal:'পণ্যের দাম',deliveryFee:'নমুনা ডেলিভারি ফি',total:'মোট',paymentMethod:'পেমেন্ট পদ্ধতি',simulated:'নমুনা পেমেন্ট',place:'নমুনা অর্ডার করুন',sampleFee:'৳৬০ শুধু ডেমোর জন্য। আসল কুরিয়ার চার্জ নয়।',orderConfirmed:'অর্ডার নিশ্চিত হয়েছে',paid:'পেমেন্ট হয়েছে · নমুনা',viewOrder:'ওয়ার্কস্পেসে দেখুন →',orders:'অর্ডার',products:'পণ্য',payments:'পেমেন্ট',delivery:'ডেলিভারি',sampleWorkspace:'নমুনা ওয়ার্কস্পেস',yourWorkspace:'আপনার ওয়ার্কস্পেস',newOrder:'একটি অর্ডার। সব তথ্য সঙ্গে।',recentOrder:'সাম্প্রতিক অর্ডার',amount:'মোট',orderReceived:'অর্ডার এসেছে',deliveryBooked:'ডেলিভারি বুকড',pickedUp:'পিকআপ হয়েছে',listNote:'একই পণ্য, একই অর্ডার। আবার তথ্য লিখতে হয় না।',connected:'সব একসঙ্গে',resultTitle:'আপনি জানেন পরের কাজটি কী।',resultNote:'স্টোর থেকে অর্ডার, তারপর ডেলিভারি—একটি পরিষ্কার ধারাবাহিকতা।',reviewTitle:'পরের কাজটি পরিষ্কার।',reviewNote:'অর্ডারের তথ্য দেখুন এবং ডেলিভারি প্রস্তুত করুন।',review:'অর্ডার দেখুন →',paidShort:'পরিশোধিত',orderDetails:'অর্ডারের তথ্য',product:'পণ্য',payment:'পেমেন্ট',destination:'গন্তব্য',sampleAddress:'ঢাকা · নমুনা ঠিকানা',nextAction:'পরের কাজ',book:'নমুনা ডেলিভারি বুক করুন →',pickup:'পরের পিকআপ আপডেট দেখুন →',later:'দিনের পরের অংশ · নমুনা আপডেট',laterNote:'কুরিয়ারের আপডেট #1051 অর্ডারে যুক্ত হয়েছে।',closing:'একটি স্টোর। একটি অর্ডার। পরিষ্কার পরের পদক্ষেপ।',belowNote:'ডেমোটি দেখুন, তারপর নিজের স্টোর তৈরি করুন।'};
 const captions={en:[
  'Start with a storefront you can make your own.',
  'Choose the headline. This is where your brand starts to sound like you.',
  'Change your message and see it on the storefront immediately.',
  'Now see the same store through your customer’s eyes.',
  'Share your store link. A post or message becomes a way into your business.',
  'Your customer chooses the Studio Tee in Black / M. Those choices stay with the order.',
  'A clear total. A sample payment. One confirmed order: #1051.',
  'The customer’s order arrives in your workspace with its details attached.',
  'Review the product, payment and address before you prepare delivery.',
  'Book a sample delivery. The order is now awaiting pickup.',
  'Later that day, a sample courier update marks the order picked up.',
  'From your storefront to the next action—one connected order, with nothing to re-enter.'
 ],bn:[
  'নিজের মতো সাজানোর জন্য একটি স্টোর দিয়ে শুরু করুন।','হেডলাইন বেছে নিন। এখানেই আপনার ব্র্যান্ডের নিজস্ব কণ্ঠ তৈরি হয়।','বার্তা বদলান, সঙ্গে সঙ্গে স্টোরে পরিবর্তন দেখুন।','এবার একই স্টোর দেখুন আপনার ক্রেতার চোখে।','স্টোরের লিংক শেয়ার করুন। পোস্ট বা মেসেজ থেকে ক্রেতা পৌঁছাবে আপনার ব্যবসায়।','ক্রেতা Studio Tee-এর কালো রং ও M সাইজ বেছে নেয়। তথ্যগুলো অর্ডারের সঙ্গে থাকে।','পরিষ্কার মোট দাম, নমুনা পেমেন্ট, একটি নিশ্চিত অর্ডার: #1051।','ক্রেতার অর্ডার সব তথ্যসহ আপনার ওয়ার্কস্পেসে এসে পৌঁছায়।','ডেলিভারি প্রস্তুতির আগে পণ্য, পেমেন্ট ও ঠিকানা দেখে নিন।','নমুনা ডেলিভারি বুক করুন। অর্ডার এখন পিকআপের অপেক্ষায়।','দিনের পরের অংশে কুরিয়ারের নমুনা আপডেট: পিকআপ হয়েছে।','স্টোর থেকে পরের কাজ—একই অর্ডার, একই তথ্য। আবার লিখতে হয় না।'
 ]};
 const words={en:{watch:'Watch the journey · 52 sec',steps:'Explore the journey →',pause:'Pause',continue:'Continue',next:'Next step →',back:'Back',replay:'Watch again',try:'Try this step',return:'Return to story',you:'YOU · BUILD',customer:'YOUR CUSTOMER · SELL',manage:'YOU · MANAGE',editor:'YOUR EDITOR',preview:'CUSTOMER PREVIEW',prepare:'Prepare delivery',awaiting:'Awaiting pickup',picked:'Picked up',received:'Order received',booking:'Sample booking · DEMO-1051',placing:'Confirming sample order…',loaded:'Sample order #1051 loaded. Review it, then prepare delivery.',manualBuild:'Your turn: edit the headline, change a colour, or reorder a section.',manualSell:'Your turn: choose Black / M and place a sample order.',choose:'Choose a colour and size first.',added:'Added to your order. Check the total, then place the sample order.',done:'Journey complete. Explore any chapter or try it yourself.'},bn:{watch:'গল্পটি দেখুন · ৫২ সেকেন্ড',steps:'ধাপে ধাপে দেখুন →',pause:'থামান',continue:'চালিয়ে যান',next:'পরের ধাপ →',back:'আগের ধাপ',replay:'আবার দেখুন',try:'নিজে করে দেখুন',return:'গল্পে ফিরুন',you:'আপনি · তৈরি',customer:'আপনার ক্রেতা · বিক্রি',manage:'আপনি · পরিচালনা',editor:'আপনার এডিটর',preview:'ক্রেতার প্রিভিউ',prepare:'ডেলিভারি প্রস্তুত করুন',awaiting:'পিকআপের অপেক্ষায়',picked:'পিকআপ হয়েছে',received:'অর্ডার এসেছে',booking:'নমুনা বুকিং · DEMO-1051',placing:'নমুনা অর্ডার নিশ্চিত হচ্ছে…',loaded:'নমুনা অর্ডার #1051 লোড হয়েছে। দেখে ডেলিভারি প্রস্তুত করুন।',manualBuild:'এবার আপনি: হেডলাইন লিখুন, রং বদলান অথবা সেকশন সাজান।',manualSell:'এবার আপনি: কালো / M বেছে নিয়ে নমুনা অর্ডার করুন।',choose:'আগে রং ও সাইজ বেছে নিন।',added:'অর্ডারে যোগ হয়েছে। মোট দাম দেখে নমুনা অর্ডার করুন।',done:'গল্পটি শেষ। যেকোনো ধাপ নিজে করে দেখুন।'}};
 const initialHeadline=headline.textContent;let edited=false,programmatic=false,raf=0,last=0,projectionKey='',captionOverride='',immersive=false;
 let state={mode:'guided',playback:'idle',beat:0,elapsed:0,scene:'build',colour:false,size:false,cart:false,order:null,detail:false,delivery:'not-booked'};
 const lang=()=>document.documentElement.lang==='bn'?'bn':'en',w=key=>words[lang()][key];
 const stepped=()=>reduce.matches||phone.matches||window.innerHeight<690;
 const show=(id,yes)=>$(id).hidden=!yes;
 const animate=(node,frames,options={})=>{if(!node||reduce.matches||state.playback==='paused'||state.playback==='stepped')return null;const a=node.animate?.(frames,{duration:650,easing:'cubic-bezier(.22,.8,.25,1)',...options});if(a){animations.add(a);a.onfinish=()=>{animations.delete(a);options.onDone?.()};a.oncancel=()=>animations.delete(a)}return a};
 function cancelAnimations(){animations.forEach(a=>a.cancel());animations.clear();stage.querySelectorAll('.story-transfer').forEach(n=>n.remove())}
 function transfer(source,target){if(reduce.matches||stepped()||!source||!target)return;const a=source.getBoundingClientRect(),b=target.getBoundingClientRect(),s=stage.getBoundingClientRect();if(!a.width||!b.width)return;const proxy=document.createElement('div');proxy.className='story-transfer';proxy.setAttribute('aria-hidden','true');proxy.style.cssText=`left:${a.left-s.left}px;top:${a.top-s.top}px;width:${Math.min(a.width,180)}px;padding:15px;background:#f4f6ed;color:#29412c;font:600 13px sans-serif;`;
 proxy.textContent=state.order?'#1051 · Studio Tee':'Studio Tee · Black / M';stage.append(proxy);const motion=animate(proxy,[{transform:'translate(0,0)',opacity:1},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px)`,opacity:.95},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px)`,opacity:0}],{duration:850,onDone:()=>proxy.remove()});if(!motion)proxy.remove();}
 function project(){const b=state.beat,t=state.elapsed;return{scene:b<5?'build':b<7?'sell':'manage',colour:b>5||(b===5&&t>=600),size:b>5||(b===5&&t>=1400),cart:b>5||(b===5&&t>=2600),order:b>6||(b===6&&t>=3000)?{id:'1051',product:'Studio Tee',colour:'Black',size:'M',quantity:1,itemPrice:1490,deliveryFee:60,total:1490+60,payment:'paid-sample'}:null,detail:b>8||(b===8&&t>=1000),delivery:b>10||(b===10&&t>=1200)?'picked-up':b>9||(b===9&&t>=1800)?'awaiting-pickup':'not-booked'};}
 function editorText(text){programmatic=true;headline.textContent=text;const input=$('editorTextInput');input.value=text;programmatic=false;}
 function render(force=false){
  const previous={...state};if(state.mode==='guided')Object.assign(state,project());
  const phase=state.mode==='manual'?state.scene==='build'?'establish':state.scene==='sell'?'choose':state.detail?'review':'arrive':state.beat===3&&state.elapsed<450?'retract':phases[state.beat];
  const oldPhase=player.dataset.phase;
  const key=[state.mode,state.scene,phase,state.colour,state.size,state.cart,state.order?.id,state.detail,state.delivery,state.playback,lang()].join('|');
  if(key!==projectionKey||force){
   const receiptSource=previous.scene==='sell'&&state.scene==='manage'&&$('storyReceipt').getBoundingClientRect();
   const receiptProxy=receiptSource?{getBoundingClientRect:()=>receiptSource}:null;
   player.dataset.mode=state.mode;player.dataset.scene=state.scene;player.dataset.phase=phase;player.dataset.playback=state.playback;player.dataset.detail=String(state.detail);
   show('storyStore',state.scene==='build');show('storySell',state.scene==='sell');show('storyManage',state.scene==='manage');
   editor.inert=state.mode==='guided';$('storySell').inert=state.mode==='guided';$('storyManage').inert=state.mode==='guided';
   chapters.forEach(b=>{if(b.dataset.storyChapter===state.scene)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
   $('storySurfaceLabel').textContent=w(['preview','share'].includes(phase)?'preview':'editor');show('storyShare',phase==='share');
   $('storyColour').setAttribute('aria-pressed',String(state.colour));$('storySize').setAttribute('aria-pressed',String(state.size));
   show('storyCartEmpty',!state.cart);show('storyCart',state.cart&&!state.order);show('storyReceipt',!!state.order);
   $('storyCheckoutStep').textContent=state.order?'02 / 02':'01 / 02';
   $('storyPlace').textContent=lang()==='bn'?bn.place:en.place;$('storyPlace').disabled=state.mode==='guided';
   show('storyReviewPrompt',!state.detail);show('storyDetailContent',state.detail);$('commerceOrderRow').setAttribute('aria-expanded',String(state.detail));
   $('storyRowStatus').textContent=w(state.delivery==='picked-up'?'picked':state.delivery==='awaiting-pickup'?'awaiting':'received');
   $('storyDeliveryStatus').textContent=w(state.delivery==='not-booked'?'prepare':state.delivery==='awaiting-pickup'?'awaiting':'picked');
   $('storyCourierRef').textContent=state.delivery==='not-booked'?'':w('booking');
   show('storyBook',state.delivery==='not-booked');show('storyPickup',state.mode==='manual'&&state.delivery==='awaiting-pickup');show('storyLater',state.delivery==='picked-up');
   ['flowReceived','flowBooked','flowPicked'].forEach((id,i)=>$(id).classList.toggle('is-done',i===0||i===1&&state.delivery!=='not-booked'||i===2&&state.delivery==='picked-up'));
   show('storyResult',state.mode==='guided'&&state.beat===11||state.mode==='manual'&&state.delivery==='picked-up');
   $('storyActor').textContent=w(state.scene==='build'?'you':state.scene==='sell'?'customer':'manage');
   let caption=captionOverride?w(captionOverride):captions[lang()][state.beat];
   if(!captionOverride&&state.mode==='guided'&&state.beat===6&&!state.order)caption=lang()==='bn'?'ক্রেতা মোট দাম দেখে নমুনা অর্ডারটি নিশ্চিত করে।':'Your customer checks the total and confirms the sample order.';
   if(!captionOverride&&state.mode==='guided'&&state.beat===9&&state.delivery==='not-booked')caption=lang()==='bn'?'অর্ডারটি প্রস্তুত। এবার নমুনা ডেলিভারি বুক করুন।':'The order is ready. Book a sample delivery from the same workspace.';
   $('storyCaption').textContent=caption;
   show('storyPlay',state.mode==='guided'&&['playing','paused'].includes(state.playback));$('storyPlay').textContent=w(state.playback==='playing'?'pause':'continue');
   show('storyNext',state.mode==='guided'&&state.playback!=='complete'&&state.playback!=='idle'&&state.playback!=='playing');
   show('storyBack',state.mode==='guided'&&state.beat>0&&state.playback!=='playing');
   show('storyTry',state.mode==='guided'&&state.playback!=='playing');show('storyReplay',state.playback==='complete');show('storyReturn',state.mode==='manual');
   if(phase!==oldPhase){
    if(phase==='retract')animate(document.querySelector('.editor-inspector'),[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(24px)'}],{duration:450});
    if(phase==='preview')animate(document.querySelector('.editor-stage'),[{opacity:.65,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}]);
    if(phase==='share')animate($('storyShare'),[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}]);
   }
   if(state.scene!==previous.scene)animate($(state.scene==='build'?'storyStore':state.scene==='sell'?'storySell':'storyManage'),[{opacity:.4,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}]);
   if(!previous.cart&&state.cart&&state.scene==='sell')transfer($('storyProductArt'),$('storyCartThumb'));
   if(receiptProxy)transfer(receiptProxy,$('commerceOrderRow'));
   if(!previous.detail&&state.detail)animate($('storyDetailContent'),[{opacity:0,transform:'translateX(16px)'},{opacity:1,transform:'translateX(0)'}]);
   if(previous.delivery!==state.delivery)animate($('storyDeliveryStatus'),[{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}]);
   projectionKey=key;
  }
  if(state.mode==='guided'&&state.beat===2&&!edited){const next=lang()==='bn'?'আপনার প্রতিদিন। আপনার নিজস্ব স্টাইল।':'Your everyday. Your own way.';const count=reduce.matches?next.length:Math.floor(Math.max(0,state.elapsed-350)/45);editorText(next.slice(0,count)||initialHeadline);}
  if(state.mode==='guided'&&state.beat===6&&state.elapsed>=1100&&state.elapsed<3000&&!state.order)$('storyPlace').textContent=w('placing');
  const elapsed=durations.slice(0,state.beat).reduce((a,b)=>a+b,0)+state.elapsed,percent=state.playback==='complete'?100:Math.min(100,elapsed/total*100);
  $('storyProgress').firstElementChild.style.width=percent+'%';$('storyProgress').setAttribute('aria-valuenow',String(Math.round(percent)));$('storyCounter').textContent=String(state.beat+1).padStart(2,'0')+' / 12';
 }
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
 function pause(){if(state.playback!=='playing')return;stop();state.playback='paused';animations.forEach(a=>a.pause());render()}
 function frame(now){if(state.playback!=='playing')return;if(!last)last=now;state.elapsed+=Math.min(now-last,100);last=now;while(state.elapsed>=durations[state.beat]){state.elapsed-=durations[state.beat];if(state.beat===11){state.elapsed=durations[11];state.playback='complete';stop();const hadFocus=player.contains(document.activeElement);render();if(hadFocus)$('storyReplay').focus({preventScroll:true});return}state.beat++}render();raf=requestAnimationFrame(frame)}
 function play(){if(stepped()){state.playback='stepped';render();return}state.playback='playing';last=0;animations.forEach(a=>a.play());render();raf=requestAnimationFrame(frame)}
 function setImmersive(on){immersive=on;document.body.classList.toggle('story-immersive',on);show('storyExit',on)}
 function align(){const top=player.getBoundingClientRect().top+window.scrollY-(immersive?16:84);window.scrollTo({top,behavior:'instant'})}
 function start(){stop();cancelAnimations();captionOverride='';state={...state,mode:'guided',playback:'idle',beat:0,elapsed:0};if(!edited)editorText(initialHeadline);setImmersive(true);render(true);align();play();$('storyPlay').hidden?$('storyNext').focus({preventScroll:true}):$('storyPlay').focus({preventScroll:true})}
 function step(delta){stop();cancelAnimations();captionOverride='';if(delta>0&&state.beat===11){state.playback='complete';state.elapsed=durations[11];render();return}state.beat=Math.max(0,Math.min(11,state.beat+delta));state.elapsed=durations[state.beat]-1;state.playback=state.beat===11?'complete':'stepped';render(true);}
 function manual(scene=state.scene){stop();cancelAnimations();state.mode='manual';state.playback='manual';state.scene=scene;state.beat=scene==='build'?0:scene==='sell'?5:7;state.elapsed=0;setImmersive(false);captionOverride=scene==='build'?'manualBuild':scene==='sell'?'manualSell':'loaded';if(scene==='sell'){state.cart=false;state.colour=false;state.size=false;state.order=null;state.delivery='not-booked';state.detail=false}if(scene==='manage'&&!state.order)state.order={id:'1051',product:'Studio Tee',colour:'Black',size:'M',quantity:1,itemPrice:1490,deliveryFee:60,total:1550,payment:'paid-sample'};render(true)}
 function action(fn){if(state.mode!=='manual')manual();captionOverride='';fn();render(true)}
 function language(){document.querySelectorAll('[data-story-copy]').forEach(n=>{const key=n.dataset.storyCopy,value=lang()==='bn'?bn[key]||en[key]:en[key];if(key==='title')n.innerHTML=value;else n.textContent=value});$('storyWatch').textContent=w(stepped()?'steps':'watch');['Back','Next','Try','Replay','Return'].forEach(k=>$('story'+k).textContent=w(k.toLowerCase()));render(true)}
 $('storyWatch').addEventListener('click',start);$('heroStoryLink')?.addEventListener('click',e=>{e.preventDefault();start()});$('storyReplay').addEventListener('click',start);
 $('storyExplore').addEventListener('click',()=>{manual('build');align()});$('storyTry').addEventListener('click',()=>manual());$('storyReturn').addEventListener('click',()=>{state.mode='guided';state.playback='stepped';state.elapsed=durations[state.beat]-1;captionOverride='';render(true);align()});
 $('storyPlay').addEventListener('click',()=>state.playback==='playing'?pause():play());$('storyNext').addEventListener('click',()=>step(1));$('storyBack').addEventListener('click',()=>step(-1));
 chapters.forEach(b=>b.addEventListener('click',()=>manual(b.dataset.storyChapter)));
 $('storyExit').addEventListener('click',()=>{pause();setImmersive(false);$('storyWatch').focus({preventScroll:true})});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&immersive){pause();setImmersive(false);$('storyWatch').focus({preventScroll:true})}});
 $('storyOpenStore').addEventListener('click',()=>{manual('sell');align()});
 $('storyColour').addEventListener('click',()=>action(()=>state.colour=!state.colour));$('storySize').addEventListener('click',()=>action(()=>state.size=!state.size));
 $('storyAdd').addEventListener('click',()=>action(()=>{if(!state.colour||!state.size){captionOverride='choose';return}state.cart=true;captionOverride='added'}));
 $('storyPlace').addEventListener('click',()=>action(()=>{if(!state.cart)return;state.order={id:'1051',product:'Studio Tee',colour:'Black',size:'M',quantity:1,itemPrice:1490,deliveryFee:60,total:1490+60,payment:'paid-sample'};state.beat=6}));
 $('storyViewOrder').addEventListener('click',()=>{manual('manage');captionOverride='';render(true)});
 ['storyReview','commerceOrderRow'].forEach(id=>$(id).addEventListener('click',()=>action(()=>{state.detail=true;state.beat=8})));
 $('storyBook').addEventListener('click',()=>action(()=>{if(!state.order||state.delivery!=='not-booked')return;state.delivery='awaiting-pickup';state.beat=9}));
 $('storyPickup').addEventListener('click',()=>action(()=>{if(state.delivery!=='awaiting-pickup')return;state.delivery='picked-up';state.beat=10}));
 editor.addEventListener('input',()=>{if(!programmatic)edited=true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 if('IntersectionObserver'in window){new IntersectionObserver(entries=>{const e=entries[0];if(!e.isIntersecting||e.intersectionRatio<.6){pause();if(!e.isIntersecting)setImmersive(false)}},{threshold:[0,.6]}).observe(stage)}
 function environmentChanged(){if(stepped()&&state.playback==='playing'){pause();state.playback='stepped';render()}language()}
 reduce.addEventListener?.('change',environmentChanged);phone.addEventListener?.('change',environmentChanged);
 window.__syncWorkflowLanguage=language;show('storyWatch',true);show('storyExplore',true);language();
 if(location.hash==='#chapter-manage')manual('manage');else if(location.hash==='#chapter-sell')manual('sell');
 window.__ezcomoStory={getState:()=>JSON.parse(JSON.stringify({...state,edited,immersive})),pause};
})();
