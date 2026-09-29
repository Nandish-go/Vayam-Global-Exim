(function(root){
  'use strict';
  const enums={variant:['classic','refined','signature','trade'],category:['all','whole','ground','blends','staples','packaged','private'],channel:['email','whatsapp','phone','download','copy'],section:['range','approach','brief','contact'],buyer:['importer','retailer','foodservice','manufacturer'],packing:['bulk','retail','private-label','discuss'],action:['add','remove'],choice:['accepted','declined'],source:['google','bing','linkedin','instagram','newsletter','direct','referral','other'],medium:['organic','social','email','referral','direct','cpc','other'],campaign:['business_profile','launch','catalogue','other','none']};
  Object.assign(enums,{market:['middle-east','europe','north-america','south-america','other'],field:['quantity','destination','timing','contact','company','requirements'],status:['complete','empty'],interest:['sample'],placement:['header','hero','range','approach','brief','footer'],target:['main','home','products','range','approach','quality','process','documents','faq','brief','contact','markets'],viewport_bucket:['small-phone','phone','tablet','desktop'],metric:['LCP','CLS','FCP'],metric_rating:['good','needs-improvement','poor']});
  enums.section.push('markets');
  const names=new Set(['page_view','catalogue_filter','search_results','product_view','shortlist_change','compare_open','compare_change','buyer_route','packing_select','brief_start','brief_error','brief_prepared','brief_field_completed','contact_handoff','brief_download','brief_copy','section_view','scroll_depth','engaged_time','consent_choice','map_open','navigation_click','cta_click','market_select','sample_interest','technical_error','web_vital']);
  function sanitize(name,params,products=[]){
    if(!names.has(name))return null;
    const safe={};
    for(const [k,v] of Object.entries(params||{})){
      if(enums[k]?.includes(v))safe[k]=v;
      if(k==='product_id'&&products.includes(v))safe[k]=v;
      if(['item_count','result_count'].includes(k)&&Number.isInteger(v)&&v>=0&&v<=100)safe[k]=v;
      if(k==='percent'&&[25,50,75,100].includes(v))safe[k]=v;
      if(k==='seconds'&&[30,60,120,300].includes(v))safe[k]=v;
      if(k==='error_type'&&['missing_destination','empty_brief','invalid_field','script_error','resource_error'].includes(v))safe[k]=v;
      if(k==='metric_value'&&name==='web_vital'&&typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=60000)safe[k]=Math.round(v*1000)/1000;
    }
    return {name,params:safe};
  }
  if(typeof module!=='undefined')module.exports={sanitize};
  if(!root.document)return;
  const config=root.VAYAM_SETTINGS.analytics,variant=document.body.dataset.variant;
  const preview=!config.enabled||!config.allowedHosts.includes(location.hostname)||!/^G-[A-Z0-9]+$/.test(config.measurementId);
  const ids=(root.VAYAM_DATA?.products||[]).map(p=>p.id),events=[];
  let accepted=false,loaded=false;
  try{accepted=localStorage.getItem('vayam.analytics-consent.v1')==='accepted';}catch{}
  function acquisition(){
    const q=new URLSearchParams(location.search),src=q.get('utm_source'),med=q.get('utm_medium'),campaign=q.get('utm_campaign');
    let source='direct',medium='direct';
    try{if(document.referrer){const h=new URL(document.referrer).hostname;source=/^(www\.)?google\./.test(h)?'google':/(^|\.)bing.com$/.test(h)?'bing':/(^|\.)linkedin.com$/.test(h)?'linkedin':/(^|\.)instagram.com$/.test(h)?'instagram':'referral';medium=['google','bing'].includes(source)?'organic':['linkedin','instagram'].includes(source)?'social':'referral';}}catch{}
    if(src){source=enums.source.includes(src)?src:'other';medium=enums.medium.includes(med)?med:'other';}
    return {source,medium,campaign:campaign?(enums.campaign.includes(campaign)?campaign:'other'):'none',viewport_bucket:root.innerWidth<=360?'small-phone':root.innerWidth<=600?'phone':root.innerWidth<=1024?'tablet':'desktop'};
  }
  function load(){
    if(preview||!accepted||loaded)return;
    loaded=true;root['ga-disable-'+config.measurementId]=false;root.dataLayer=root.dataLayer||[];
    root.gtag=function(){root.dataLayer.push(arguments);};
    root.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    root.gtag('consent','update',{analytics_storage:'granted'});
    root.gtag('js',new Date());
    const ac=acquisition();
    root.gtag('config',config.measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      page_location:location.origin+location.pathname,page_referrer:'',campaign_source:ac.source,campaign_medium:ac.medium,campaign_name:ac.campaign});
    const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+config.measurementId;document.head.append(s);
  }
  function track(name,params={}){
    const event=sanitize(name,{...params,variant},ids);if(!event)return;
    // Only an ephemeral local preview trace, with no contact fields, full URLs or search text.
    if(preview){events.push({time:new Date().toLocaleTimeString(),...event});if(events.length>200)events.shift();document.dispatchEvent(new CustomEvent('vayam:measurement',{detail:event}));return;}
    if(!accepted)return;load();
    root.gtag('event',event.name,{...event.params,page_location:location.origin+location.pathname,page_referrer:'',debug_mode:config.debug});
  }
  function consent(value){
    accepted=value==='accepted';try{localStorage.setItem('vayam.analytics-consent.v1',value);}catch{}
    if(!accepted&&!preview){root['ga-disable-'+config.measurementId]=true;if(loaded)root.gtag('consent','update',{analytics_storage:'denied'});
      for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(/^_ga($|_)/.test(name)){for(const domain of ['',location.hostname,'.'+location.hostname,'.vayam-global.com'])document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'');}}
    }
    if(accepted&&!preview){root['ga-disable-'+config.measurementId]=false;if(loaded)root.gtag('consent','update',{analytics_storage:'granted'});load();track('page_view',acquisition());}
    track('consent_choice',{choice:value});
  }
  root.VayamAnalytics={track,consent,preview,events,acquisition};
  load();track('page_view',acquisition());
})(typeof window!=='undefined'?window:globalThis);
