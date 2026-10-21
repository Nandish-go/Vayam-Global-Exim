(function(root) {
  'use strict';
  function validate(input) {
    const count = v => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
    const label = (v, max=120) => typeof v === 'string' && v.length <= max;
    const fail = name => {throw Error('Invalid '+name+' in the report. No report was loaded.');};
    if (!input || input.schemaVersion !== 1 || !label(input.label)) fail('report format');
    if (!input.summary || !['visitors','visits','productInterest','handoffs'].every(k=>count(input.summary[k]))) fail('overview counts');
    for(const [name,limit] of Object.entries({trend:366,countries:80,sources:20,cities:80,products:50,sections:30,funnel:20})){
      const rows=input[name];
      if(!Array.isArray(rows)||rows.length>limit)fail(name);
      if(name==='trend'){
        if(rows.some((r,i)=>!Array.isArray(r)||r.length!==3||!r.every(count)||r[0]<1||(i>0&&r[0]<=rows[i-1][0])))fail('daily trend');
      }else if(rows.some(r=>!r||!label(r.name)||!count(r[name==='funnel'?'count':'value'])||
        ['code','country','detail'].some(k=>r[k]!==undefined&&!label(r[k],300))))fail(name+' rows');
    }
    return input;
  }
  root.VayamReport=Object.freeze({validate});
  if(typeof module!=='undefined')module.exports=root.VayamReport;
})(typeof window!=='undefined'?window:globalThis);
