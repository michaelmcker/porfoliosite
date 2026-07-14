const revealTargets = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-visible", "");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${Math.min(index * 55, 260)}ms`);
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.setAttribute("data-visible", ""));
}

const workflowTabs = document.querySelectorAll("[data-workflow-tab]");
const workflowPanels = document.querySelectorAll("[data-workflow-panel]");
const workflowReferencePage = document.querySelector(".workflow-reference-page");
const workflowReferenceStage = document.querySelector(".workflow-reference-stage");

const positionWorkflowStage = (activeTab) => {
  if (!workflowReferencePage || !workflowReferenceStage || !activeTab) return;
  workflowReferencePage.append(workflowReferenceStage);
};

workflowTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.workflowTab;
    workflowTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    workflowPanels.forEach((panel) => {
      const active = panel.dataset.workflowPanel === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    positionWorkflowStage(tab);
  });
});

positionWorkflowStage(document.querySelector("[data-workflow-tab].is-active"));
window.addEventListener("resize", () => {
  positionWorkflowStage(document.querySelector("[data-workflow-tab].is-active"));
});

const workCarousel = document.querySelector("[data-work-carousel]");
const workSlides = [...document.querySelectorAll("[data-work-slide]")];
const workPrevious = document.querySelector("[data-work-previous]");
const workNext = document.querySelector("[data-work-next]");
const workPosition = document.querySelector("[data-work-position]");
let activeWorkSlide = 0;
let workScrollFrame = 0;

const updateWorkPosition = (index) => {
  activeWorkSlide = Math.max(0, Math.min(index, workSlides.length - 1));
  if (workPosition) workPosition.textContent = `${activeWorkSlide + 1} / ${workSlides.length}`;
};

const scrollToWorkSlide = (index) => {
  if (!workCarousel || !workSlides.length) return;
  const nextIndex = Math.max(0, Math.min(index, workSlides.length - 1));
  const slide = workSlides[nextIndex];
  workCarousel.scrollTo({
    left: slide.offsetLeft - workCarousel.offsetLeft - Math.max(0, (workCarousel.clientWidth - slide.clientWidth) / 2),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
  updateWorkPosition(nextIndex);
};

workPrevious?.addEventListener("click", () => scrollToWorkSlide(activeWorkSlide - 1));
workNext?.addEventListener("click", () => scrollToWorkSlide(activeWorkSlide + 1));

workCarousel?.addEventListener("scroll", () => {
  cancelAnimationFrame(workScrollFrame);
  workScrollFrame = requestAnimationFrame(() => {
    const carouselCenter = workCarousel.scrollLeft + workCarousel.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    workSlides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft - workCarousel.offsetLeft + slide.clientWidth / 2;
      const distance = Math.abs(carouselCenter - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    updateWorkPosition(closestIndex);
  });
}, { passive: true });

document.querySelectorAll("[data-accommodation-scroll]").forEach((showcase) => {
  const frame = showcase.querySelector("[data-accommodation-frame]");
  const driver = showcase.querySelector("[data-accommodation-driver]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sequences = [
    { name: "overview", count: 17 },
    { name: "treehouse", count: 28 },
    { name: "cabin", count: 24 },
  ];
  const totalFrames = sequences.reduce((sum, sequence) => sum + sequence.count, 0);
  let renderFrame = 0;
  let currentIndex = 0;

  if (!frame || !driver) return;

  const framePath = (sequence, index) => `assets/frames/accommodation/${sequence.name}/${String(index + 1).padStart(3, "0")}.jpg`;

  const resolveFrame = (globalIndex) => {
    let index = Math.max(0, Math.min(globalIndex, totalFrames - 1));
    for (const sequence of sequences) {
      if (index < sequence.count) return { sequence, index };
      index -= sequence.count;
    }
    return { sequence: sequences.at(-1), index: sequences.at(-1).count - 1 };
  };

  const preloadAround = (globalIndex) => {
    [-2, -1, 1, 2].forEach((offset) => {
      const target = resolveFrame(globalIndex + offset);
      const image = new Image();
      image.src = framePath(target.sequence, target.index);
    });
  };

  const showFrame = (globalIndex) => {
    renderFrame = 0;
    currentIndex = Math.max(0, Math.min(Math.round(globalIndex), totalFrames - 1));
    const target = resolveFrame(currentIndex);
    const source = framePath(target.sequence, target.index);
    if (!frame.src.endsWith(source)) frame.src = source;
    showcase.dataset.sequence = target.sequence.name;
    showcase.dataset.frame = String(target.index + 1);
    preloadAround(currentIndex);
  };

  const renderFromDriver = () => {
    const maxScroll = Math.max(1, driver.scrollHeight - driver.clientHeight);
    showFrame((driver.scrollTop / maxScroll) * (totalFrames - 1));
  };

  driver?.addEventListener("scroll", () => {
    if (reduced.matches) return;
    if (!renderFrame) renderFrame = requestAnimationFrame(renderFromDriver);
  }, { passive: true });

  showcase.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "PageDown", "ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) return;
    const direction = ["ArrowDown", "ArrowRight", "PageDown"].includes(event.key) ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(totalFrames - 1, currentIndex + direction * 4));
    if (nextIndex !== currentIndex) {
      driver.scrollTop = (nextIndex / (totalFrames - 1)) * (driver.scrollHeight - driver.clientHeight);
      showFrame(nextIndex);
      event.preventDefault();
    }
  });

  showFrame(0);
});

