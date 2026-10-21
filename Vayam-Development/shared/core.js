(function(root){
  'use strict';
  const clean=(v,max=500)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
  function items(input,products){
    const seen=new Set();
    return (Array.isArray(input)?input:[]).filter(id=>products.some(p=>p.id===id)&&!seen.has(id)&&seen.add(id)).slice(0,32);
  }
  function shortlist(input,products){
    const selected=items(Array.isArray(input)?input:input?.selected,products);
    const quantities={};
    for(const id of selected){const value=input?.quantities?.[id];if(typeof value==='string'&&clean(value,60))quantities[id]=clean(value,60);}
    return {selected,quantities};
  }
  function brief(form,selected,products,variant){
    const ids=items(selected,products);
    if(!ids.length&&!clean(form.requirements))throw Error('Choose a product or describe your sourcing requirement.');
    if(!clean(form.destination,100))throw Error('Add a destination country or market.');
    const lines=['Vayam Global Exim — sourcing enquiry',`Website reference: ${clean(variant,20)}`];
    const labels={buyer:{importer:'Importer / distributor',retailer:'Retailer / brand owner',foodservice:'Food service',manufacturer:'Food manufacturer'},packing:{bulk:'Bulk',retail:'Retail', 'private-label':'Own label',discuss:'Please advise'},market:{'middle-east':'Middle East',europe:'Europe','north-america':'United States / North America','south-america':'South America',other:'Another market'}};
    for(const [label,key] of [['Name','name'],['Company','company'],['Email / phone','contact'],['Destination','destination'],['Market region','market'],['Buyer type','buyer'],['Packing preference','packing'],['Target timing','timing']])if(clean(form[key]))lines.push(`${label}: ${labels[key]?.[form[key]]||clean(form[key],160)}`);
    if(form.sample==='yes')lines.push('Sample interest: please advise available sample options and any costs.');
    lines.push('','Products / programmes:');
    if(!ids.length)lines.push('Custom sourcing requirement');
    for(const id of ids){const p=products.find(p=>p.id===id);const q=clean(form.quantities?.[id],60);lines.push(`• ${p.name}${q?' — '+q:''}`);}
    if(clean(form.requirements,1800))lines.push('',`Requirements: ${clean(form.requirements,1800)}`);
    lines.push('','Please confirm feasibility, available specifications, indicative MOQ, packing options, lead time and next steps.');
    return lines.join('\n');
  }
  function links(text,config){return {whatsapp:`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`,email:`mailto:${config.email}?subject=${encodeURIComponent('Sourcing enquiry | Vayam Global Exim')}&body=${encodeURIComponent(text)}`};}
  root.VayamCore={clean,items,shortlist,brief,links};
  if(typeof module!=='undefined')module.exports=root.VayamCore;
})(typeof window!=='undefined'?window:globalThis);
