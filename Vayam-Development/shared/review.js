(()=>{
 const $=s=>document.querySelector(s),allowed=['classic','refined','signature','trade','baseline'];
 const labels={classic:'Classic',refined:'Refined',signature:'Signature',trade:'Trade',baseline:'Live baseline'};
 const q=new URLSearchParams(location.search);for(const side of ['left','right']){const v=q.get(side);if(allowed.includes(v))$('#'+side+'-choice').value=v;}if(!q.has('right'))$('#right-choice').value='refined';
 function render(){for(const side of ['left','right']){const v=$('#'+side+'-choice').value,frame=$('#'+side+'-frame');if(frame.getAttribute('src')!==v+'/')frame.src=v+'/';frame.width=$('#preview-width').value;$('#'+side+'-label').textContent=labels[v];$('#'+side+'-open').href=v+'/';}}
 ['left-choice','right-choice','preview-width'].forEach(id=>$('#'+id).addEventListener('change',render));$('#swap').addEventListener('click',()=>{const a=$('#left-choice').value;$('#left-choice').value=$('#right-choice').value;$('#right-choice').value=a;render();});
 const key='vayam.review.four.v1';let notes={};try{notes=JSON.parse(localStorage.getItem(key)||'{}');if(!notes||typeof notes!=='object'||Array.isArray(notes))notes={};}catch{}
 const load=()=>{$('#review-notes').value=typeof notes[$('#notes-version').value]==='string'?notes[$('#notes-version').value]:'';$('#notes-status').textContent='';};
 $('#notes-version').addEventListener('change',load);$('#save-notes').addEventListener('click',()=>{notes[$('#notes-version').value]=$('#review-notes').value;try{localStorage.setItem(key,JSON.stringify(notes));$('#notes-status').textContent='Saved on this device.';}catch{$('#notes-status').textContent='Browser storage unavailable. Download your notes instead.';}});
 $('#download-notes').addEventListener('click',()=>{notes[$('#notes-version').value]=$('#review-notes').value;const text=allowed.map(v=>labels[v]+'\n'+(notes[v]||'No notes yet.')).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='Vayam-four-version-review.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 load();render();
})();
