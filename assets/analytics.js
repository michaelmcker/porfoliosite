(() => {
const measurementId = "G-EJ6ZTQDK09";
const production = ["michaelmck.site", "www.michaelmck.site"].includes(window.location.hostname);
window[`ga-disable-${measurementId}`] = !production;
if (!production) {
  window.gtag = () => {};
  return;
}

// Keep campaign context through the visit without collecting form contents.
const acquisitionKey = "portfolio_acquisition_v1";
const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];
const query = new URLSearchParams(window.location.search);
const touch = { landing_path: window.location.pathname };
for (const key of keys) if (query.has(key)) touch[key] = query.get(key).slice(0, 200);
try { if (document.referrer) touch.referrer_host = new URL(document.referrer).hostname; } catch {}
let previous;
try {
  const stored = JSON.parse(window.sessionStorage.getItem(acquisitionKey));
  if (stored && Date.now() - stored.saved_at < 86400000 && stored.saved_at <= Date.now()) previous = stored;
} catch {}
const tagged = keys.some(key => Object.hasOwn(touch, key));
const acquisition = previous || { saved_at: Date.now(), first: touch, last: touch };
if (tagged) acquisition.last = touch;
window.portfolioAttribution = acquisition;
try { window.sessionStorage.setItem(acquisitionKey, JSON.stringify(acquisition)); } catch {}

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() {
  window.dataLayer.push(arguments);
};

window.gtag("js", new Date());
window.gtag("config", "G-EJ6ZTQDK09", {
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});

// Generated standalone pages also need the tag loader, not only a queued config.
if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=G-EJ6ZTQDK09";
  document.head.append(tag);
}
})();
