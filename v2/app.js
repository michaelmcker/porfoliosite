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
      }, 840);
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
const accommodationPage = document.querySelector("[data-accommodation-page]");
const accommodationViewport = accommodationPage?.closest(".accommodation-viewport");
const accommodationUrl = document.querySelector("[data-accommodation-url]");
const ACCOMMODATION_DESKTOP_WIDTH = 1100;
const accommodationUrls = {
  overview: "okanagantreehouse.ca",
  treehouse: "okanagantreehouse.ca/treehouse",
  cabin: "okanagantreehouse.ca/cabin",
};

const loadAccommodationPreview = () => {
  if (!accommodationPage || accommodationPage.src || !accommodationPage.dataset.src) return;
  accommodationPage.src = accommodationPage.dataset.src;
};

if (accommodationPage) {
  const syncAccommodationViewport = () => {
    if (!accommodationViewport) return;
    const bounds = accommodationViewport.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const scale = Math.min(1, bounds.width / ACCOMMODATION_DESKTOP_WIDTH);
    const scaled = scale < .999;
    accommodationViewport.classList.toggle("is-desktop-scaled", scaled);
    if (!scaled) {
      accommodationPage.style.removeProperty("width");
      accommodationPage.style.removeProperty("height");
      accommodationPage.style.removeProperty("transform");
      return;
    }
    accommodationPage.style.width = `${ACCOMMODATION_DESKTOP_WIDTH}px`;
    accommodationPage.style.height = `${bounds.height / scale}px`;
    accommodationPage.style.transform = `scale(${scale})`;
  };

  syncAccommodationViewport();
  if ("ResizeObserver" in window) {
    new ResizeObserver(syncAccommodationViewport).observe(accommodationViewport);
  } else {
    window.addEventListener("resize", syncAccommodationViewport, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    const accommodationObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      loadAccommodationPreview();
      observer.disconnect();
    }, { rootMargin: "110% 0px", threshold: 0 });
    accommodationObserver.observe(accommodationPage);
  } else {
    loadAccommodationPreview();
  }
}

window.addEventListener("message", (event) => {
  if (!accommodationPage || event.source !== accommodationPage.contentWindow) return;
  if (event.data?.type !== "okanagan-scene-change") return;
  if (!Object.hasOwn(accommodationUrls, event.data.scene)) return;
  if (accommodationUrl) accommodationUrl.textContent = accommodationUrls[event.data.scene];
});

const heroPosterMedia = window.matchMedia("(max-width: 699px)");
const syncMotionPoster = (video) => {
  const responsivePoster = heroPosterMedia.matches
    ? video.dataset.posterMobile
    : video.dataset.posterDesktop;
  if (responsivePoster && video.getAttribute("poster") !== responsivePoster) {
    video.setAttribute("poster", responsivePoster);
  }
};

motionVideos.forEach(syncMotionPoster);
heroPosterMedia.addEventListener?.("change", () => motionVideos.forEach(syncMotionPoster));

const loadMotionVideo = (video) => {
  if (video.dataset.motionLoaded === "true") return;
  syncMotionPoster(video);
  if (video.dataset.poster && !video.poster) video.poster = video.dataset.poster;
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
  });
  video.dataset.motionLoaded = "true";
  video.load();
};

const deferredImages = [...document.querySelectorAll("img[data-src]")];
const loadDeferredImage = (image) => {
  if (image.src || !image.dataset.src) return;
  image.src = image.dataset.src;
};

if (deferredImages.length) {
  if ("IntersectionObserver" in window) {
    const deferredImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadDeferredImage(entry.target);
        deferredImageObserver.unobserve(entry.target);
      });
    }, { rootMargin: "110% 0px", threshold: 0 });
    deferredImages.forEach((image) => deferredImageObserver.observe(image));
  } else {
    deferredImages.forEach(loadDeferredImage);
  }
}

const playMotionVideo = async (video) => {
  loadMotionVideo(video);
  try {
    await video.play();
    delete video.dataset.motionBlocked;
  } catch {
    video.dataset.motionBlocked = "true";
  }
};

const setMotionPlaybackState = (video, isPlaying) => {
  const host = video.closest(".hero-system-media");
  if (!host) return;
  host.classList.toggle("is-video-playing", isPlaying);
};