const dashboardModal = document.querySelector("#dashboard-modal");
const dashboardOpeners = document.querySelectorAll("[data-open-dashboard]");
const dashboardCloser = document.querySelector("[data-close-dashboard]");

dashboardOpeners.forEach((button) => {
  button.addEventListener("click", () => dashboardModal?.showModal());
});

dashboardCloser?.addEventListener("click", () => dashboardModal?.close());
dashboardModal?.addEventListener("click", (event) => {
  if (event.target === dashboardModal) dashboardModal.close();
});

const workflowImageModal = document.querySelector("#workflow-image-modal");
const workflowImageModalImage = workflowImageModal?.querySelector("img");
const workflowImageCloser = document.querySelector("[data-close-workflow-image]");

document.querySelectorAll("[data-expand-workflow]").forEach((button) => {
  button.addEventListener("click", () => {
    const sourceImage = button.closest(".workflow-panel-image")?.querySelector("img");
    if (!sourceImage || !workflowImageModal || !workflowImageModalImage) return;
    workflowImageModalImage.src = sourceImage.currentSrc || sourceImage.src;
    workflowImageModalImage.alt = sourceImage.alt;
    workflowImageModal.showModal();
  });
});

workflowImageCloser?.addEventListener("click", () => workflowImageModal.close());
workflowImageModal?.addEventListener("click", (event) => {
  if (event.target === workflowImageModal) workflowImageModal.close();
});

const aboutProfile = document.querySelector("[data-about-profile]");
const aboutInner = aboutProfile?.querySelector(".about-profile__inner");
const aboutPhrase = document.querySelector("[data-about-phrase]");
const aboutEcho = document.querySelector("[data-about-echo]");
const aboutLearning = document.querySelector("[data-about-learning]");
const aboutEasterToggle = document.querySelector("[data-about-easter-toggle]");
const aboutEaster = document.querySelector("[data-about-easter]");
const portraitFrame = document.querySelector(".about-profile__media iframe");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let portraitTrackingActive = false;
let portraitPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let portraitPointerFrame = 0;

const sendPortraitPointer = () => {
  portraitPointerFrame = 0;
  if (!portraitFrame || !portraitTrackingActive) return;
  const rect = portraitFrame.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const normalizedX = (portraitPointer.x - (rect.left + rect.width / 2)) / (rect.width / 2);
  const normalizedY = (portraitPointer.y - (rect.top + rect.height / 2)) / (rect.height / 2);
  const clampUnit = (value) => Math.max(0, Math.min(1, (value + 1) / 2));

  portraitFrame.contentWindow?.postMessage({
    type: "portrait-gaze",
    x: clampUnit(normalizedX),
    y: clampUnit(normalizedY),
  }, "*");
};

