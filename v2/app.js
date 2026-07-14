const workflowItems = [...document.querySelectorAll(".workflow-item")];
const workflowTriggers = workflowItems.map((item) => item.querySelector("[data-workflow-trigger]"));

function activateWorkflow(index, { focus = false } = {}) {
  const safeIndex = Math.max(0, Math.min(index, workflowItems.length - 1));

  workflowItems.forEach((item, itemIndex) => {
    const active = itemIndex === safeIndex;
    item.classList.toggle("is-active", active);
    workflowTriggers[itemIndex].setAttribute("aria-expanded", String(active));
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

dashboardOpen?.addEventListener("click", () => dashboardDialog?.showModal());
dashboardClose?.addEventListener("click", () => dashboardDialog?.close());
dashboardDialog?.addEventListener("click", (event) => {
  if (event.target === dashboardDialog) dashboardDialog.close();
});
