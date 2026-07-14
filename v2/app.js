const workflowItems = [...document.querySelectorAll(".workflow-item")];
const workflowTriggers = workflowItems.map((item) => item.querySelector("[data-workflow-trigger]"));

function activateWorkflow(index, { focus = false } = {}) {
  const safeIndex = Math.max(0, Math.min(index, workflowItems.length - 1));

  workflowItems.forEach((item, itemIndex) => {
    const active = itemIndex === safeIndex;
    const panel = item.querySelector("[data-workflow-panel]");
    item.classList.toggle("is-active", active);
    workflowTriggers[itemIndex].setAttribute("aria-expanded", String(active));
    panel.setAttribute("aria-hidden", String(!active));
    panel.toggleAttribute("inert", !active);
  });

  if (focus) workflowTriggers[safeIndex].focus();
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

document.querySelectorAll("[data-accommodation-viewer]").forEach((viewer) => {
  const frame = viewer.querySelector("[data-accommodation-frame]");
  const status = viewer.querySelector("[data-accommodation-status]");
  const previousButton = viewer.querySelector("[data-accommodation-previous]");
  const nextButton = viewer.querySelector("[data-accommodation-next]");
  const frameSequences = viewer.dataset.frameSequences.split(",").map((entry) => {
    const [name, count] = entry.split(":");
    return { name, count: Number(count) };
  });
  const totalFrames = frameSequences.reduce((total, sequence) => total + sequence.count, 0);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;

  if (!frame || !status || !previousButton || !nextButton || !totalFrames) return;

  const resolveFrame = (globalIndex) => {
    let localIndex = Math.max(0, Math.min(globalIndex, totalFrames - 1));
    for (const sequence of frameSequences) {
      if (localIndex < sequence.count) return { sequence, localIndex };
      localIndex -= sequence.count;
    }
    return { sequence: frameSequences.at(-1), localIndex: frameSequences.at(-1).count - 1 };
  };

  const framePath = ({ sequence, localIndex }) =>
    `../assets/frames/accommodation/${sequence.name}/${String(localIndex + 1).padStart(3, "0")}.jpg`;

  const preloadNearby = (index) => {
    if (reducedMotion.matches) return;
    [-2, -1, 1, 2].forEach((offset) => {
      const image = new Image();
      image.src = framePath(resolveFrame(index + offset));
    });
  };

  const showFrame = (nextIndex) => {
    currentIndex = Math.max(0, Math.min(Math.round(nextIndex), totalFrames - 1));
    const target = resolveFrame(currentIndex);
    const source = framePath(target);
    const absoluteSource = new URL(source, document.baseURI).href;
    if (frame.src !== absoluteSource) frame.src = absoluteSource;
    viewer.dataset.sequence = target.sequence.name;
    viewer.dataset.frameIndex = String(currentIndex);
    status.textContent = `${target.sequence.name[0].toUpperCase()}${target.sequence.name.slice(1)} · frame ${currentIndex + 1} of ${totalFrames}`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === totalFrames - 1;
    preloadNearby(currentIndex);
  };

  viewer.addEventListener("wheel", (event) => {
    if (reducedMotion.matches) return;
    const primaryDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const deltaUnit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;
    const normalizedDelta = primaryDelta * deltaUnit;
    const direction = Math.sign(normalizedDelta);
    const atBoundary = (direction < 0 && currentIndex === 0) || (direction > 0 && currentIndex === totalFrames - 1);
    if (!direction || atBoundary) return;

    event.preventDefault();
    showFrame(currentIndex + direction);
  }, { passive: false });

  viewer.addEventListener("keydown", (event) => {
    const backward = ["ArrowLeft", "ArrowUp"].includes(event.key);
    const forward = ["ArrowRight", "ArrowDown"].includes(event.key);
    let nextIndex = currentIndex;

    if (backward) nextIndex -= 1;
    if (forward) nextIndex += 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = totalFrames - 1;
    nextIndex = Math.max(0, Math.min(nextIndex, totalFrames - 1));

    if ((backward || forward || event.key === "Home" || event.key === "End") && nextIndex !== currentIndex) {
      event.preventDefault();
      showFrame(nextIndex);
    }
  });

  previousButton.addEventListener("click", () => showFrame(currentIndex - 1));
  nextButton.addEventListener("click", () => showFrame(currentIndex + 1));

  showFrame(0);
});

const motionVideos = [...document.querySelectorAll("[data-motion-video]")];
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const motionButton = (video) => document.querySelector(`[data-motion-toggle][aria-controls="${video.id}"]`);

const syncMotionButton = (video) => {
  const button = motionButton(video);
  if (!button) return;
  const playing = !video.paused && !video.ended;
  const label = video.dataset.motionLabel || "showcase video";
  button.textContent = playing ? "Pause" : "Play";
  button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${label}`);
};

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
  } catch {
    syncMotionButton(video);
  }
};

motionVideos.forEach((video) => {
  const button = motionButton(video);
  video.addEventListener("play", () => syncMotionButton(video));
  video.addEventListener("pause", () => syncMotionButton(video));
  button?.addEventListener("click", async () => {
    if (!video.paused) {
      video.dataset.motionPausedByUser = "true";
      video.pause();
      return;
    }
    delete video.dataset.motionPausedByUser;
    await playMotionVideo(video);
  });
  syncMotionButton(video);
});

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        loadMotionVideo(video);
        if (video.dataset.motionPausedByUser !== "true") playMotionVideo(video);
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, { rootMargin: "120px 0px", threshold: 0.08 });
  motionVideos.forEach((video) => motionObserver.observe(video));
}

const biasSequence = document.querySelector("[data-bias-sequence]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

const aboutToggle = document.querySelector("[data-about-toggle]");
const aboutNote = document.querySelector("[data-about-note]");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitEmbed = portraitFrame?.querySelector("iframe");

portraitEmbed?.addEventListener("load", () => portraitFrame.classList.add("is-loaded"));

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
