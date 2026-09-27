const {JSDOM}=require('jsdom'),FakeTimers=require('@sinonjs/fake-timers'),fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8').replace(/<script[^>]*src[^>]*><\/script>/g,'');
function setup({reduced=false,phone=false,hash=''}={}){
 const errors=[],observers=[],media=[];
 const dom=new JSDOM(html,{url:'https://example.test/v10/'+hash,runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
 w.matchMedia=q=>{const v={matches:q.includes('reduced')?reduced:q.includes('700')?phone:false,addEventListener:(n,fn)=>v.handler=fn};media.push(v);return v};
 w.IntersectionObserver=class{constructor(fn){this.fn=fn;this.nodes=[];observers.push(this)}observe(n){this.nodes.push(n)}unobserve(){}disconnect(){}};
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.addEventListener('error',e=>errors.push(e.error));
 const clock=FakeTimers.withGlobal(w).install({toFake:['setTimeout','clearTimeout','setInterval','clearInterval','Date','performance','requestAnimationFrame','cancelAnimationFrame']});
 w.eval(fs.readFileSync('app.js','utf8'));w.eval(fs.readFileSync('v10.js','utf8'));
 assert.ok(w.__ezcomoV10,'controller loaded');
 return {w,clock,api:w.__ezcomoV10,observers,errors,close(){assert.deepEqual(errors,[]);clock.uninstall();dom.window.close()}};
}
function click(t,id){const el=t.w.document.getElementById(id);assert.ok(el,id);el.click()}
function chapter(t,name){t.w.document.querySelector('.cx-chapters [data-chapter="'+name+'"]').click()}
function change(t,id,value,type='change'){const el=t.w.document.getElementById(id);el.value=value;el.dispatchEvent(new t.w.Event(type,{bubbles:true}))}
function customer(t){change(t,'cxCustomerName','Ayesha Rahman','input');change(t,'cxCustomerPhone','01812 345678','input');change(t,'cxCustomerAddress','House 24, Road 3, Dhanmondi, Dhaka','input')}

{
 const t=setup();click(t,'cxWatch');t.clock.tick(9000);const before=t.api.getState();assert.notEqual(before.headline,'Everyday essentials.');click(t,'cxPlay');const s=JSON.stringify(t.api.getState());t.clock.tick(30000);assert.equal(JSON.stringify(t.api.getState()),s,'pause freezes single clock');click(t,'cxPlay');t.clock.tick(180000);const end=t.api.getState();assert.equal(end.playing,false);assert.equal(end.shipment,5);assert.equal(end.settled,true);assert.equal(end.size,'M');assert.equal(end.order,true);assert.equal(end.palette,'sage');assert.equal(end.promo,'banner');assert.equal(end.layout,'centered');assert.match(t.w.document.getElementById('cxGuideCredit').textContent,/1,490/);click(t,'cxPlay');t.clock.tick(180000);assert.equal(t.api.getState().settled,true);t.close();console.log('PASS full story, pause/resume, replay, connected order and separate settlement');
}
{
 const t=setup();click(t,'cxExplore');const input=t.w.document.getElementById('cxTitleInput');input.focus();change(t,'cxTitleInput','My own brand','input');assert.equal(t.w.document.getElementById('cxHeroText').textContent,'My own brand');click(t,'cxUndo');assert.equal(t.api.getState().headline,'Everyday essentials.');click(t,'cxRedo');assert.equal(t.api.getState().headline,'My own brand');click(t,'cxHeroCentered');assert.equal(t.api.getState().layout,'centered');click(t,'cxThemeClay');assert.equal(t.w.document.getElementById('cxStore').dataset.palette,'clay');click(t,'cxSave');assert.equal(t.api.getState().saved,true);assert.equal(t.api.getState().published,false);click(t,'cxPublish');assert.equal(t.api.getState().published,true);t.close();console.log('PASS live editor, undo/redo, layout, palette, save versus publish');
}
{
 const t=setup();click(t,'cxExplore');click(t,'cxMobilePreview');click(t,'cxProductCard');assert.equal(t.api.getState().view,'product');t.w.document.querySelector('[data-size="L"]').click();click(t,'cxAdd');assert.equal(t.api.getState().chapter,'sell');assert.equal(t.api.getState().view,'checkout');customer(t);click(t,'cxPlace');click(t,'cxToManage');click(t,'cxProcess');assert.equal(t.api.getState().size,'L');assert.equal(t.w.document.getElementById('cxBook').disabled,true);change(t,'cxCourier','pathao');click(t,'cxBook');click(t,'cxBook');assert.equal(t.api.getState().shipment,1);for(let i=0;i<4;i++)click(t,'cxAdvanceShipment');assert.equal(t.api.getState().shipment,5);assert.equal(t.api.getState().settled,false);click(t,'cxAdvanceShipment');assert.equal(t.api.getState().settled,true);t.close();console.log('PASS manual purchase, variant continuity, guarded booking and later settlement');
}
{
 const t=setup();click(t,'cxWatch');t.clock.tick(10000);chapter(t,'manage');assert.equal(t.api.getState().chapter,'manage','Manage shortcut opens dashboard immediately');assert.equal(t.api.getState().playing,false);assert.equal(t.api.getState().order,true);const s=JSON.stringify(t.api.getState());t.clock.tick(180000);assert.equal(JSON.stringify(t.api.getState()),s,'chapter choice cancels pending animation');t.close();console.log('PASS chapter handoff and timer cancellation');
}
{
 const t=setup({reduced:true});click(t,'cxWatch');t.clock.tick(180000);assert.equal(t.api.getState().playing,false);assert.equal(t.api.getState().order,false);for(let i=0;i<65;i++)click(t,'cxNext');assert.equal(t.api.getState().settled,true);click(t,'cxPlay');assert.equal(t.api.getState().step,0,'reduced motion replay');t.close();console.log('PASS reduced motion is fully user paced, with replay');
}
{
 const t=setup({phone:true});click(t,'cxWatch');t.clock.tick(180000);assert.equal(t.api.getState().settled,true);assert.equal(t.api.getState().playing,false);t.close();console.log('PASS mobile timeline completes');
}
{
 const t=setup();click(t,'cxWatch');t.clock.tick(14000);const o=t.observers.find(o=>o.nodes.some(n=>n.id==='cxPlayer'));o.fn([{isIntersecting:false,intersectionRatio:0}]);const s=JSON.stringify(t.api.getState());t.clock.tick(60000);assert.equal(JSON.stringify(t.api.getState()),s);o.fn([{isIntersecting:true,intersectionRatio:1}]);assert.equal(t.api.getState().playing,false);t.close();console.log('PASS offscreen pause without unsolicited restart');
}
{
 const t=setup({hash:'#chapter-manage'});assert.equal(t.api.getState().chapter,'manage');assert.equal(t.api.getState().order,true);click(t,'langToggle');assert.equal(t.w.document.documentElement.lang,'bn');click(t,'themeToggle');t.close();console.log('PASS deep links and page controls');
}
{
 const t=setup();const ids=[...t.w.document.querySelectorAll('[id]')].map(e=>e.id);assert.equal(ids.length,new Set(ids).size);for(const el of t.w.document.querySelectorAll('[src],[href]')){const p=el.getAttribute('src')||el.getAttribute('href');if(p.startsWith('./')||p.startsWith('../'))assert.ok(fs.existsSync(p.split('?')[0]),'local asset '+p)}t.close();console.log('PASS IDs and local asset references');
}

{
 const t=setup({phone:true});click(t,'cxWatch');t.clock.tick(3000);t.w.innerHeight-=70;t.w.dispatchEvent(new t.w.Event('resize'));assert.equal(t.api.getState().playing,true,'mobile browser chrome height changes must not interrupt film');t.w.innerWidth+=100;t.w.dispatchEvent(new t.w.Event('resize'));assert.equal(t.api.getState().playing,false,'layout width change pauses safely');t.close();console.log('PASS mobile browser chrome resize versus layout change');
}

{
 const t=setup(),d=t.w.document,box=d.getElementById('cxPlayer'),nav=d.querySelector('.site-nav');t.w.innerHeight=900;
 let top=82,scrollCalls=0;box.getBoundingClientRect=()=>({top,bottom:top+740,height:740,width:1100});nav.getBoundingClientRect=()=>({height:72});
 t.w.scrollTo=({top:y})=>{top-=y-t.w.scrollY;t.w.scrollY=y;scrollCalls++};
 t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(100);assert.equal(nav.inert,undefined,'wait for scroll to settle');t.clock.tick(500);
 assert.equal(nav.inert,true);assert.equal(nav.getAttribute('aria-hidden'),'true');assert.ok(Math.abs(top-12)<.01);assert.equal(box.style.getPropertyValue('--cx-focus-height'),'876px');assert.ok(scrollCalls>1);
 const wheel=new t.w.WheelEvent('wheel',{deltaY:20,cancelable:true});t.w.dispatchEvent(wheel);assert.equal(wheel.defaultPrevented,false);assert.equal(nav.inert,false);assert.equal(nav.hasAttribute('aria-hidden'),false);t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(700);assert.equal(nav.inert,false,'next scroll releases and does not re-snap');
 top=300;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(32);top=12;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(700);assert.equal(nav.inert,true);
 d.dispatchEvent(new t.w.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(nav.inert,false);t.clock.tick(700);assert.equal(nav.inert,false);
 top=300;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(32);top=12;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(700);assert.equal(nav.inert,true);click(t,'cxExitFocus');assert.equal(nav.inert,false);assert.ok(nav.contains(d.activeElement));
 d.activeElement.blur();top=300;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(32);top=12;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(700);assert.equal(nav.inert,true);top=-500;t.w.dispatchEvent(new t.w.Event('scroll'));t.clock.tick(32);assert.equal(nav.inert,false);assert.equal(box.style.getPropertyValue('--cx-focus-height'),'');t.close();console.log('PASS idle magnet fits frame; next wheel releases without scroll cancellation; Escape, exit and leaving restore navigation');
}

{
 const t=setup();click(t,'cxWatch');t.clock.tick(115000);assert.equal(t.api.getState().settled,true);assert.equal(t.api.getState().playing,false);t.close();console.log('PASS faster desktop story completes within 115 seconds');
}

{
 const t=setup();click(t,'cxExplore');const d=t.w.document,body=d.getElementById('cxEditorBody');
 assert.deepEqual([...body.children].map(e=>e.id||e.className),['cx-rail','cxPageTree','cxPreviewPane','cxEditorPanel']);
 assert.equal(d.querySelectorAll('#cxPageTree [data-section]').length,11);
 d.querySelector('#cxPageTree [data-section="newsletter"]').click();assert.equal(t.api.getState().content,'newsletter');assert.equal(d.getElementById('cxInspectorTitle').textContent,'Newsletter content');
 const input=d.getElementById('cxTitleInput');input.focus();change(t,'cxTitleInput','Fresh stories from our studio','input');assert.equal(d.getElementById('cxNewsletterTitle').textContent,'Fresh stories from our studio');assert.equal(d.getElementById('cxHeroText').textContent,'Everyday essentials.');
 d.querySelector('[data-section-color="#dce4d8"]').click();assert.equal(d.getElementById('cxNewsletter').style.backgroundColor,'rgb(220, 228, 216)');
 d.querySelector('[data-section-align="center"]').click();assert.equal(d.getElementById('cxNewsletterTitle').style.textAlign,'center');click(t,'cxResetSectionColor');assert.equal(d.getElementById('cxNewsletter').style.backgroundColor,'');
 d.getElementById('cxBrandStoryTitle').dispatchEvent(new t.w.MouseEvent('click',{bubbles:true}));assert.equal(t.api.getState().content,'story');assert.equal(d.querySelector('#cxPageTree [data-section="story"]').getAttribute('aria-pressed'),'true');
 click(t,'cxOverview');assert.equal(t.api.getState().canvasMode,'overview');click(t,'cxDetail');assert.equal(t.api.getState().canvasMode,'detail');t.close();console.log('PASS reference editor structure, all sections, contextual editing, color and alignment');
}
{
 const t=setup(),d=t.w.document,store=d.getElementById('cxStore'),canvas=d.getElementById('cxCanvas'),sizer=d.getElementById('cxCanvasSize');
 Object.defineProperty(store,'clientWidth',{value:620});Object.defineProperty(store,'clientHeight',{value:520});Object.defineProperty(canvas,'scrollHeight',{value:1200});
 t.clock.tick(32);assert.ok(parseFloat(sizer.style.height)<=500,'overview fits available canvas height');assert.ok(parseFloat(sizer.style.width)<=600,'overview fits available canvas width');assert.equal(d.getElementById('cxZoomReadout').textContent,'42%');
 click(t,'cxDetail');t.clock.tick(32);assert.equal(d.getElementById('cxZoomReadout').textContent,'97%');assert.ok(parseFloat(sizer.style.height)>500,'detail uses readable width and allows vertical scrolling');
 chapter(t,'sell');t.clock.tick(32);assert.equal(canvas.style.transform,'');assert.equal(sizer.style.height,'');t.close();console.log('PASS canvas fit calculations and scaling removed for selling');
}
{
 const t=setup({phone:true});click(t,'cxExplore');change(t,'cxContentSection','categories');change(t,'cxTitleInput','Browse our collections','input');assert.equal(t.w.document.getElementById('cxCategoriesTitle').textContent,'Browse our collections');click(t,'cxMobilePreview');assert.equal(t.api.getState().preview,true);t.clock.tick(32);assert.equal(t.w.document.getElementById('cxCanvas').style.transform,'');t.close();console.log('PASS mobile section editing and unscaled separate preview');
}

{
 const t=setup(),d=t.w.document;chapter(t,'sell');click(t,'cxAdd');click(t,'cxPlace');assert.equal(t.api.getState().order,false);assert.equal(d.getElementById('cxCheckoutError').hidden,false);customer(t);click(t,'cxPayOnline');click(t,'cxPlace');assert.equal(t.api.getState().order,false,'online provider required');
 for(const [id,provider] of [['cxPayStripe','stripe'],['cxPayPaypal','paypal'],['cxPayBkash','bkash'],['cxPayNagad','nagad'],['cxPayCitybank','citybank']]){click(t,id);assert.equal(t.api.getState().provider,provider);assert.equal(d.getElementById(id).getAttribute('aria-pressed'),'true')}
 click(t,'cxPayBkash');click(t,'cxPlace');assert.equal(t.api.getState().paid,true);assert.match(d.getElementById('cxReceiptPayment').textContent,/bKash/);click(t,'cxToManage');click(t,'cxProcess');assert.equal(d.getElementById('cxOrderCustomerName').textContent,'Ayesha Rahman');assert.match(d.getElementById('cxCollectAmount').textContent,/৳0/);
 click(t,'cxCourierToggle');assert.equal(d.getElementById('cxCourierToggle').getAttribute('aria-expanded'),'true');const options=[...d.querySelectorAll('[data-courier-option]')];assert.deepEqual(options.map(x=>x.dataset.courierOption),['fedex','dhl','pathao','steadfast']);options[0].focus();options[0].dispatchEvent(new t.w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert.equal(d.activeElement,options[1]);click(t,'cxCourierPathao');assert.equal(t.api.getState().courier,'pathao');assert.equal(d.getElementById('cxCourierOptions').hidden,true);click(t,'cxBook');for(let i=0;i<5;i++)click(t,'cxAdvanceShipment');assert.equal(t.api.getState().shipment,5);assert.equal(t.api.getState().settled,false,'online order never enters COD remittance');assert.doesNotMatch(d.getElementById('cxPipeline').textContent,/COD collected/);assert.equal(d.getElementById('cxSettlement').hidden,true);assert.match(d.getElementById('cxGuideCredit').textContent,/1,550/);assert.doesNotMatch(d.getElementById('cxGuideCredit').textContent,/1,490/);t.close();console.log('PASS validated customer entry, five online providers, payment continuity, courier keyboard picker and no duplicate COD credit');
}
{
 const t=setup();click(t,'cxWatch');t.clock.tick(180000);assert.equal(t.api.getState().customerName,'Ayesha Rahman');assert.equal(t.api.getState().provider,'bkash');assert.equal(t.api.getState().payment,'cod');assert.equal(t.api.getState().courier,'pathao');assert.doesNotMatch(t.w.document.body.textContent,/\bsample\b/i);t.close();console.log('PASS guided customer entry, online-to-COD choice, Pathao selection and finished tour copy');
}
