/* EZComo V10 · one state, one clock, one continuous product story.
   Demo-only data. Never sends a payment, booking, or merchant write. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const player = $('cxPlayer'); if (!player) return;
const all = (q, root=player) => [...root.querySelectorAll(q)];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const phone = matchMedia('(max-width: 700px)');
const EASE = 'cubic-bezier(.22,1,.36,1)';
const STORY_SPEED = 1.25;
const defaults = () => ({chapter:'build',tool:'page',view:'home',preview:false,headline:'Everyday essentials.',body:'Good things for everyday living.',button:'Shop collection',promoText:'The weekend edit',content:'hero',sectionTexts:{},sectionColors:{},sectionAligns:{},canvasMode:'overview',layout:'split',promo:'feature',palette:'original',size:'M',bag:0,order:false,customerName:'',customerPhone:'',customerAddress:'',payment:'cod',provider:'',paid:false,courierOpen:false,admin:'home',courier:'',shipment:0,settled:false,published:false,saved:false});
let state=defaults(), step=0, playing=false, elapsed=0, last=0, raf=0, applied=false, mode='guided', started=false, inView=true, manualSnapshot=null;
let undo=[], redo=[], animations=new Set(), highlighted=null, previousChapter='build';
let canvasFrame=0,canvasKey='',pendingSectionFocus=false;
const sectionMap={
 announcement:{id:'cxAnnouncement',text:'cxAnnouncementText',label:'Announcement',value:'Thoughtful essentials. Everyday prices.'},
 header:{id:'cxStoreHeader',text:'cxStoreBrand',label:'Header',value:'THREADS'},
 hero:{id:'cxHero',text:'cxHeroText',label:'Hero'},
 categories:{id:'cxCategories',text:'cxCategoriesTitle',label:'Categories',value:'Shop by collection'},
 products:{id:'cxFeatured',text:'cxProductsTitle',label:'Featured products',value:'Featured products'},
 promo:{id:'cxPromo',text:'cxPromoText',label:'Collection promo'},
 new:{id:'cxNew',text:'cxNewTitle',label:'New arrivals',value:'New arrivals'},
 story:{id:'cxBrandStory',text:'cxBrandStoryTitle',label:'Brand story',value:'Made for your everyday.'},
 benefits:{id:'cxBenefits',text:'cxBenefitsTitle',label:'Store benefits',value:'Good things, thoughtfully chosen.'},
 newsletter:{id:'cxNewsletter',text:'cxNewsletterTitle',label:'Newsletter',value:'A little inspiration in your inbox.'},
 footer:{id:'cxStoreFooter',text:'cxFooterBrand',label:'Footer',value:'THREADS'}
};
function selectedText(){return state.content==='hero'?state.headline:state.content==='promo'?state.promoText:state.sectionTexts[state.content]??sectionMap[state.content].value}
function renderSections(){
 const selected=sectionMap[state.content]||sectionMap.hero;
 text('cxInspectorTitle',selected.label+' content');
 markButtons('[data-section]','section',state.content);
 markButtons('[data-section-color]','sectionColor',state.sectionColors[state.content]||'');
 markButtons('[data-section-align]','sectionAlign',state.sectionAligns[state.content]||'left');
 $('cxOverview').setAttribute('aria-pressed',String(state.canvasMode==='overview'));
 $('cxDetail').setAttribute('aria-pressed',String(state.canvasMode==='detail'));
 for(const[key,info]of Object.entries(sectionMap)){
  const el=$(info.id),copy=$(info.text);el.classList.toggle('cx-selected-section',key===state.content);copy.classList.toggle('cx-selected-copy',key===state.content&&state.tool==='page');
  if(info.value!==undefined)text(info.text,state.sectionTexts[key]??info.value);
  el.style.backgroundColor=state.sectionColors[key]||'';
  el.style.color=state.sectionColors[key]?'#202923':'';
  if(el===copy)el.style.textAlign=state.sectionAligns[key]||'';else copy.style.textAlign=state.sectionAligns[key]||'';
 }
 queueCanvas();
}
function fitCanvas(){
 canvasFrame=0;const canvas=$('cxCanvas'),sizer=$('cxCanvasSize'),store=$('cxStore');
 if(phone.matches||state.chapter!=='build'){
  canvas.style.removeProperty('width');canvas.style.removeProperty('transform');sizer.style.removeProperty('width');sizer.style.removeProperty('height');canvasKey='';return;
 }
 const width=store.clientWidth-20,height=store.clientHeight-20;if(width<=0||height<=0)return;
 const logical=state.canvasMode==='overview'?800:Math.max(620,Math.min(900,width));
 canvas.style.width=logical+'px';const natural=Math.max(1,canvas.scrollHeight);
 const scale=state.canvasMode==='overview'?Math.min(1,width/logical,Math.max(.3,height/natural)):Math.min(1,width/logical);
 const next=[width,height,natural,state.canvasMode,state.view,state.content].join(':');
 canvas.style.transform=`scale(${scale})`;sizer.style.width=(logical*scale)+'px';sizer.style.height=(natural*scale)+'px';text('cxZoomReadout',Math.round(scale*100)+'%');
 if(next!==canvasKey||pendingSectionFocus){
  if(state.canvasMode==='overview'||state.view!=='home')store.scrollTop=0;
  else if(pendingSectionFocus||state.content!==canvasKey.split(':').at(-1)){
   const el=$(sectionMap[state.content].id);let offset=0,node=el;
   while(node&&node!==canvas){offset+=node.offsetTop;node=node.offsetParent}
   store.scrollTop=Math.max(0,offset*scale-14);
  }
 }
 canvasKey=next;pendingSectionFocus=false;
}
function queueCanvas(focus=false){pendingSectionFocus=pendingSectionFocus||focus;if(!canvasFrame)canvasFrame=requestAnimationFrame(fitCanvas)}
function selectSection(key){if(!sectionMap[key])return;action({content:key,tool:'page',view:'home'},'Editing '+sectionMap[key].label.toLowerCase()+'. The same section is selected on your storefront.');$('cxTitleInput').value=selectedText();queueCanvas(true)}
const beats = [
 {label:'Your storefront, your starting point.',copy:'Start with a template. Then make it feel like your business.',ms:3300,prep:{chapter:'build',tool:'page',preview:false,view:'home'},target:'cxTitleInput'},
 {label:'01 / PAGE · YOUR WORDS',copy:'Change the headline. Your storefront responds as you type.',ms:5700,target:'cxTitleInput',patch:{headline:'Your everyday. Your own way.'},type:'headline'},
 {label:'01 / PAGE · YOUR MESSAGE',copy:'Add a little personality. The supporting copy changes with it.',ms:4300,target:'cxBodyInput',patch:{body:'Made for the way you move.'},type:'body'},
 {label:'01 / PAGE · THE RESULT',copy:'Your words are already in place. This is the store your customers will see.',ms:3700,prep:{preview:true},target:'cxHeroText'},
 {label:'02 / SECTIONS · CHOOSE A COMPOSITION',copy:'Open Sections. The content stays; the layout is yours to choose.',ms:3000,prep:{preview:false,tool:'sections'},target:'cxHeroCentered'},
 {label:'02 / SECTIONS · CENTER THE STORY',copy:'One selection brings the headline, button and product into a centered layout.',ms:4200,target:'cxHeroCentered',patch:{layout:'centered'},result:'cxHero'},
 {label:'02 / SECTIONS · SEE THE DIFFERENCE',copy:'The same content, with a new composition. No rebuilding the page.',ms:3500,prep:{preview:true},target:'cxHero'},
 {label:'02 / SECTIONS · ANOTHER DIRECTION',copy:'Prefer an editorial layout? Move the product alongside your message.',ms:4300,prep:{preview:false,tool:'sections'},target:'cxHeroEditorial',patch:{layout:'editorial'},result:'cxHero'},
 {label:'02 / SECTIONS · YOUR PROMOTION',copy:'Turn a collection feature into a clear statement banner.',ms:4300,target:'cxPromoBanner',patch:{promo:'banner',layout:'centered'},result:'cxPromo'},
 {label:'02 / SECTIONS · PROMOTION, UPDATED',copy:'The promotion changes shape while keeping your collection message.',ms:3500,prep:{preview:true},target:'cxPromo'},
 {label:'03 / STYLE · ONE COORDINATED PALETTE',copy:'Choose Sage. Buttons, backgrounds and accents change together.',ms:4500,prep:{preview:false,tool:'style'},target:'cxThemeSage',patch:{palette:'sage'},result:'cxStore'},
 {label:'03 / STYLE · THE WHOLE STORE',copy:'A consistent visual identity, from the hero to the collection banner.',ms:3800,prep:{preview:true},target:'cxHero'},
 {label:'03 / STYLE · EXPLORE ANOTHER MOOD',copy:'Try Clay for a warmer direction. Your content and layouts stay intact.',ms:4200,prep:{preview:false,tool:'style'},target:'cxThemeClay',patch:{palette:'clay'},result:'cxStore'},
 {label:'03 / STYLE · MAKE IT YOURS',copy:'Same store. Different character. Every color belongs to the same palette.',ms:3400,prep:{preview:true},target:'cxPromo'},
 {label:'04 / READY TO SHARE',copy:'Return to Sage, then publish the finished storefront.',ms:4300,prep:{preview:false,tool:'style'},target:'cxPublish',patch:{palette:'sage',published:true,saved:true}},
 {label:'BUILD → SELL · FOLLOW ONE PRODUCT',copy:'Now step into your customer’s shoes. Open the Studio Tee.',ms:4100,prep:{preview:true},target:'cxProductCard',patch:{view:'product'},result:'cxProductPage'},
 {label:'02 / SELL · THE SAME STOREFRONT',copy:'The storefront moves into the buying journey. The product stays with us.',ms:3700,prep:{chapter:'sell',view:'product',preview:false},target:'cxSizeM'},
 {label:'SELL · CHOOSE THE RIGHT FIT',copy:'Your customer selects a size. That choice will travel with the order.',ms:3400,target:'cxSizeM',patch:{size:'M'},result:'cxSizeM'},
 {label:'SELL · ADD TO BAG',copy:'One Studio Tee, Black / M. Ready for checkout.',ms:3200,target:'cxAdd',patch:{bag:1},result:'cxBagCount'},
 {label:'SELL · A CLEAR CHECKOUT',copy:'Product, delivery and total are visible. Add your delivery details and choose how to pay.',ms:3300,target:'cxCart',patch:{view:'checkout'},result:'cxCheckout'},
 {label:'SELL · DETAILS THAT TRAVEL WITH THE ORDER',copy:'Enter your name, phone number and delivery address. The merchant receives the same details.',ms:4300,target:'cxCustomerName',form:true,patch:{customerName:'Ayesha Rahman',customerPhone:'01812 345678',customerAddress:'House 24, Road 3, Dhanmondi, Dhaka'},result:'cxCustomerFields'},
 {label:'SELL · CHOOSE HOW TO PAY',copy:'Choose online payment to see the available card, wallet and bank options.',ms:2800,target:'cxPayOnline',patch:{payment:'online'},result:'cxPaymentProviders'},
 {label:'SELL · A FAMILIAR PAYMENT OPTION',copy:'Select bKash, or choose another provider configured for your store.',ms:2800,target:'cxPayBkash',patch:{provider:'bkash'},result:'cxPayBkash'},
 {label:'SELL · CASH ON DELIVERY, TOO',copy:'Prefer to pay on arrival? Choose cash on delivery. We’ll follow that order next.',ms:2600,target:'cxPayCod',patch:{payment:'cod'},result:'cxPayCod'},
 {label:'SELL · THE ORDER ARRIVES',copy:'Place the order. The same item and customer details reach the merchant.',ms:4500,target:'cxPlace',patch:{order:true,view:'receipt'},result:'cxGuideIdentity'},
 {label:'SELL → MANAGE · NOTHING GETS LOST',copy:'Order #1051 is received. Product and payment details are ready for fulfilment.',ms:3700,target:'cxGuideIdentity'},
 {label:'03 / MANAGE · YOUR NEXT ACTION',copy:'Your dashboard shows what needs attention. The order guide stays beside it.',ms:4200,target:'cxGuideBook',patch:{chapter:'manage',admin:'home'},result:'cxProcess'},
 {label:'MANAGE · OPEN THE ORDER',copy:'Open #1051. The same product, size and amount are already here.',ms:3900,target:'cxProcess',patch:{admin:'orders'},result:'cxAdminOrder'},
 {label:'MANAGE · CHOOSE A COURIER',copy:'Select your connected courier. The order details are ready to hand over.',ms:4200,prep:{courierOpen:true},target:'cxCourierPathao',patch:{courier:'pathao',courierOpen:false},result:'cxBook'},
 {label:'MANAGE · BOOK THE DELIVERY',copy:'Book the courier. The next step is pickup—not delivery yet.',ms:4200,target:'cxBook',patch:{shipment:1},result:'cxShipment'},
 {label:'LATER · PICKED UP',copy:'The courier collects the parcel. The order now shows its journey outward.',ms:3500,patch:{shipment:2},result:'cxPipeline'},
 {label:'LATER · IN TRANSIT',copy:'The parcel is on its way. The same order remains easy to follow.',ms:3400,patch:{shipment:3},result:'cxPipeline'},
 {label:'LATER · OUT FOR DELIVERY',copy:'The parcel reaches the final delivery stage.',ms:3300,patch:{shipment:4},result:'cxPipeline'},
 {label:'LATER · DELIVERED',copy:'Delivered. Cash is collected on delivery; settlement is a separate step.',ms:4500,patch:{shipment:5},result:'cxPipeline'},
 {label:'LATER · CONFIRMED SETTLEMENT',copy:'After the courier fee, ৳1,490 is recorded as remitted. This is not profit.',ms:5300,patch:{settled:true},result:'cxGuideCredit'},
 {label:'YOUR STORE. YOUR BUSINESS. CONNECTED.',copy:'From your first edit to a fulfilled order. Now try a step yourself.',ms:4200,result:'cxGuideCredit'}
];
const journey=[['Order received','Details safely captured'],['Details attached','Product, size and COD recorded'],['Ready to book','Prepare the parcel for a courier']];
const delivery=[['Booked','Courier request created'],['Picked up','Courier collected the parcel'],['In transit','On the way to your customer'],['Out for delivery','With the delivery partner'],['Delivered','COD collected · settlement later']];
const money=n=>'৳'+n.toLocaleString('en-US');
const show=(id,on)=>$(id).hidden=!on;
const text=(id,value)=>{if($(id).textContent!==String(value))$(id).textContent=String(value)};
function animate(el,frames,options={}){if(!el||motion.matches||!el.animate)return;const a=el.animate(frames,{duration:620,easing:EASE,...options});animations.add(a);a.onfinish=()=>animations.delete(a);return a}
function clearMotion(){animations.forEach(a=>a.cancel());animations.clear();highlighted?.classList.remove('cx-focus');highlighted=null;$('cxPointer').style.opacity='0'}
function markButtons(selector,key,value){all(selector).filter(b=>b.tagName==='BUTTON').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[key]===value)))}
function setValue(id,val){if(document.activeElement!==$(id))$(id).value=val}
function pipeline(){
 const shipping=state.chapter==='manage'&&state.shipment>0;
 const items=(shipping?delivery:journey).map(row=>[...row]);
 if(state.payment==='online'){if(shipping)items[4][1]='Delivered · Already paid online';else items[1][1]='Product, size and online payment recorded'}
 const stage=shipping?state.shipment-1:state.order?2:-1;
 const list=$('cxPipeline');
 if(list.dataset.kind!==(shipping?'delivery':'order')){list.replaceChildren(...items.map(([title,desc])=>{const li=document.createElement('li'),dot=document.createElement('i'),b=document.createElement('b'),small=document.createElement('small');dot.setAttribute('aria-hidden','true');b.textContent=title;small.textContent=desc;li.append(dot,b,small);return li}));list.dataset.kind=shipping?'delivery':'order'}
 [...list.children].forEach((li,i)=>{li.querySelector('small').textContent=items[i][1];const done=i<stage||(shipping&&state.shipment===5);li.classList.toggle('is-done',done);li.classList.toggle('is-current',i===stage);li.firstChild.textContent=done?'✓':String(i+1);if(i===stage)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
}
const paymentNames={stripe:'Stripe',paypal:'PayPal',bkash:'bKash',nagad:'Nagad',citybank:'City Bank'};
const courierNames={fedex:'FedEx',dhl:'DHL',pathao:'Pathao',steadfast:'Steadfast'};
function renderCommerce(){
 ['Name','Phone','Address'].forEach(key=>setValue('cxCustomer'+key,state['customer'+key]));
 markButtons('[data-payment]','payment',state.payment);markButtons('[data-provider]','provider',state.provider);
 show('cxPaymentProviders',state.payment==='online');
 text('cxPlace',state.payment==='online'?'Pay '+money(1550)+' & place order':'Place order');
 text('cxReceiptPayment',state.payment==='online'?'Paid online · '+(paymentNames[state.provider]||'Choose a provider'):'Cash on delivery · pending collection');
 text('cxGuidePayment',money(1550)+' · '+(state.payment==='online'?'Online · '+(paymentNames[state.provider]||'Choose a provider'):'COD'));
 text('cxOrderCustomerName',state.customerName);text('cxOrderCustomerPhone',state.customerPhone);text('cxOrderCustomerAddress',state.customerAddress);
 text('cxCollectAmount',state.payment==='online'?money(0)+' · Already paid':money(1550));
 $('cxCourierToggle').setAttribute('aria-expanded',String(state.courierOpen));show('cxCourierOptions',state.courierOpen);
 all('[data-courier-option]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.courierOption===state.courier)));
 const selected=$('cxCourierSelected');if(selected.dataset.value!==state.courier){selected.replaceChildren();const option=player.querySelector('[data-courier-option="'+state.courier+'"]');if(option){selected.append(option.querySelector('.cx-provider-logo').cloneNode(true),document.createTextNode(courierNames[state.courier]))}else selected.textContent='Choose a courier';selected.dataset.value=state.courier}
 if(state.payment==='online'&&state.order){
  text('cxOrderBadge',state.shipment===5?'Delivered · Paid':'Paid · '+paymentNames[state.provider]);
  text('cxGuideNote',state.shipment===5?'Delivered. The online payment was already recorded at checkout.':'Paid with '+paymentNames[state.provider]+'. No cash to collect on delivery.');
  text('cxShipmentCopy',state.shipment===5?'Your customer has received the parcel. Payment was recorded at checkout.':$('cxShipmentCopy').textContent);
  const credit=$('cxGuideCredit');show('cxGuideCredit',true);credit.querySelector('small').textContent='AT CHECKOUT · ONLINE PAYMENT';credit.querySelector('b').textContent='Payment recorded';credit.querySelector('strong').textContent=money(1550);credit.querySelector('small:last-child').textContent='Paid with '+paymentNames[state.provider]+' · No COD collection';
  show('cxAdvanceShipment',state.shipment>0&&state.shipment<5);show('cxSettlement',false);
 }else{
  const credit=$('cxGuideCredit');credit.querySelector('small').textContent='LATER · CONFIRMED SETTLEMENT';credit.querySelector('b').textContent='Remittance recorded';credit.querySelector('strong').textContent='+'+money(1490);credit.querySelector('small:last-child').textContent='৳1,550 collected − ৳60 courier fee';
 }
}
function checkoutValid(){
 const checks=[['cxCustomerName',state.customerName.trim().length>=2,'Enter your full name.'],['cxCustomerPhone',state.customerPhone.replace(/\D/g,'').length>=10&&state.customerPhone.replace(/\D/g,'').length<=15,'Enter a valid phone number.'],['cxCustomerAddress',state.customerAddress.trim().length>=8,'Enter your full delivery address.']];
 checks.forEach(([id,valid])=>$(id).setAttribute('aria-invalid',String(!valid)));
 const failed=checks.find(x=>!x[1]);if(failed){text('cxCheckoutError',failed[2]);show('cxCheckoutError',true);$(failed[0]).focus();return false}
 if(state.payment==='online'&&!paymentNames[state.provider]){text('cxCheckoutError','Choose an online payment provider.');show('cxCheckoutError',true);$('cxPayStripe').focus();return false}
 show('cxCheckoutError',false);return true;
}
function render(){
 player.dataset.chapter=state.chapter;player.dataset.tool=state.tool;player.dataset.view=state.view;player.dataset.preview=String(state.preview);player.dataset.outcome=String(state.shipment>=5);player.dataset.playing=String(playing);player.dataset.mode=mode;
 all('[data-chapter]').filter(b=>b.tagName==='BUTTON').forEach(b=>{if(b.dataset.chapter===state.chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
 markButtons('[data-tool]','tool',state.tool);markButtons('[data-layout]','layout',state.layout);markButtons('[data-promo]','promo',state.promo);markButtons('[data-palette]','palette',state.palette);markButtons('[data-size]','size',state.size);
 all('[data-panel]').forEach(el=>el.hidden=el.dataset.panel!==state.tool);
 const store=$('cxStore');store.dataset.layout=state.layout;store.dataset.promo=state.promo;store.dataset.palette=state.palette;
 text('cxHeroText',state.headline);text('cxHeroBody',state.body);text('cxShop',state.button);text('cxPromoText',state.promoText);
 setValue('cxContentSection',state.content);setValue('cxTitleInput',selectedText());setValue('cxBodyInput',state.body);setValue('cxButtonInput',state.button);
 renderSections();
 $('cxBodyInput').closest('label').hidden=state.content!=='hero';$('cxButtonInput').closest('label').hidden=state.content!=='hero';
 text('cxSaveState',state.published?'published':state.saved?'Draft saved':'Draft');text('cxPublish',state.published?'Published ✓':'Publish changes');
 text('cxPreviewLabel',state.published?'Published ':'Draft preview');
 for(const [id,view]of [['cxStoreHome','home'],['cxProductPage','product'],['cxCheckout','checkout'],['cxReceipt','receipt']])show(id,state.view===view);
 text('cxBagCount',state.bag);text('cxAdd',state.bag?'In your bag · View checkout':'Add to bag · ৳1,490');
 ['cxCheckoutSize','cxAdminSize','cxGuideSize'].forEach(id=>text(id,state.size));
 show('cxDashboard',state.chapter==='manage');show('cxGuide',state.chapter!=='build');show('cxGuideIdentity',state.order);show('cxGuideBook',state.order&&state.chapter==='sell');show('cxGuideCredit',state.settled);
 text('cxRole',state.chapter==='sell'?'Customer · Threads':'Merchant · Threads');
 text('cxGuideTime',state.shipment?'ORDER #1051 · LATER UPDATES':state.order?'ORDER #1051 · WHAT HAPPENS NEXT':'WHAT HAPPENS NEXT');
 text('cxGuideTitle',state.settled?'A sale, followed through.':state.shipment===5?'Delivered to your customer.':state.chapter==='manage'?'Keep the order moving.':state.order?'Your order is ready for action.':'A visit becomes an order.');
 text('cxGuideNote',state.settled?'Illustrative timing and fees. Settlement follows delivery.':state.shipment===5?'Cash collected. Remittance is still a separate step.':state.order?'Order #1051 · COD pending collection.':'Product, size and payment details stay connected.');
 pipeline();
 if(state.payment==='online'&&state.order){const rows=$('cxPipeline').children;if(state.shipment===0&&rows[1])rows[1].querySelector('small').textContent='Product, size and online payment recorded';if(state.shipment>0&&rows[4])rows[4].querySelector('small').textContent='Parcel delivered · Already paid'}
 const titles={home:'Home',orders:'Orders',products:'Products',inbox:'Inbox',marketing:'Marketing',reports:'Reports',website:'Website',settings:'Settings',menu:'Workspace menu'};
 text('cxAdminTitle',titles[state.admin]||'Home');
 all('[data-admin]').forEach(b=>{if(b.dataset.admin===state.admin)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 show('cxAdminHome',state.admin==='home');show('cxAdminOrder',state.admin==='orders');show('cxAdminOther',!['home','orders'].includes(state.admin));
 text('cxOtherTitle',titles[state.admin]||'Workspace');
 const descriptions={products:'Your product catalog holds the details used by your storefront and orders. This guided demo follows Studio Tee.',inbox:'Your merchant workspace keeps customer conversations within reach. Return to the order to continue this story.',marketing:'Campaign and promotion tools live here. This demo focuses on the path from storefront to fulfilment.',reports:'Review your business activity here. This demo’s order total is ৳1,550; settled remittance is shown separately.',website:'Manage your storefront here. Choose Build above to try the editor.',settings:'Store, payment and delivery setup live here. Real courier booking requires a configured merchant account.',menu:'Home · Orders · Products · Inbox · Marketing · Reports · Website · Settings. This demo follows order #1051.'};
 text('cxOtherCopy',descriptions[state.admin]||'');
 setValue('cxCourier',state.courier);$('cxBook').disabled=!state.courier||state.shipment>0;
 show('cxCourierPanel',state.shipment===0);show('cxShipment',state.shipment>0);show('cxSettlement',state.settled);
 text('cxOrderBadge',state.settled?'Remitted':state.shipment===5?'Delivered · COD collected':state.shipment?'Delivery in progress':'COD pending');
 const shipmentTitle=['','Courier booked','Parcel picked up','In transit','Out for delivery','Delivered'];
 const shipmentCopy=['','The parcel is ready for the courier.','The courier has collected the parcel.','Your parcel is on the way to the customer.','The delivery partner is completing the last leg.','COD collected. Courier settlement is recorded separately.'];
 text('cxShipmentTitle',shipmentTitle[state.shipment]);text('cxShipmentCopy',shipmentCopy[state.shipment]);
 text('cxAdvanceShipment',state.shipment===5?'Record settlement':'Show next delivery update');show('cxAdvanceShipment',!state.settled);
 text('cxToFulfil',state.shipment===5?0:1);text('cxRemitted',money(state.settled?1490:0));
 $('cxUndo').disabled=!undo.length;$('cxRedo').disabled=!redo.length;
 text('cxPlay',playing?'Pause':step===beats.length-1&&applied?'Replay':mode==='manual'?'Watch story':started?'Resume':'Watch story');
 text('cxTry',mode==='manual'?'Back to story':'Try this step');
 $('cxBack').disabled=step===0;$('cxNext').disabled=step===beats.length-1&&applied;
 renderCommerce();
 const progress=Math.round((step+(applied?1:0))/beats.length*100);$('cxProgress').setAttribute('aria-valuenow',String(progress));$('cxProgress').firstElementChild.style.width=progress+'%';
}
function focusTarget(id){
 if(!id)return;const el=$(id);if(!el||!el.getClientRects().length)return;
 // Scroll only the demo's own panel. Never hijack the page's scrolling.
 for(const pane of [$('cxEditorPanel'),$('cxStore'),$('cxAdminMain'),$('cxGuide')]){
  if(pane.contains(el)&&pane!==el){const a=el.getBoundingClientRect(),b=pane.getBoundingClientRect();if(a.bottom>b.bottom-12||a.top<b.top+10)pane.scrollTop+=a.top-b.top-24;break}
 }
 highlighted?.classList.remove('cx-focus');highlighted=el;el.classList.add('cx-focus');
 if(motion.matches)return;
 const rect=el.getBoundingClientRect(),stage=$('cxStage').getBoundingClientRect();
 const x=Math.max(8,Math.min(stage.width-22,rect.left-stage.left+rect.width*.65));
 const y=Math.max(8,Math.min(stage.height-22,rect.top-stage.top+Math.min(rect.height*.6,32)));
 const pointer=$('cxPointer');pointer.style.opacity='1';
 animate(pointer,[{transform:pointer.style.transform||`translate(${x-55}px,${y+25}px)`},{transform:`translate(${x}px,${y}px)`}],{duration:650});pointer.style.transform=`translate(${x}px,${y}px)`;
}
function clickPulse(){if(motion.matches)return;animate($('cxPointer').lastElementChild,[{opacity:.8,transform:'scale(.25)'},{opacity:0,transform:'scale(1.7)'}],{duration:550});animate($('cxPointer').firstElementChild,[{transform:'scale(1)'},{transform:'scale(.86)',offset:.3},{transform:'scale(1)'}],{duration:300})}
function snapshotRects(){return new Map(['cxWorkspace','cxHeroText','cxHeroBody','cxHeroArt','cxPromo','cxProductPage','cxProductCard'].map(id=>[id,$(id)?.getBoundingClientRect()]))}
function transition(before){
 if(motion.matches)return;
 for(const [id,old]of before){const el=$(id);if(!el||!old||!old.width||!el.getClientRects().length)continue;const next=el.getBoundingClientRect(),dx=old.left-next.left,dy=old.top-next.top;if(Math.abs(dx)+Math.abs(dy)>3)animate(el,[{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:780})}
 if(previousChapter!==state.chapter){animate(state.chapter==='manage'?$('cxDashboard'):$('cxWorkspace'),[{opacity:.4,transform:'translateX(-18px)'},{opacity:1,transform:'translateX(0)'}],{duration:700});if(previousChapter==='build')animate($('cxGuide'),[{opacity:0,transform:'translateX(24px)'},{opacity:1,transform:'translateX(0)'}],{duration:700,delay:150});previousChapter=state.chapter}
}
function beginBeat(){
 clearMotion();applied=false;const b=beats[step],before=snapshotRects();Object.assign(state,b.prep||{});
 if(state.chapter==='build'){state.canvasMode=step===0||state.preview||state.tool==='style'?'overview':'detail';if(step<8)state.content='hero';if(step===8||step===9)state.content='promo';if(step===15)state.canvasMode='detail';pendingSectionFocus=true}
 render();transition(before);
 text('cxNarrationLabel',b.label);text('cxCaption',b.copy);
 if(state.chapter==='build'&&state.preview)$('cxStore').scrollTop=0;
 focusTarget(b.target);last=0;
}
function applyBeat(){
 if(applied)return;const b=beats[step],before=snapshotRects();clickPulse();Object.assign(state,b.patch||{});applied=true;render();transition(before);
 if(b.result){const el=$(b.result);if(el){animate(el,[{opacity:.65},{opacity:1}],{duration:550});if(!b.type)focusTarget(b.result)}}
 if(b.patch?.view==='product'&&!motion.matches){const from=before.get('cxProductCard'),to=player.querySelector('.cx-pdp-art .cx-product-art');if(from?.width&&to?.getClientRects().length){const dest=to.getBoundingClientRect();animate(to,[{transform:`translate(${from.left-dest.left}px,${from.top-dest.top}px) scale(.45)`,opacity:.35},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:850})}}
 if(b.patch?.settled){animate($('cxGuideCredit'),[{transform:'translateY(14px) scale(.97)',opacity:0},{transform:'translateY(-2px) scale(1.015)',opacity:1,offset:.75},{transform:'translateY(0) scale(1)',opacity:1}],{duration:850})}
 if(state.shipment&&state.chapter==='manage'){const active=$('cxPipeline').querySelector('.is-current');animate(active,[{opacity:.2,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:650})}
}
function tick(now){
 if(!playing)return;if(!last)last=now;elapsed+=Math.min(now-last,100)*STORY_SPEED;last=now;
 const b=beats[step];
 if(b.type&&!motion.matches&&elapsed>=800&&elapsed<2200){const full=b.patch[b.type],portion=Math.max(1,Math.round(full.length*Math.min(1,(elapsed-800)/1300)));state[b.type]=full.slice(0,portion);render()}
 if(b.form&&!motion.matches&&elapsed>=700&&elapsed<2700){const fields=['customerName','customerPhone','customerAddress'];fields.forEach((key,i)=>{const fraction=Math.max(0,Math.min(1,(elapsed-700-i*550)/750));state[key]=b.patch[key].slice(0,Math.round(b.patch[key].length*fraction))});render();const fieldId=['cxCustomerName','cxCustomerPhone','cxCustomerAddress'][Math.min(2,Math.floor((elapsed-700)/550))];if(highlighted?.id!==fieldId)focusTarget(fieldId)}
 const actionAt=b.form&&!motion.matches?2700:b.type&&!motion.matches?2200:850;
 if(!applied&&elapsed>=actionAt)applyBeat();
 const buildBeat=state.chapter==='build';
 const buildHold=(b.patch||b.type||b.result)?950:1200;
 const duration=buildBeat?Math.min(b.ms,actionAt+buildHold)+(phone.matches?150:0):b.ms+(phone.matches?450:0);
 if(elapsed>=duration){if(step===beats.length-1){playing=false;clearMotion();render();return}step++;elapsed=0;beginBeat()}
 raf=requestAnimationFrame(tick);
}
function pause(){playing=false;cancelAnimationFrame(raf);last=0;animations.forEach(a=>a.pause());render()}
function play(){
 if(mode==='manual'){manualSnapshot={...state};mode='guided';seek(step,false)}
 if(motion.matches){if(step===beats.length-1&&applied){seek(0);return}next();return}
 if(step===beats.length-1&&applied){state=defaults();step=0;elapsed=0;beginBeat()}
 if(!started){started=true;beginBeat()}
 playing=true;last=0;animations.forEach(a=>a.play());render();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
}
function seek(index,playAfter=false){
 if(mode==='manual')manualSnapshot={...state};
 pause();clearMotion();state=defaults();step=Math.max(0,Math.min(beats.length-1,index));
 for(let i=0;i<step;i++){Object.assign(state,beats[i].prep||{},beats[i].patch||{})}
 mode='guided';elapsed=0;started=true;beginBeat();
 if(motion.matches){applyBeat();text('cxPlay','Next step')}
 if(playAfter&&!motion.matches)play();
}
function next(){if(!applied){applyBeat();pause();text('cxPlay',motion.matches?'Next step':'Resume');return}seek(Math.min(step+1,beats.length-1));if(!motion.matches)applyBeat()}
function align(){focusDismissed=false;settleFrame()}
function manual(){if(mode!=='manual'){pause();clearMotion();mode='manual';text('cxNarrationLabel','YOUR TURN · INTERACTIVE DEMO');text('cxCaption','Try a control. Your changes stay inside this store.');render()}}
function edit(patch,{history=true}={}){manual();if(history){undo.push({...state});if(undo.length>30)undo.shift();redo=[]}Object.assign(state,patch,{saved:false});render()}
function action(patch,caption){manual();Object.assign(state,patch);render();if(caption)text('cxCaption',caption)}
function bind(id,fn){$(id).addEventListener('click',fn)}
all('button').forEach(b=>b.type='button');
all('[data-tool]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>action({tool:b.dataset.tool,preview:false,view:'home'})));
all('[data-layout]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>{const old=snapshotRects();edit({layout:b.dataset.layout});transition(old);if(phone.matches)text('cxCaption','Layout updated. Tap Preview to see your storefront.')}));
all('[data-promo]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>edit({promo:b.dataset.promo})));
all('[data-palette]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>edit({palette:b.dataset.palette})));
all('[data-size]').forEach(b=>b.addEventListener('click',()=>action({size:b.dataset.size})));
$('cxContentSection').addEventListener('change',e=>selectSection(e.target.value));
all('[data-section]').forEach(b=>b.addEventListener('click',()=>selectSection(b.dataset.section)));
$('cxCanvas').addEventListener('click',e=>{if(state.chapter!=='build'||state.view!=='home'||e.target.closest('button,a,input,select,textarea'))return;const el=e.target.closest('[data-canvas-section]');if(el)selectSection(el.dataset.canvasSection)});
all('[data-section-color]').forEach(b=>b.addEventListener('click',()=>edit({sectionColors:{...state.sectionColors,[state.content]:b.dataset.sectionColor}})));
all('[data-section-align]').forEach(b=>b.addEventListener('click',()=>edit({sectionAligns:{...state.sectionAligns,[state.content]:b.dataset.sectionAlign}})));
bind('cxResetSectionColor',()=>{const next={...state.sectionColors};delete next[state.content];edit({sectionColors:next})});
bind('cxOverview',()=>{action({canvasMode:'overview'},'Overview fits more of your storefront into the canvas. Your controls stay full size.');queueCanvas()});
bind('cxDetail',()=>{action({canvasMode:'detail'},'Detail brings your selected section closer. Scroll inside the canvas to explore.');queueCanvas(true)});
bind('cxNewShop',()=>action({view:'product'},'Studio Tee opens with its product details and size options.'));
bind('cxSubscribe',()=>{manual();text('cxCaption','This is a newsletter section. Edit its heading in the properties panel; no subscription is submitted.')});
for(const[id,key]of [['cxTitleInput','headline'],['cxBodyInput','body'],['cxButtonInput','button']]){
 $(id).addEventListener('focus',()=>{manual();undo.push({...state});redo=[];render()});
 $(id).addEventListener('input',e=>{const value=e.target.value;if(key==='headline'&&!['hero','promo'].includes(state.content))edit({sectionTexts:{...state.sectionTexts,[state.content]:value}},{history:false});else edit({[key==='headline'&&state.content==='promo'?'promoText':key]:value},{history:false})});
}
bind('cxUndo',()=>{if(!undo.length)return;manual();redo.push({...state});state=undo.pop();render()});bind('cxRedo',()=>{if(!redo.length)return;manual();undo.push({...state});state=redo.pop();render()});
bind('cxSave',()=>action({saved:true},'Draft saved in this session. Publish is a separate action.'));
bind('cxPublish',()=>action({published:true,saved:true},'Storefront published. No live website was changed.'));
bind('cxMobilePreview',()=>action({preview:true,view:'home'}));bind('cxBackEditor',()=>action({preview:false,view:'home'}));
bind('cxShop',()=>{manual();focusTarget('cxProductCard')});bind('cxPromoShop',()=>{manual();focusTarget('cxProductCard')});
bind('cxProductCard',()=>action({view:'product'},'Studio Tee opens with its product details and size options.'));
bind('cxToteCard',()=>{manual();text('cxCaption','This guided tour follows Studio Tee. Select it to continue the order journey.');focusTarget('cxProductCard')});
bind('cxStoreBack',()=>action({view:'home'}));bind('cxBackProduct',()=>action({view:'product'}));
bind('cxAdd',()=>action({bag:1,chapter:'sell',view:'checkout',preview:false},'Studio Tee added. Review the total before placing an order.'));
bind('cxCart',()=>{if(!state.bag){manual();text('cxCaption','Your bag is empty. Open Studio Tee and add it to continue.');return}action({chapter:'sell',view:'checkout',preview:false})});
bind('cxPlace',()=>{manual();if(!checkoutValid())return;action({order:true,bag:1,view:'receipt',chapter:'sell',paid:state.payment==='online'},state.payment==='online'?'Order #1051 received with its online payment recorded.':'Order #1051 received. Cash on delivery remains pending until collection.');animate(player.querySelector('.cx-success'),[{transform:'scale(.8)'},{transform:'scale(1)'}])});
const manage=()=>action({chapter:'manage',order:true,admin:'home',preview:false},'The same order is now ready in your merchant workspace.');
bind('cxToManage',manage);bind('cxGuideBook',manage);bind('cxProcess',()=>action({admin:'orders'}));bind('cxAdminEdit',()=>action({chapter:'build',tool:'page',view:'home',preview:false}));bind('cxBackOrder',()=>action({admin:'orders'}));
all('[data-admin]').forEach(b=>b.addEventListener('click',()=>action({admin:b.dataset.admin})));
$('cxCourier').addEventListener('change',e=>{if(courierNames[e.target.value])action({courier:e.target.value,courierOpen:false})});
bind('cxCourierToggle',()=>action({courierOpen:!state.courierOpen}));
all('[data-courier-option]').forEach(b=>{b.addEventListener('click',()=>{action({courier:b.dataset.courierOption,courierOpen:false});$('cxCourierToggle').focus()});b.addEventListener('keydown',e=>{const options=all('[data-courier-option]'),index=options.indexOf(b);let next;if(e.key==='ArrowDown')next=(index+1)%options.length;else if(e.key==='ArrowUp')next=(index+options.length-1)%options.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=options.length-1;else if(e.key==='Escape'){e.preventDefault();action({courierOpen:false});$('cxCourierToggle').focus();return}else return;e.preventDefault();options[next].focus()})});
$('cxCourierToggle').addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();action({courierOpen:true});all('[data-courier-option]')[e.key==='ArrowDown'?0:3].focus()}});
document.addEventListener('click',e=>{if(state.courierOpen&&!e.target.closest('.cx-courier-picker')&&mode==='manual')action({courierOpen:false})});
all('[data-payment]').forEach(b=>b.addEventListener('click',()=>action({payment:b.dataset.payment})));
all('[data-provider]').forEach(b=>b.addEventListener('click',()=>action({provider:b.dataset.provider})));
['Name','Phone','Address'].forEach(key=>$('cxCustomer'+key).addEventListener('input',e=>{action({['customer'+key]:e.target.value});e.target.removeAttribute('aria-invalid');show('cxCheckoutError',false)}));
bind('cxBook',()=>{if(!state.courier||state.shipment)return;action({shipment:1},'Courier booked. No request was sent to a provider.')});
bind('cxAdvanceShipment',()=>{if(!state.shipment)return;if(state.shipment<5)action({shipment:state.shipment+1},'Illustrative courier update. Delivery happens over time.');else if(state.payment==='cod')action({settled:true},'Later: ৳1,490 remittance recorded after a ৳60 courier fee.')});
all('.cx-chapters button').forEach(b=>b.addEventListener('click',()=>{seek({build:0,sell:16,manage:beats.findIndex(x=>x.label==='MANAGE · OPEN THE ORDER')}[b.dataset.chapter]);align()}));
bind('cxPlay',()=>playing?pause():play());bind('cxBack',()=>seek(step-1));bind('cxNext',next);
bind('cxTry',()=>{if(mode==='manual'){manualSnapshot={...state};seek(step);play()}else{manual();if(manualSnapshot){state={...manualSnapshot};render()}}});
bind('cxWatch',()=>{seek(0);align();if(!motion.matches)play()});bind('cxExplore',()=>{pause();clearMotion();if(manualSnapshot)state={...manualSnapshot};Object.assign(state,{chapter:'build',tool:'page',view:'home',preview:false});manual();render();align()});
player.addEventListener('pointerdown',e=>{if(playing&&!e.target.closest('.cx-controls,.cx-chapters'))pause()});
player.addEventListener('keydown',e=>{if(playing&&e.key==='Tab')pause();if(e.key==='Escape')pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
if('IntersectionObserver'in window){new IntersectionObserver(entries=>{const e=entries[0];inView=e.intersectionRatio>.85;if((!e.isIntersecting||e.intersectionRatio<.4)&&playing)pause();if(inView&&!started&&mode==='guided'&&!motion.matches&&!document.hidden)play()},{threshold:[0,.4,.85,1]}).observe(player)}
motion.addEventListener?.('change',()=>{pause();clearMotion();if(motion.matches){applyBeat();text('cxPlay','Next step')}});
phone.addEventListener?.('change',()=>{pause();clearMotion();render()});
let layoutWidth=window.innerWidth;
window.addEventListener('resize',()=>{if(Math.abs(window.innerWidth-layoutWidth)<4)return;layoutWidth=window.innerWidth;if(playing)pause();clearMotion()},{passive:true});
// Settle once after scroll intent ends; never cancel native scrolling.
const siteNav=document.querySelector('.site-nav'),mobileNav=$('mobileNav');
let focused=false,focusDismissed=false,focusFrame=0,settleTimer=0,snapFrame=0,snapping=false,touchY=null;
function viewportHeight(){return window.innerHeight}
function setFocus(value){
 focused=value;document.body.classList.toggle('cx-demo-focused',value);
 if(siteNav){siteNav.inert=value;if(value)siteNav.setAttribute('aria-hidden','true');else siteNav.removeAttribute('aria-hidden')}
 show('cxExitFocus',value);
 if(value)player.style.setProperty('--cx-focus-height',Math.floor(viewportHeight()-24)+'px');
 else player.style.removeProperty('--cx-focus-height');
 queueCanvas();
}
function canSettle(){return !focusDismissed&&!document.hidden&&viewportHeight()>=480&&!siteNav?.contains(document.activeElement)&&!mobileNav?.classList.contains('open')}
function settleFrame(){
 clearTimeout(settleTimer);if(!canSettle())return;
 const r=player.getBoundingClientRect();if(!r.height)return;
 cancelAnimationFrame(snapFrame);setFocus(true);snapping=true;
 const start=window.scrollY,target=Math.max(0,start+player.getBoundingClientRect().top-12),began=performance.now();
 function move(now){const t=motion.matches?1:Math.min(1,(now-began)/360);window.scrollTo({top:start+(target-start)*(1-Math.pow(1-t,3)),behavior:'auto'});if(t<1)snapFrame=requestAnimationFrame(move);else{snapping=false;snapFrame=0}}
 snapFrame=requestAnimationFrame(move);
}
function updateFocus(){
 focusFrame=0;if(snapping)return;
 const r=player.getBoundingClientRect(),vh=viewportHeight();if(!r.height)return;
 const navHeight=siteNav?.getBoundingClientRect().height||72;
 const outside=r.top>navHeight+100||r.bottom<vh*.42;
 if(outside){focusDismissed=false;clearTimeout(settleTimer);if(focused)setFocus(false);return}
 if(focused){setFocus(true);return}
 clearTimeout(settleTimer);
 if(touchY===null&&r.top>=-120&&r.top<=navHeight+28&&r.bottom>=vh*.6&&canSettle())settleTimer=setTimeout(settleFrame,160);
}
function queueFocusUpdate(){if(!focusFrame)focusFrame=requestAnimationFrame(updateFocus)}
function restoreNavigation({focus=false}={}){
 clearTimeout(settleTimer);cancelAnimationFrame(snapFrame);snapFrame=0;snapping=false;focusDismissed=true;setFocus(false);
 if(focus)siteNav?.querySelector('a,button')?.focus({preventScroll:true});
}
bind('cxExitFocus',()=>restoreNavigation({focus:true}));
window.addEventListener('scroll',()=>{if(!snapping){clearTimeout(settleTimer);queueFocusUpdate()}},{passive:true});
window.addEventListener('resize',queueFocusUpdate,{passive:true});
window.addEventListener('wheel',e=>{if(focused&&(e.deltaY||e.deltaX))restoreNavigation()},{passive:true});
window.addEventListener('touchstart',e=>{touchY=e.touches[0]?.clientY??null;clearTimeout(settleTimer)},{passive:true});
window.addEventListener('touchmove',e=>{if(focused&&touchY!==null&&Math.abs((e.touches[0]?.clientY??touchY)-touchY)>12)restoreNavigation()},{passive:true});
for(const event of ['touchend','touchcancel'])window.addEventListener(event,()=>{touchY=null;queueFocusUpdate()},{passive:true});
document.addEventListener('focusin',()=>{if(siteNav?.contains(document.activeElement))restoreNavigation()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&focused){pause();restoreNavigation();return}
 if(focused&&!e.target.closest?.('input,textarea,select,button,[role="option"]')&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))restoreNavigation();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)restoreNavigation();else queueFocusUpdate()});
queueFocusUpdate();
if('ResizeObserver'in window){const canvasObserver=new ResizeObserver(()=>queueCanvas());canvasObserver.observe($('cxStore'));canvasObserver.observe($('cxCanvas'))}
window.addEventListener('resize',()=>queueCanvas(),{passive:true});
function hash(){const chapter={'#chapter-build':0,'#chapter-sell':16,'#chapter-manage':beats.findIndex(x=>x.label==='MANAGE · OPEN THE ORDER')}[location.hash];if(chapter!==undefined){seek(chapter);align()}}
window.addEventListener('hashchange',hash);
window.__ezcomoV10={getState:()=>({...state,step,playing,mode,applied}),beats:beats.map(({label,ms})=>({label,ms})),play,pause,next,seek,manual};
render();hash();
})();
