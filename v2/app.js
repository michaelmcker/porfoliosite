const workflowItems = [...document.querySelectorAll(".workflow-item")];
const workflowTriggers = workflowItems.map((item) => item.querySelector("[data-workflow-trigger]"));
const workflowAccordion = document.querySelector("[data-workflow-accordion]");
const workflowMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeWorkflowIndex = Math.max(0, workflowItems.findIndex((item) => item.classList.contains("is-active")));
let workflowTransitionTimer;

function focusActiveWorkflow(index) {
  const desktop = window.matchMedia("(min-width: 1100px)").matches;
  if (desktop) {
    workflowItems[index].querySelector("[data-workflow-panel] a")?.focus();
  } else {
    workflowTriggers[index].focus();
  }
}

function activateWorkflow(index, { focus = false } = {}) {
  const safeIndex = Math.max(0, Math.min(index, workflowItems.length - 1));
  if (safeIndex === activeWorkflowIndex) {
    if (focus) focusActiveWorkflow(safeIndex);
    return;
  }

  window.clearTimeout(workflowTransitionTimer);
  workflowAccordion?.setAttribute("data-workflow-transitioning", "true");

  workflowItems.forEach((item, itemIndex) => {
    const active = itemIndex === safeIndex;
    const panel = item.querySelector("[data-workflow-panel]");
    workflowTriggers[itemIndex].setAttribute("aria-expanded", String(active));
    workflowTriggers[itemIndex].toggleAttribute("aria-current", active);
    panel.setAttribute("aria-hidden", String(!active));
    panel.toggleAttribute("inert", !active);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      workflowItems.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === safeIndex));
      activeWorkflowIndex = safeIndex;
      if (focus) focusActiveWorkflow(safeIndex);

      if (workflowMotion.matches) {
        workflowAccordion?.removeAttribute("data-workflow-transitioning");
        return;
      }

      workflowTransitionTimer = window.setTimeout(() => {
        workflowAccordion?.removeAttribute("data-workflow-transitioning");
      }, 620);
    });
  });
}

workflowTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => activateWorkflow(index));
  trigger.addEventListener("keydown", (event) => {
    const horizontal = window.matchMedia("(min-width: 1100px)").matches;
    const previousKey = horizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    let nextIndex = index;

    if (event.key === previousKey) nextIndex = (index - 1 + workflowTriggers.length) % workflowTriggers.length;
    if (event.key === nextKey) nextIndex = (index + 1) % workflowTriggers.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = workflowTriggers.length - 1;

    if ([previousKey, nextKey, "Home", "End"].includes(event.key)) {
      event.preventDefault();
      activateWorkflow(nextIndex, { focus: true });
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateWorkflow(index);
    }
  });
});

const motionVideos = [...document.querySelectorAll("[data-motion-video]")];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const visibleMotionVideos = new Set();

const loadMotionVideo = (video) => {
  if (video.dataset.motionLoaded === "true") return;
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
  });
  video.dataset.motionLoaded = "true";
  video.load();
};

const playMotionVideo = async (video) => {
  loadMotionVideo(video);
  try {
    await video.play();
    delete video.dataset.motionBlocked;
  } catch {
    video.dataset.motionBlocked = "true";
  }
};

if (!motionPreference.matches && "IntersectionObserver" in window) {
  motionVideos.forEach((video) => {
    video.addEventListener("canplay", () => {
      if (visibleMotionVideos.has(video)) playMotionVideo(video);
    });
  });

  const motionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        visibleMotionVideos.add(video);
        loadMotionVideo(video);
        playMotionVideo(video);
      } else if (!video.paused) {
        visibleMotionVideos.delete(video);
        video.pause();
      } else {
        visibleMotionVideos.delete(video);
      }
    });
  }, { rootMargin: "75% 0px", threshold: 0.04 });
  motionVideos.forEach((video) => motionObserver.observe(video));

  const retryVisibleMotion = () => visibleMotionVideos.forEach((video) => playMotionVideo(video));
  window.addEventListener("pointerdown", retryVisibleMotion, { passive: true });
  window.addEventListener("keydown", retryVisibleMotion);
}

