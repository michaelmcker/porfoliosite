for (const frame of document.querySelectorAll('[data-service-preview]')) {
 const container = frame.parentElement;
 const resize = () => { const scale = container.clientWidth / 1100; frame.style.width = '1100px'; frame.style.height = `${container.clientHeight / scale}px`; frame.style.transform = `scale(${scale})`; };
 new ResizeObserver(resize).observe(container); resize();
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.service-laptop video').forEach(video => video.pause());
