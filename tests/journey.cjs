/* DOM integration checks. Run with NODE_PATH pointing to jsdom and @sinonjs/fake-timers. */
const {JSDOM}=require('jsdom');
const FakeTimers=require('@sinonjs/fake-timers');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const html=readFileSync('index.html','utf8').replace(/<script[^>]*src[^>]*><\/script>/g,'');
function setup({reduced=false,hash=''}={}){
 const errors=[];
 const dom=new JSDOM(html,{url:'https://example.com/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.matchMedia=q=>({matches:q.includes('prefers-reduced-motion')?reduced:false,addEventListener(){},removeEventListener(){}});
 w.IntersectionObserver=class{observe(){} unobserve(){} disconnect(){}};
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.confirm=()=>true;
 w.addEventListener('error',e=>errors.push(e.error));
 const clock=FakeTimers.withGlobal(w).install({toFake:['setTimeout','clearTimeout','requestAnimationFrame','cancelAnimationFrame','Date','performance']});
 w.eval(readFileSync('app.js','utf8'));
 assert.ok(w.__ezcomoV6,'journey initialized');assert.deepEqual(errors,[]);
 return{w,clock,api:w.__ezcomoV6,errors,close(){clock.uninstall();w.close()}};
}
function click(t,id){const b=t.w.document.getElementById(id);assert.ok(b,id);b.click()}
{
 const t=setup();const before=t.w.document.querySelector('#heroBlock .editable-title').textContent;
 click(t,'journeyWatch');t.clock.tick(8100);
 assert.notEqual(t.w.document.querySelector('#heroBlock .editable-title').textContent,before,'guided edit visibly changes the storefront');
 click(t,'journeyPause');const paused=JSON.stringify(t.api.getState().demo);t.clock.tick(60000);assert.equal(JSON.stringify(t.api.getState().demo),paused,'pause stops commerce progression');
 click(t,'journeyPause');t.clock.tick(60000);
 let s=t.api.getState();assert.equal(s.journey.playback,'complete');assert.equal(s.demo.order.id,'1051');assert.equal(s.demo.delivery.state,'picked-up');assert.equal(s.demo.inventory.available,17);
 click(t,'journeyReplay');t.clock.tick(60000);s=t.api.getState();assert.equal(s.demo.inventory.available,17,'replay does not double-decrement');
 assert.deepEqual(t.errors,[]);t.close();console.log('PASS guided edit, pause/resume, complete journey, replay inventory');
}
{
 const t=setup();const input=t.w.document.getElementById('editorTextInput');input.value='My own storefront';input.dispatchEvent(new t.w.Event('input',{bubbles:true}));
 click(t,'journeyWatch');t.clock.tick(9000);assert.equal(t.w.document.querySelector('#heroBlock .editable-title').textContent,'My own storefront','tour preserves a merchant edit');
 t.w.document.querySelector('[data-journey-chapter="manage"]').click();t.clock.tick(60000);assert.equal(t.api.getState().journey.chapter,'manage');assert.equal(t.api.getState().journey.mode,'manual');assert.equal(t.api.getState().demo.delivery.state,'not-booked','chapter navigation cancels old callbacks');
 click(t,'prepareDelivery');click(t,'bookSampleDelivery');t.clock.tick(800);click(t,'journeyPause');t.clock.tick(9000);assert.equal(t.api.getState().demo.delivery.state,'not-booked');click(t,'journeyPause');t.clock.tick(9000);assert.equal(t.api.getState().demo.delivery.state,'awaiting-pickup');
 click(t,'simulatePickupUpdate');t.clock.tick(15000);assert.equal(t.api.getState().demo.delivery.state,'picked-up');assert.equal(t.api.getState().demo.inventory.available,17);
 click(t,'journeyReset');t.clock.tick(500);assert.equal(t.api.getState().demo.order.id,null);t.clock.tick(60000);assert.equal(t.api.getState().demo.order.id,null,'reset cancels pending actions');
 assert.deepEqual(t.errors,[]);t.close();console.log('PASS merchant edits, manual chapters, delivery pause/resume, reset');
}
{
 const t=setup({reduced:true});click(t,'journeyWatch');t.clock.tick(60000);assert.equal(t.api.getState().demo.order.id,null,'reduced motion is user paced');
 assert.equal(t.w.document.getElementById('journeyNext').hidden,false);
 for(let i=0;i<5;i++)click(t,'journeyNext');assert.equal(t.api.getState().journey.playback,'complete');assert.equal(t.api.getState().demo.delivery.state,'picked-up');
 assert.deepEqual(t.errors,[]);t.close();console.log('PASS user-paced reduced motion');
}
{
 const t=setup({hash:'#chapter-manage'});assert.equal(t.api.getState().demo.order.id,'1051');assert.match(t.w.document.getElementById('journeyNarrationText').textContent,/Sample order loaded/);
 click(t,'langToggle');t.clock.tick(10);assert.equal(t.api.getState().demo.order.id,'1051');assert.equal(t.w.document.documentElement.lang,'bn');assert.deepEqual(t.errors,[]);t.close();console.log('PASS deep link and language persistence');
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'no duplicate HTML ids');
console.log('PASS unique IDs');