const biasSequence = document.querySelector("[data-bias-sequence]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const accommodationVideo = document.querySelector("[data-accommodation-scrub]");
const accommodationViewer = accommodationVideo?.closest("[data-accommodation-viewer]");
const sourceFrameDuration = 1 / 25;
let accommodationDuration = 0;
let accommodationPendingProgress = 0;

const seekAccommodation = (progress) => {
  accommodationPendingProgress = Math.max(0, Math.min(1, progress));
  if (!accommodationVideo || !accommodationDuration || reducedMotion.matches) return;
  const rawTime = accommodationPendingProgress * Math.max(0, accommodationDuration - sourceFrameDuration);
  const nextTime = Math.round(rawTime / sourceFrameDuration) * sourceFrameDuration;
  if (Math.abs(accommodationVideo.currentTime - nextTime) < sourceFrameDuration * .5) return;
  accommodationVideo.currentTime = nextTime;
};

accommodationVideo?.addEventListener("loadedmetadata", () => {
  accommodationDuration = Number.isFinite(accommodationVideo.duration) ? accommodationVideo.duration : 0;
  seekAccommodation(accommodationPendingProgress);
}, { once: true });

accommodationVideo?.addEventListener("error", () => {
  accommodationViewer?.classList.add("has-scrub-error");
});

if (biasSequence && !reducedMotion.matches && "IntersectionObserver" in window) {
  biasSequence.classList.add("is-observable");
  const biasObserver = new IntersectionObserver((entries, observer) => {
    const entry = entries[0];
    if (!entry?.isIntersecting) return;
    entry.target.classList.add("is-revealed");
    observer.unobserve(entry.target);
  }, { threshold: 0.28 });
  biasObserver.observe(biasSequence);
}

const scrollRevealObjects = [...document.querySelectorAll("[data-scroll-reveal]")];
let objectRevealFrame;

const updateObjectReveals = () => {
  objectRevealFrame = undefined;
  scrollRevealObjects.forEach((object) => {
    const section = object.closest(".work-object");
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    const travel = window.innerHeight * .88 + section.offsetHeight * .58;
    const rawProgress = reducedMotion.matches ? 1 : clampUnit((window.innerHeight * .98 - bounds.top) / travel);
    const revealKey = object.dataset.scrollReveal;
    const progress = revealKey === "elevators" ? clampUnit(rawProgress / .72) : rawProgress;
    object.style.setProperty("--object-reveal", progress.toFixed(3));
    if (revealKey === "accommodation") seekAccommodation(progress);
  });
};

const requestObjectRevealUpdate = () => {
  if (objectRevealFrame) return;
  objectRevealFrame = requestAnimationFrame(updateObjectReveals);
};

window.addEventListener("scroll", requestObjectRevealUpdate, { passive: true });
window.addEventListener("resize", requestObjectRevealUpdate, { passive: true });

const aboutToggle = document.querySelector("[data-about-toggle]");
const aboutNote = document.querySelector("[data-about-note]");
const aboutStage = document.querySelector("[data-about-stage]");
const aboutScrollStory = document.querySelector("[data-about-scroll-story]");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitEmbed = portraitFrame?.querySelector("iframe");
let portraitPointerFrame;
let aboutScrollFrame;

portraitEmbed?.addEventListener("load", () => portraitFrame.classList.add("is-loaded"));

const sendPortraitPointer = (event) => {
  if (!aboutStage || !portraitEmbed?.contentWindow) return;
  const bounds = aboutStage.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / Math.min(bounds.height, window.innerHeight * 1.4)));
  window.cancelAnimationFrame(portraitPointerFrame);
  portraitPointerFrame = requestAnimationFrame(() => {
    portraitEmbed.contentWindow.postMessage({ type: "portfolio-portrait-pointer", x, y }, "*");
  });
};

aboutStage?.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "touch") sendPortraitPointer(event);
});
aboutStage?.addEventListener("pointerdown", sendPortraitPointer);

const clampUnit = (value) => Math.max(0, Math.min(1, value));
const phase = (progress, start, end) => clampUnit((progress - start) / (end - start));

const updateAboutProgress = () => {
  aboutScrollFrame = undefined;
  if (!aboutScrollStory) return;
  const bounds = aboutScrollStory.getBoundingClientRect();
  const travel = Math.max(1, aboutScrollStory.offsetHeight - window.innerHeight);
  const progress = reducedMotion.matches ? 1 : clampUnit(-bounds.top / travel);
  aboutScrollStory.style.setProperty("--about-progress", progress.toFixed(3));
  aboutScrollStory.style.setProperty("--about-focus", phase(progress, .05, .25).toFixed(3));
  aboutScrollStory.style.setProperty("--about-growth", phase(progress, .28, .52).toFixed(3));
  aboutScrollStory.style.setProperty("--about-line", phase(progress, .52, .7).toFixed(3));
  aboutScrollStory.style.setProperty("--about-value", phase(progress, .7, .86).toFixed(3));
  aboutStage?.classList.toggle("is-about-focused", progress > .055);
};

window.addEventListener("scroll", () => {
  if (aboutScrollFrame) return;
  aboutScrollFrame = requestAnimationFrame(updateAboutProgress);
}, { passive: true });
window.addEventListener("resize", updateAboutProgress, { passive: true });
updateAboutProgress();
updateObjectReveals();

aboutToggle?.addEventListener("click", () => {
  const opening = aboutNote?.hidden ?? false;
  if (!aboutNote) return;
  aboutNote.hidden = !opening;
  aboutToggle.setAttribute("aria-expanded", String(opening));
  aboutToggle.textContent = opening ? "Hide the build note" : "How this unnecessary thing was made";
});

const dashboardDialog = document.querySelector("[data-dashboard-dialog]");
const dashboardOpen = document.querySelector("[data-dashboard-open]");
const dashboardClose = document.querySelector("[data-dashboard-close]");
let dashboardReturnFocus;

dashboardOpen?.addEventListener("click", () => {
  dashboardReturnFocus = dashboardOpen;
  dashboardDialog?.showModal();
});
dashboardClose?.addEventListener("click", () => dashboardDialog?.close());
dashboardDialog?.addEventListener("click", (event) => {
  if (event.target === dashboardDialog) dashboardDialog.close();
});
dashboardDialog?.addEventListener("close", () => dashboardReturnFocus?.focus());