const requestPortraitPointer = () => {
  if (!portraitPointerFrame) portraitPointerFrame = requestAnimationFrame(sendPortraitPointer);
};

window.addEventListener("pointermove", (event) => {
  portraitPointer = { x: event.clientX, y: event.clientY };
  requestPortraitPointer();
}, { passive: true });

window.addEventListener("pointerdown", (event) => {
  portraitPointer = { x: event.clientX, y: event.clientY };
  requestPortraitPointer();
}, { passive: true });

window.addEventListener("resize", requestPortraitPointer);

if (portraitFrame) {
  new IntersectionObserver(([entry]) => {
    portraitTrackingActive = entry.isIntersecting;
    if (portraitTrackingActive) requestPortraitPointer();
  }, { rootMargin: "12% 0px" }).observe(portraitFrame);

  portraitFrame.addEventListener("load", requestPortraitPointer);
}

let aboutScrollFrame = 0;
const updateAboutProgress = () => {
  if (!aboutProfile) return;
  if (reducedMotion.matches) {
    aboutProfile.style.removeProperty("--about-progress");
    aboutProfile.style.removeProperty("--about-copy-opacity");
    aboutProfile.style.removeProperty("--about-portrait-scale");
    aboutProfile.style.removeProperty("--about-arrow-progress");
    aboutProfile.style.removeProperty("--about-learning-progress");
    aboutProfile.style.removeProperty("--about-button-progress");
    aboutPhrase?.style.removeProperty("--about-inline-opacity");
    aboutEcho?.removeAttribute("style");
    return;
  }
  const rect = aboutProfile.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const phase = (start, end) => clamp((progress - start) / (end - start));
  const copyOpacity = 1 - phase(0.18, 0.36);
  const breakout = phase(0.24, 0.50);
  const arrowProgress = phase(0.53, 0.65);
  const learningProgress = phase(0.68, 0.80);
  const buttonProgress = phase(0.84, 0.94);

  aboutProfile.style.setProperty("--about-progress", progress.toFixed(3));
  aboutProfile.style.setProperty("--about-copy-opacity", copyOpacity.toFixed(3));
  aboutProfile.style.setProperty("--about-portrait-scale", (1 - breakout * 0.56).toFixed(3));
  aboutProfile.style.setProperty("--about-arrow-progress", arrowProgress.toFixed(3));
  aboutProfile.style.setProperty("--about-learning-progress", learningProgress.toFixed(3));
  aboutProfile.style.setProperty("--about-button-progress", buttonProgress.toFixed(3));

  if (aboutInner && aboutPhrase && aboutEcho) {
    const innerRect = aboutInner.getBoundingClientRect();
    const sourceRect = aboutPhrase.getBoundingClientRect();
    const sourceStyle = getComputedStyle(aboutPhrase);
    const startLeft = sourceRect.left - innerRect.left;
    const startTop = sourceRect.top - innerRect.top;
    const startWidth = sourceRect.width;
    const startFont = Number.parseFloat(sourceStyle.fontSize);
    const startLineHeight = Number.parseFloat(sourceStyle.lineHeight);
    const mobile = innerRect.width <= 600;
    const tablet = innerRect.width <= 980;
    const compactDesktop = innerRect.width <= 1120;
    const endLeft = mobile ? 24 : tablet ? 48 : clamp(innerRect.width * 0.07, 54, 108);
    const endTop = innerRect.height * (mobile ? 0.43 : tablet ? 0.45 : 0.46);
    const endWidth = mobile
      ? innerRect.width - 48
      : tablet
        ? Math.min(innerRect.width * 0.54, 460)
        : compactDesktop
          ? innerRect.width * 0.44
          : Math.min(680, innerRect.width * 0.48);
    const endFont = mobile
      ? clamp(innerRect.width * 0.13, 44, 58)
      : tablet
        ? clamp(innerRect.width * 0.085, 56, 78)
        : clamp(innerRect.width * 0.068, 62, 108);
    const endLineHeight = endFont * 0.88;
    const mix = (start, end) => start + (end - start) * breakout;

    const breakoutActive = breakout > 0.001;
    aboutPhrase.style.setProperty("--about-inline-opacity", breakoutActive ? "0" : "1");
    Object.assign(aboutEcho.style, {
      left: `${mix(startLeft, endLeft)}px`,
      top: `${mix(startTop, endTop)}px`,
      width: `${mix(startWidth, endWidth)}px`,
      fontSize: `${mix(startFont, endFont)}px`,
      lineHeight: `${mix(startLineHeight, endLineHeight)}px`,
      opacity: breakoutActive ? "1" : "0",
    });
  }
};

