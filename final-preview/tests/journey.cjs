/* Deterministic integration checks: local sample state only. */
const {JSDOM}=require('jsdom'),FakeTimers=require('@sinonjs/fake-timers'),{readFileSync}=require('node:fs'),assert=require('node:assert/strict');
const html=readFileSync('index.html','utf8').replace(/<script[^>]*src[^>]*><\/script>/g,'');
function setup({reduced=false,phone=false,hash='',observer=true}={}){
 const errors=[],observers=[];const dom=new JSDOM(html,{url:'https://example.com/'+hash,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;w.innerHeight=900;
 w.matchMedia=q=>({matches:q.includes('prefers-reduced-motion')?reduced:q.includes('max-width:700px')?phone:false,addEventListener(){},removeEventListener(){}});
 if(observer)w.IntersectionObserver=class{constructor(fn){this.fn=fn;this.nodes=[];observers.push(this)}observe(n){this.nodes.push(n)}unobserve(){}disconnect(){}};
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.addEventListener('error',e=>errors.push(e.error));
 const clock=FakeTimers.withGlobal(w).install({toFake:['setTimeout','clearTimeout','requestAnimationFrame','cancelAnimationFrame','Date','performance']});
 w.eval(readFileSync('app.js','utf8'));w.eval(readFileSync('story.js','utf8'));assert.ok(w.__ezcomoStory);assert.deepEqual(errors,[]);
 return{w,clock,api:w.__ezcomoStory,errors,observers,close(){assert.deepEqual(errors,[]);clock.uninstall();w.close()}};
}
function click(t,id){const b=t.w.document.getElementById(id);assert.ok(b,id);b.click()}
function chapter(t,name){t.w.document.querySelector(`[data-story-chapter="${name}"]`).click()}
{
 const t=setup();click(t,'storyWatch');t.clock.tick(9000);assert.notEqual(t.w.document.querySelector('#heroBlock .editable-title').textContent,'Make the everyday unmistakably yours.');
 click(t,'storyPlay');const paused=JSON.stringify(t.api.getState());t.clock.tick(90000);assert.equal(JSON.stringify(t.api.getState()),paused);
 click(t,'storyPlay');t.clock.tick(60000);const s=t.api.getState();assert.equal(s.playback,'complete');assert.equal(s.order.id,'1051');assert.equal(s.order.total,1550);assert.equal(s.delivery,'picked-up');
 t.clock.tick(90000);assert.equal(t.api.getState().playback,'complete');click(t,'storyReplay');t.clock.tick(60000);assert.equal(t.api.getState().order.total,1550);t.close();console.log('PASS guided edit, clock pause/resume, one order, settled finish, replay');
}
{
 const t=setup();click(t,'storyExplore');const title=t.w.document.querySelector('#heroBlock .editable-title');title.textContent='My own store';title.dispatchEvent(new t.w.Event('input',{bubbles:true}));
 click(t,'storyWatch');t.clock.tick(16000);assert.equal(title.textContent,'My own store');chapter(t,'manage');t.clock.tick(60000);assert.equal(t.api.getState().delivery,'not-booked');assert.match(t.w.document.getElementById('storyCaption').textContent,/Sample order/);
 click(t,'storyReview');click(t,'storyBook');click(t,'storyBook');assert.equal(t.api.getState().delivery,'awaiting-pickup');click(t,'storyPickup');assert.equal(t.api.getState().delivery,'picked-up');click(t,'storyWatch');t.clock.tick(60000);assert.equal(title.textContent,'My own store');t.close();console.log('PASS edit preservation, chapter cancellation, idempotent delivery');
}
{
 const t=setup();chapter(t,'sell');click(t,'storyAdd');assert.equal(t.api.getState().cart,false);click(t,'storyColour');click(t,'storySize');click(t,'storyAdd');assert.equal(t.api.getState().cart,true);click(t,'storyPlace');assert.equal(t.api.getState().order.total,1550);click(t,'storyViewOrder');click(t,'commerceOrderRow');click(t,'storyBook');click(t,'storyPickup');assert.equal(t.api.getState().delivery,'picked-up');t.close();console.log('PASS hands-on customer to merchant flow');
}
for(const options of [{reduced:true},{phone:true}]){
 const t=setup(options);click(t,'storyWatch');t.clock.tick(60000);assert.equal(t.api.getState().beat,0);assert.equal(t.api.getState().order,null);for(let i=0;i<11;i++)click(t,'storyNext');assert.equal(t.api.getState().playback,'complete');assert.equal(t.api.getState().delivery,'picked-up');click(t,'storyBack');assert.equal(t.api.getState().beat,10);t.close();console.log('PASS user-paced journey '+JSON.stringify(options));
}
{
 const t=setup();click(t,'storyWatch');t.clock.tick(25000);const o=t.observers.find(o=>o.nodes.some(n=>n.id==='storyStage'));o.fn([{isIntersecting:false,intersectionRatio:0}]);const s=JSON.stringify(t.api.getState());t.clock.tick(60000);assert.equal(JSON.stringify(t.api.getState()),s);assert.equal(t.api.getState().immersive,false);o.fn([{isIntersecting:true,intersectionRatio:1}]);assert.equal(t.api.getState().playback,'paused');t.close();console.log('PASS visibility pause, no unexpected restart');
}
{
 const t=setup({hash:'#chapter-manage',observer:false});assert.equal(t.api.getState().order.id,'1051');click(t,'langToggle');assert.equal(t.w.document.documentElement.lang,'bn');assert.match(t.w.document.getElementById('storyCaption').textContent,/নমুনা/);assert.equal(t.api.getState().order.id,'1051');t.close();console.log('PASS deep link, language, observer fallback');
}
{
 const t=setup();click(t,'storyWatch');t.w.document.dispatchEvent(new t.w.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(t.api.getState().immersive,false);assert.equal(t.api.getState().playback,'paused');t.close();console.log('PASS Escape restores navigation');
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);console.log('PASS unique HTML IDs');
