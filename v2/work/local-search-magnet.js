const metricsUrl = "../../data/cool-runnings-metrics-current.json";

const formatDate = (isoDate) => new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date(`${isoDate}T12:00:00`));

const applyMetrics = (payload) => {
  const metrics = {
    ...payload.metrics?.searchConsole,
    ...payload.metrics?.ga4,
  };

  document.querySelectorAll("[data-cool-metric]").forEach((element) => {
    const value = metrics[element.dataset.coolMetric];
    if (!Number.isFinite(value)) return;
    element.textContent = `${new Intl.NumberFormat("en-CA").format(value)}${element.dataset.coolSuffix || ""}`;
  });

  const start = payload.windows?.searchConsole?.startDate;
  const end = payload.windows?.searchConsole?.endDate;
  const windowCopy = document.querySelector("[data-cool-metrics-window]");
  if (start && end && windowCopy) {
    windowCopy.textContent = `Google Search Console and GA4 · ${formatDate(start)} to ${formatDate(end)}.`;
  }
};

fetch(metricsUrl)
  .then((response) => {
    if (!response.ok) throw new Error(`Metrics request failed: ${response.status}`);
    return response.json();
  })
  .then(applyMetrics)
  .catch(() => {
    document.querySelector("[data-cool-metrics-window]")?.append(" Static verified snapshot shown.");
  });

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const reveals = [...document.querySelectorAll("[data-reveal]")];

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -8%" });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}
