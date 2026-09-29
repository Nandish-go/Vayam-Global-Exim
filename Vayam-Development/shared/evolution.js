// Progressive enhancement only: all main content is visible without motion or JS.
(()=>{
 const reload=document.querySelector('#reload-map');if(reload)reload.addEventListener('click',()=>{const frame=document.querySelector('.address-map iframe');frame.src=frame.getAttribute('src');});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&'IntersectionObserver' in window){const seen=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-ready');seen.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.category-card,.buyer-guide,.office-card').forEach(el=>seen.observe(el));}
 document.querySelectorAll('.faq details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==d)other.open=false;});}));
})();