if (!motionPreference.matches && "IntersectionObserver" in window) {
  motionVideos.forEach((video) => {
    video.addEventListener("loadeddata", () => {
      video.closest(".hero-system-media")?.classList.add("has-video-frame");
    });
    video.addEventListener("canplay", () => {
      if (visibleMotionVideos.has(video)) playMotionVideo(video);
    });
    video.addEventListener("playing", () => {
      window.requestAnimationFrame(() => setMotionPlaybackState(video, true));
    });
    video.addEventListener("waiting", () => setMotionPlaybackState(video, false));
    video.addEventListener("stalled", () => setMotionPlaybackState(video, false));
    video.addEventListener("pause", () => setMotionPlaybackState(video, false));
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
const clampUnit = (value) => Math.max(0, Math.min(1, value));
const phase = (progress, start, end) => clampUnit((progress - start) / (end - start));

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
    const revealKey = object.dataset.scrollReveal;
    const travel = window.innerHeight * .88 + section.offsetHeight * .58;
    const rawProgress = reducedMotion.matches ? 1 : clampUnit((window.innerHeight * .98 - bounds.top) / travel);
    const centredTop = (window.innerHeight - section.offsetHeight) / 2;
    const entranceTop = window.innerHeight * .96;
    const centredProgress = reducedMotion.matches ? 1 : clampUnit(
      (entranceTop - bounds.top) / Math.max(1, entranceTop - centredTop),
    );
    const progress = revealKey === "elevators"
      ? clampUnit(rawProgress / .72)
      : revealKey === "cool-runnings" || revealKey === "accommodation" ? centredProgress : rawProgress;
    object.style.setProperty("--object-reveal", progress.toFixed(3));
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
const aboutPointerStage = document.querySelector("[data-about-pointer-stage]");
const aboutCopy = document.querySelector(".about-copy");
const aboutQuestionableInline = document.querySelector("[data-about-questionable-inline]");
const aboutQuestionableFocus = document.querySelector("[data-about-questionable-focus]");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitEmbed = portraitFrame?.querySelector("iframe");
let portraitPointerFrame;
let aboutScrollFrame;

portraitEmbed?.addEventListener("load", () => portraitFrame.classList.add("is-loaded"));

const sendPortraitPointer = (event) => {
  if (!aboutPointerStage || !portraitEmbed?.contentWindow) return;
  const bounds = aboutPointerStage.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  window.cancelAnimationFrame(portraitPointerFrame);
  portraitPointerFrame = requestAnimationFrame(() => {
    portraitEmbed.contentWindow.postMessage({ type: "portfolio-portrait-pointer", x, y }, "*");
  });
};

aboutPointerStage?.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "touch") sendPortraitPointer(event);
});
aboutPointerStage?.addEventListener("pointerdown", sendPortraitPointer);

const positionAboutFocusPhrase = () => {
  if (!aboutScrollStory || !aboutCopy || !aboutQuestionableInline || !aboutQuestionableFocus) return;
  const inlineBounds = aboutQuestionableInline.getBoundingClientRect();
  const copyBounds = aboutCopy.getBoundingClientRect();
  const inlineStyle = getComputedStyle(aboutQuestionableInline);
  aboutScrollStory.style.setProperty("--about-phrase-x", `${inlineBounds.left - copyBounds.left}px`);
  aboutScrollStory.style.setProperty("--about-phrase-y", `${inlineBounds.top - copyBounds.top}px`);
  aboutScrollStory.style.setProperty("--about-phrase-size", inlineStyle.fontSize);
  aboutScrollStory.style.setProperty("--about-phrase-weight", inlineStyle.fontWeight);
};

const updateAboutProgress = () => {
  aboutScrollFrame = undefined;
  if (!aboutScrollStory) return;
  positionAboutFocusPhrase();
  const bounds = aboutScrollStory.getBoundingClientRect();
  const travel = Math.max(1, aboutScrollStory.offsetHeight - window.innerHeight);
  const progress = reducedMotion.matches ? 1 : clampUnit(-bounds.top / travel);
  aboutScrollStory.style.setProperty("--about-progress", progress.toFixed(3));
  aboutScrollStory.style.setProperty("--about-focus", phase(progress, .05, .25).toFixed(3));
  aboutScrollStory.style.setProperty("--about-growth", phase(progress, .28, .52).toFixed(3));
  aboutScrollStory.style.setProperty("--about-line", phase(progress, .52, .7).toFixed(3));
  aboutScrollStory.style.setProperty("--about-value", phase(progress, .7, .86).toFixed(3));
  aboutStage?.classList.toggle("is-about-focused", progress > .055);
  aboutStage?.classList.toggle("is-about-growing", progress > .28);
};

window.addEventListener("scroll", () => {
  if (aboutScrollFrame) return;
  aboutScrollFrame = requestAnimationFrame(updateAboutProgress);
}, { passive: true });
window.addEventListener("resize", updateAboutProgress, { passive: true });
updateAboutProgress();
updateObjectReveals();
document.fonts?.ready.then(updateAboutProgress);

aboutToggle?.addEventListener("click", () => {
  const opening = aboutNote?.hidden ?? false;
  if (!aboutNote) return;
  aboutNote.hidden = !opening;
  aboutStage?.classList.toggle("has-about-note", opening);
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
