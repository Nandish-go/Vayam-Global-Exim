(()=>{
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const {products,families}=VAYAM_DATA,core=VayamCore,analytics=VayamAnalytics,variant=document.body.dataset.variant;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const scrollTo=(element,options={})=>element.scrollIntoView({...options,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 const key='vayam.shortlist.'+variant;
 let selected=[],compare=[],filter='all',limit=6,search='',draftText='',started=false,market='middle-east';
 const quantities={};
 try{selected=core.items(JSON.parse(sessionStorage.getItem(key)||'[]'),products);}catch{}
 let toastTimer;
 function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);}
 function invalidate(){draftText='';$('#draft').hidden=true;$('#send-whatsapp').removeAttribute('href');$('#send-email').removeAttribute('href');}
 function save(){try{sessionStorage.setItem(key,JSON.stringify(selected));}catch{}}
 function renderShortlist(){
   $$('.count').forEach(n=>n.textContent=selected.length);
   $$('[data-add]').forEach(b=>{const active=selected.includes(b.dataset.add);b.setAttribute('aria-pressed',active);b.innerHTML=active?'In your brief <span aria-hidden="true">✓</span>':'Add to brief <span aria-hidden="true">+</span>';b.setAttribute('aria-label',(active?'Remove ':'Add ')+products.find(p=>p.id===b.dataset.add).name+(active?' from brief':' to brief'));});
   $('#selected-products').innerHTML=selected.length?selected.map(id=>{const p=products.find(p=>p.id===id);return `<div class="short-item"><div><strong>${escape(p.name)}</strong><button data-remove="${id}" aria-label="Remove ${escape(p.name)} from list">×</button></div><label>Indicative quantity and unit<input data-quantity="${id}" maxlength="60" placeholder="e.g. 500 kg, or please advise" value="${escape(quantities[id]||'')}"></label></div>`;}).join(''):'<p>Your list is waiting. Add products from the range, or describe a custom requirement.</p>';
   save();
 }
 function toggle(id){if(!products.some(p=>p.id===id))return;const exists=selected.includes(id);selected=exists?selected.filter(x=>x!==id):[...selected,id];invalidate();renderShortlist();analytics.track('shortlist_change',{action:exists?'remove':'add',product_id:id,item_count:selected.length});toast(exists?'Removed from your brief':'Added to your sourcing brief');}
 function renderRange(){
   const matches=products.filter(p=>(filter==='all'||p.category===filter)&&(!search||(p.name+' '+p.brief+' '+families.find(f=>f.id===p.category).name).toLowerCase().includes(search)));
   const visible=new Set(matches.slice(0,limit).map(p=>p.id));
   $$('.product-card').forEach(c=>c.hidden=!visible.has(c.dataset.product));
   $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===filter));
   $('#result-count').textContent=`Showing ${Math.min(limit,matches.length)} of ${matches.length} ${matches.length===1?'result':'results'}`;
   $('#empty-results').hidden=matches.length>0;$('#show-more').hidden=limit>=matches.length;
   return matches.length;
 }
 function setFilter(value){filter=value;limit=6;analytics.track('catalogue_filter',{category:filter,result_count:renderRange()});}
 function openProduct(id){const p=products.find(p=>p.id===id);if(!p)return;
   $('#product-content').innerHTML=`<div class="detail-layout"><div>${p.image?`<img class="detail-image" src="../shared/${p.image}" alt="${escape(p.alt)}" width="600" height="700">`:`<div class="type-tile"><span>Product reference</span><b>${escape(p.name)}</b><i aria-hidden="true">✳</i></div>`}<p class="fine">${escape(p.imageNote||'Commodity / packing reference')}. Actual specification and availability are confirmed against your enquiry.</p></div><div><p class="eyebrow">${escape(families.find(f=>f.id===p.category).name)}</p><h2 id="product-title">${escape(p.name)}</h2><p>${escape(p.brief)}</p><dl>${p.facts.map(([k,v])=>`<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join('')}</dl><button class="button primary" data-add="${p.id}"></button></div></div>`;
   renderShortlist();$('#product-dialog').showModal();analytics.track('product_view',{product_id:id,category:p.category});
 }
 function renderCompare(){
   $('#compare-count').textContent=compare.length+' / 3';
   $$('[data-compare]').forEach(b=>b.setAttribute('aria-pressed',compare.includes(b.dataset.compare)));
 }
 function openCompare(){
   $('#compare-content').innerHTML=compare.length?`<div class="comparison">${compare.map(id=>{const p=products.find(p=>p.id===id);return `<article><h3>${escape(p.name)}</h3><dl>${p.facts.map(([k,v])=>`<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join('')}</dl><button class="button" data-add="${id}"></button></article>`;}).join('')}</div>`:'<p>Select Compare on up to three catalogue cards, then return here.</p>';
   renderShortlist();$('#compare-dialog').showModal();analytics.track('compare_open',{item_count:compare.length});
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest('button,a');if(!b)return;
   if(b.dataset.product){const field=$('#brief-form').elements.requirements;if(!field.value.trim())field.value='Sourcing category: '+b.dataset.product;invalidate();toast('Category selected. Add quantity, packing and destination details to your brief.');}
   if(b.dataset.add)toggle(b.dataset.add);
   if(b.dataset.remove)toggle(b.dataset.remove);
   if(b.dataset.view)openProduct(b.dataset.view);
   if(b.dataset.filter)setFilter(b.dataset.filter);
   if(b.dataset.filterLink){setFilter(b.dataset.filterLink);scrollTo($('#range'));}
   if(b.dataset.compare){const id=b.dataset.compare;const exists=compare.includes(id);if(exists)compare=compare.filter(x=>x!==id);else if(compare.length<3)compare.push(id);else{toast('Compare up to three products. Remove one to add another.');return;}analytics.track('compare_change',{action:exists?'remove':'add',product_id:id,item_count:compare.length});renderCompare();}
   if(b.dataset.market){
     market=b.dataset.market;const m=VAYAM_MARKETS.find(m=>m.id===market);$$('[data-market]').forEach(n=>n.setAttribute('aria-pressed',n===b));
     $('#market-detail').innerHTML=`<p class="eyebrow">${escape(m.name)}</p><h3>${escape(m.headline)}</h3><p>${escape(m.intro)}</p><ul>${m.questions.map(q=>`<li>${escape(q)}</li>`).join('')}</ul><button class="button primary" id="market-brief">Use this market in your brief ↗</button>`;
     analytics.track('market_select',{market});
   }
   if(b.id==='market-brief'){$('#brief-form').elements.market.value=market;invalidate();scrollTo($('#brief'));analytics.track('cta_click',{placement:'range',target:'brief',market});toast('Market region added. Please specify the destination country.');}
   if(b.tagName==='A'&&b.getAttribute('href')?.startsWith('#')){const target=b.getAttribute('href').slice(1);const placement=b.closest('header')?'header':b.closest('.hero')?'hero':b.closest('#approach')?'approach':b.closest('#brief')?'brief':'range';analytics.track(b.closest('nav')?'navigation_click':'cta_click',{target,placement});}
   if(b.dataset.buyer){
     const buyer=b.dataset.buyer;$('#brief-form').elements.buyer.value=buyer;invalidate();
     $$('[data-buyer]').forEach(n=>n.setAttribute('aria-pressed',n===b));
     const label=$('#brief-form').elements.buyer.selectedOptions[0].textContent;
     $('#route-note').textContent=label+' selected. Your sourcing brief now includes this context.';
     if(variant==='pulse'){setFilter(buyer==='retailer'?'private':buyer==='manufacturer'?'blends':'packaged');scrollTo($('#range'));}
     analytics.track('buyer_route',{buyer});toast('Your buyer context has been added');
   }
   if(b.classList.contains('close-dialog'))b.closest('dialog').close();
   if(b.dataset.contact)analytics.track('contact_handoff',{channel:b.dataset.contact,item_count:0});
   if(b.hasAttribute('data-map'))analytics.track('map_open',{});
   if(b.dataset.consent){analytics.consent(b.dataset.consent);$('#consent').hidden=true;toast(analytics.preview?'Choice saved. This preview sends no analytics.':'Analytics preference saved.');}
 });
 $$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
 $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
 $('#show-more').addEventListener('click',()=>{limit+=6;renderRange();});
 $('#clear-filters').addEventListener('click',()=>{search='';$('#search').value='';setFilter('all');});
 let searchTimer;$('#search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();limit=6;const count=renderRange();clearTimeout(searchTimer);searchTimer=setTimeout(()=>analytics.track('search_results',{category:filter,result_count:count}),500);});
 $('#compare-open')?.addEventListener('click',openCompare);
 $('.menu-toggle').addEventListener('click',()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-expanded',!open);$('#mobile-nav').hidden=open;});
 $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-nav').hidden){$('#mobile-nav').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus();}});
 $('#selected-products').addEventListener('input',e=>{if(e.target.dataset.quantity){quantities[e.target.dataset.quantity]=e.target.value;invalidate();}});
 $('#brief-form').addEventListener('input',()=>{invalidate();if(!started){started=true;analytics.track('brief_start',{item_count:selected.length});}});
 $('#brief-form').addEventListener('change',e=>{invalidate();if(e.target.name==='packing')analytics.track('packing_select',{packing:e.target.value});if(e.target.name==='market')analytics.track('market_select',{market:e.target.value});if(e.target.name==='sample')analytics.track('sample_interest',{interest:'sample',status:e.target.checked?'complete':'empty'});});
 document.addEventListener('focusout',e=>{if(e.target.dataset.quantity)analytics.track('brief_field_completed',{field:'quantity',product_id:e.target.dataset.quantity,status:e.target.value.trim()?'complete':'empty'});if(e.target.closest('#brief-form')&&['destination','timing','contact','company','requirements'].includes(e.target.name))analytics.track('brief_field_completed',{field:e.target.name,status:e.target.value.trim()?'complete':'empty'});});
 $('#brief-form').addEventListener('invalid',()=>analytics.track('brief_error',{error_type:'invalid_field'}),true);
 $('#brief-form').addEventListener('submit',e=>{
   e.preventDefault();const form=Object.fromEntries(new FormData(e.target));form.quantities=quantities;
   try{draftText=core.brief(form,selected,products,variant);const links=core.links(draftText,VAYAM_SETTINGS);$('#draft-text').textContent=draftText;$('#send-whatsapp').href=links.whatsapp;$('#send-email').href=links.email;$('#draft').hidden=false;$('#form-status').textContent='Your draft is ready to review below.';scrollTo($('#draft'),{block:'center'});analytics.track('brief_prepared',{item_count:selected.length,buyer:form.buyer,packing:form.packing});}
   catch(error){$('#form-status').textContent=error.message;analytics.track('brief_error',{error_type:form.destination?'empty_brief':'missing_destination'});}
 });
 $('#send-whatsapp').addEventListener('click',()=>analytics.track('contact_handoff',{channel:'whatsapp',item_count:selected.length}));
 $('#send-email').addEventListener('click',()=>analytics.track('contact_handoff',{channel:'email',item_count:selected.length}));
 $('#download-brief').addEventListener('click',()=>{if(!draftText)return;const url=URL.createObjectURL(new Blob([draftText],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Vayam-sourcing-brief-'+variant+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);analytics.track('brief_download',{channel:'download',item_count:selected.length});toast('Brief download prepared');});
 $('#copy-brief').addEventListener('click',async()=>{if(!draftText)return;try{await navigator.clipboard.writeText(draftText);analytics.track('brief_copy',{channel:'copy',item_count:selected.length});toast('Message copied');}catch{toast('Copy unavailable. Select the message text or download it.');}});
 $('#privacy-settings').addEventListener('click',()=>{$('#consent').hidden=false;$('#consent button').focus();});
 if(!analytics.preview){try{$('#consent').hidden=!!localStorage.getItem('vayam.analytics-consent.v1');}catch{$('#consent').hidden=false;}}
 function events(){if($('#measure-dialog').open){$('#event-list').innerHTML=analytics.events.slice().reverse().map(e=>`<div><b>${escape(e.time)} ${escape(e.name)}</b><br>${escape(JSON.stringify(e.params))}</div>`).join('')||'No local events.';}}
 $('#measure-open').addEventListener('click',()=>{$('#measure-mode').textContent=analytics.preview?'PREVIEW MODE — no events sent to Google or another server.':'Production mode — local event tracing is disabled.';$('#measure-dialog').showModal();events();});
 document.addEventListener('vayam:measurement',events);
 const sectionsSeen=new Set();const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&!sectionsSeen.has(e.target.id)){sectionsSeen.add(e.target.id);analytics.track('section_view',{section:e.target.id});}});},{threshold:.18});
 ['range','approach','brief','contact','markets'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el);});
 const depths=new Set();window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;if(max<=0)return;const p=Math.round(scrollY/max*100);[25,50,75,100].forEach(n=>{if(p>=n&&!depths.has(n)){depths.add(n);analytics.track('scroll_depth',{percent:n});}});},{passive:true});
 let activeSeconds=0;const milestones=new Set();setInterval(()=>{if(document.visibilityState==='visible'){activeSeconds+=1;[30,60,120,300].forEach(s=>{if(activeSeconds>=s&&!milestones.has(s)){milestones.add(s);analytics.track('engaged_time',{seconds:s});}});}},1000);
 window.addEventListener('error',e=>analytics.track('technical_error',{error_type:e.target===window?'script_error':'resource_error'}),true);
 window.addEventListener('unhandledrejection',()=>analytics.track('technical_error',{error_type:'script_error'}));
 // Diagnostics only. Field Core Web Vitals, especially INP, need a reviewed measurement library.
 const vitals={LCP:0,CLS:0,FCP:0};let clsStart=0,clsLast=0,clsWindow=0;
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())vitals.LCP=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){if(e.startTime-clsLast<1000&&e.startTime-clsStart<5000)clsWindow+=e.value;else{clsStart=e.startTime;clsWindow=e.value;}clsLast=e.startTime;vitals.CLS=Math.max(vitals.CLS,clsWindow);}}).observe({type:'layout-shift',buffered:true});}catch{}
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.name==='first-contentful-paint')vitals.FCP=e.startTime;}).observe({type:'paint',buffered:true});}catch{}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')for(const [metric,value]of Object.entries(vitals)){if(!value&&metric!=='CLS')continue;const metric_rating=metric==='CLS'?(value<=.1?'good':value<=.25?'needs-improvement':'poor'):metric==='FCP'?(value<=1800?'good':value<=3000?'needs-improvement':'poor'):(value<=2500?'good':value<=4000?'needs-improvement':'poor');analytics.track('web_vital',{metric,metric_value:value,metric_rating});}});
 renderShortlist();renderRange();
})();
