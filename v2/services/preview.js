for (const frame of document.querySelectorAll('[data-service-preview]')) {
 const container = frame.parentElement;
 const resize = () => { const scale = container.clientWidth / 1100; frame.style.width = '1100px'; frame.style.height = `${container.clientHeight / scale}px`; frame.style.transform = `scale(${scale})`; };
 new ResizeObserver(resize).observe(container); resize();
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.service-laptop video').forEach(video => video.pause());
// Reuse homepage media without loading its unrelated page interactions.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
 if (isIntersecting) {
  if(target.dataset.poster)target.poster=target.dataset.poster;
  target.querySelectorAll('source[data-src]').forEach(s=>{s.src=s.dataset.src;delete s.dataset.src});
  if(!target.dataset.loaded){target.load();target.dataset.loaded='true'}
  if(!reduced.matches)target.play().catch(()=>{});
 } else target.pause();
}),{threshold:.15});
document.querySelectorAll('video[data-motion-video]').forEach(v=>observer.observe(v));
const lazy=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.src=target.dataset.src;lazy.unobserve(target)}}),{rootMargin:'500px'});
document.querySelectorAll('img[data-src],iframe[data-src]').forEach(el=>lazy.observe(el));
const accommodation=document.querySelector('[data-accommodation-page]');
if(accommodation){const box=accommodation.parentElement;const fit=()=>{const scale=box.clientWidth/1100;accommodation.style.cssText=`width:1100px;max-width:none;height:${box.clientHeight/scale}px;transform:scale(${scale});transform-origin:top left`;};new ResizeObserver(fit).observe(box);fit();}
