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
{
 const t=setup();click(t,'cxWatch');t.clock.tick(9000);const before=t.api.getState();assert.notEqual(before.headline,'Everyday essentials.');click(t,'cxPlay');const s=JSON.stringify(t.api.getState());t.clock.tick(30000);assert.equal(JSON.stringify(t.api.getState()),s,'pause freezes single clock');click(t,'cxPlay');t.clock.tick(180000);const end=t.api.getState();assert.equal(end.playing,false);assert.equal(end.shipment,5);assert.equal(end.settled,true);assert.equal(end.size,'M');assert.equal(end.order,true);assert.equal(end.palette,'sage');assert.equal(end.promo,'banner');assert.equal(end.layout,'centered');assert.match(t.w.document.getElementById('cxGuideCredit').textContent,/1,490/);click(t,'cxPlay');t.clock.tick(180000);assert.equal(t.api.getState().settled,true);t.close();console.log('PASS full story, pause/resume, replay, connected order and separate settlement');
}
{
 const t=setup();click(t,'cxExplore');const input=t.w.document.getElementById('cxTitleInput');input.focus();change(t,'cxTitleInput','My own brand','input');assert.equal(t.w.document.getElementById('cxHeroText').textContent,'My own brand');click(t,'cxUndo');assert.equal(t.api.getState().headline,'Everyday essentials.');click(t,'cxRedo');assert.equal(t.api.getState().headline,'My own brand');click(t,'cxHeroCentered');assert.equal(t.api.getState().layout,'centered');click(t,'cxThemeClay');assert.equal(t.w.document.getElementById('cxStore').dataset.palette,'clay');click(t,'cxSave');assert.equal(t.api.getState().saved,true);assert.equal(t.api.getState().published,false);click(t,'cxPublish');assert.equal(t.api.getState().published,true);t.close();console.log('PASS live editor, undo/redo, layout, palette, save versus publish');
}
{
 const t=setup();click(t,'cxExplore');click(t,'cxMobilePreview');click(t,'cxProductCard');assert.equal(t.api.getState().view,'product');t.w.document.querySelector('[data-size="L"]').click();click(t,'cxAdd');assert.equal(t.api.getState().chapter,'sell');assert.equal(t.api.getState().view,'checkout');click(t,'cxPlace');click(t,'cxToManage');click(t,'cxProcess');assert.equal(t.api.getState().size,'L');assert.equal(t.w.document.getElementById('cxBook').disabled,true);change(t,'cxCourier','pathao');click(t,'cxBook');click(t,'cxBook');assert.equal(t.api.getState().shipment,1);for(let i=0;i<4;i++)click(t,'cxAdvanceShipment');assert.equal(t.api.getState().shipment,5);assert.equal(t.api.getState().settled,false);click(t,'cxAdvanceShipment');assert.equal(t.api.getState().settled,true);t.close();console.log('PASS manual purchase, variant continuity, guarded booking and later settlement');
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
