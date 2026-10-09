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
