const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scenes = [...document.querySelectorAll("[data-okanagan-scene]")];
const staysTrigger = document.querySelector("[data-stays-trigger]");
const navDropdown = staysTrigger?.closest(".nav-dropdown");
const siteHeader = document.querySelector("[data-site-header]");
const clampUnit = (value) => Math.max(0, Math.min(1, value));
let animationFrame;
let announcedScene;

const setMenu = (open) => {
  navDropdown?.classList.toggle("is-open", open);
  staysTrigger?.setAttribute("aria-expanded", String(open));
};

staysTrigger?.addEventListener("click", (event) => {
  event.preventDefault();
  setMenu(!navDropdown?.classList.contains("is-open"));
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!link.closest(".nav-mega")) setMenu(false);
  });
});

document.addEventListener("click", (event) => {
  if (!navDropdown?.contains(event.target)) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const seekVideo = (video, progress) => {
  if (!video || video.readyState < 1 || !Number.isFinite(video.duration)) return;
  const target = clampUnit(progress) * Math.max(.05, video.duration - .06);
  if (Math.abs(video.currentTime - target) > .025) video.currentTime = target;
};

const renderScenes = () => {
  animationFrame = undefined;
  const viewportHeight = window.innerHeight;
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > viewportHeight * .45);

  scenes.forEach((scene) => {
    const travel = Math.max(1, scene.offsetHeight - viewportHeight);
    const progress = reducedMotion.matches ? 1 : clampUnit((window.scrollY - scene.offsetTop) / travel);
    const hero = scene.querySelector("[data-okanagan-hero]");
    hero?.style.setProperty("--scene-progress", progress.toFixed(4));
    hero?.style.setProperty("--final-opacity", clampUnit((progress - .93) / .07).toFixed(4));
    scene.dataset.sceneProgress = progress.toFixed(4);
    seekVideo(scene.querySelector("[data-hero-video]"), progress);
  });

  const activeScene = [...scenes].reverse()
    .find((scene) => window.scrollY >= scene.offsetTop - 1)?.dataset.okanaganScene || "overview";
  if (activeScene !== announcedScene) {
    announcedScene = activeScene;
    window.parent.postMessage({ type: "okanagan-scene-change", scene: activeScene }, "*");
  }
};

const requestRender = () => {
  if (!animationFrame) animationFrame = requestAnimationFrame(renderScenes);
};

if ("IntersectionObserver" in window) {
  const copyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-copy-visible");
      copyObserver.unobserve(entry.target);
    });
  }, { threshold: .18 });
  scenes.forEach((scene) => copyObserver.observe(scene));
} else {
  scenes.forEach((scene) => scene.classList.add("is-copy-visible"));
}

window.addEventListener("scroll", requestRender, { passive: true });
window.addEventListener("resize", requestRender, { passive: true });
scenes.forEach((scene) => scene.querySelector("[data-hero-video]")?.addEventListener("loadedmetadata", requestRender));
renderScenes();