const requestAboutProgress = () => {
  cancelAnimationFrame(aboutScrollFrame);
  aboutScrollFrame = requestAnimationFrame(updateAboutProgress);
};

window.addEventListener("scroll", requestAboutProgress, { passive: true });
window.addEventListener("resize", requestAboutProgress);
reducedMotion.addEventListener?.("change", requestAboutProgress);
updateAboutProgress();

aboutEasterToggle?.addEventListener("click", () => {
  if (!aboutEaster) return;
  const opening = aboutEaster.hidden;
  aboutEaster.hidden = !opening;
  aboutProfile?.classList.toggle("is-easter-open", opening);
  aboutEasterToggle.setAttribute("aria-expanded", String(opening));
  aboutEasterToggle.textContent = opening
    ? "Close build note"
    : "How this unnecessary thing was made";
});

const coolMetricsEndpoints = ["data/cool-runnings-metrics-current.json"];
const coolMetricNodes = document.querySelectorAll("[data-cool-metric]");
const coolProof = document.querySelector("[data-cool-runnings-proof]");
const coolMetricsWindow = document.querySelector("[data-cool-metrics-window]");

if (coolMetricNodes.length || coolProof) {
  const loadMetrics = async () => {
    for (const endpoint of coolMetricsEndpoints) {
      try {
        const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
        if (response.ok) return response.json();
      } catch {
        // Try the checked-in, connector-verified snapshot next.
      }
    }
    throw new Error("Metrics unavailable");
  };

  loadMetrics()
    .then((snapshot) => {
      const metrics = snapshot?.metrics?.searchConsole;
      const gbpMetrics = snapshot?.metrics?.googleBusinessProfile;
      const ga4Metrics = snapshot?.metrics?.ga4;
      const windowDates = snapshot?.windows?.searchConsole;
      if (!metrics || snapshot?.update?.state === "unavailable") return;

      const format = new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 });
      coolMetricNodes.forEach((node) => {
        const source = node.dataset.coolSource === "googleBusinessProfile"
          ? gbpMetrics
          : node.dataset.coolSource === "ga4"
            ? ga4Metrics
            : metrics;
        const value = source?.[node.dataset.coolMetric];
        if (Number.isFinite(value)) {
          node.textContent = `${format.format(value)}${node.dataset.coolSuffix || ""}`;
          node.closest(".cr-result")?.classList.remove("cr-result--pending");
        }
      });

      if (coolProof) {
        coolProof.textContent = `${format.format(metrics.clicks)} organic clicks in the latest 28 days · ${format.format(metrics.pageRowsPosition1To10)} pages averaging page one`;
      }

      if (coolMetricsWindow && windowDates?.startDate && windowDates?.endDate) {
        const refreshedDate = snapshot.update?.generatedAt
          ? new Intl.DateTimeFormat("en-CA", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Vancouver",
        }).format(new Date(snapshot.update.generatedAt))
          : "July 13, 2026";
        coolMetricsWindow.textContent = `Google Search Console and GA4. Latest 28 days. Last refreshed ${refreshedDate}. The action total is a verified minimum until direct Business Profile reporting is connected.`;
      }
    })
    .catch(() => {
      // The checked-in figures remain visible until the first authorized daily snapshot exists.
    });
}
