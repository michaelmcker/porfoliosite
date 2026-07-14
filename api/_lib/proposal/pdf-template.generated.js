const USERS_ROUND = {
  name: "users-round",
  paths: '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>'
};
const HEART_HANDSHAKE = {
  name: "heart-handshake",
  paths: '<path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"/>'
};
const CHART_COMBINED = {
  name: "chart-no-axes-combined",
  paths: '<path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/>'
};
const CLOCK_THREE = {
  name: "clock-3",
  paths: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6h4"/>'
};
const SEND = {
  name: "send",
  paths: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'
};
const PROOF_ICONS = [USERS_ROUND, HEART_HANDSHAKE, CHART_COMBINED, CLOCK_THREE];
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function formatCompact(value) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1).replace(".0", "")}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1).replace(".0", "")}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1).replace(".0", "")}K`;
  return Math.round(value).toLocaleString("en-US");
}
function renderIcon(icon, proof = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-lucide="${icon.name}"${proof ? ` data-proof-icon="${icon.name}"` : ""}>${icon.paths}</svg>`;
}
function renderHeadline(rawHeadline, buildings) {
  const phrase = `${buildings} Buildings`;
  const index = rawHeadline.toLocaleLowerCase().indexOf(phrase.toLocaleLowerCase());
  if (index === -1) return escapeHtml(rawHeadline);
  return [
    escapeHtml(rawHeadline.slice(0, index)),
    `<span>${escapeHtml(rawHeadline.slice(index, index + phrase.length))}</span>`,
    escapeHtml(rawHeadline.slice(index + phrase.length))
  ].join("");
}
function fontFace(name, dataUrl, weight, format) {
  if (!dataUrl) return "";
  return `@font-face { font-family: '${name}'; src: url('${escapeHtml(dataUrl)}') format('${format}'); font-style: normal; font-weight: ${weight}; font-display: swap; }`;
}
function renderPublicProposalHtml(data) {
  const businessName = escapeHtml(data.businessName);
  const mockup = escapeHtml(data.compositeDataUrl);
  const map = escapeHtml(data.mapDataUrl);
  const logo = escapeHtml(data.logoDataUrl);
  const repName = escapeHtml(data.repName || "Sales Representative");
  const repTitle = escapeHtml(data.repTitle || "Account Executive");
  const repPhone = escapeHtml(data.repPhone || "(000) 000-0000");
  const repEmail = escapeHtml(data.repEmail || "hello@verticalimpression.com");
  const repPhoto = data.repPhotoDataUrl ? escapeHtml(data.repPhotoDataUrl) : "";
  const headline = renderHeadline(
    data.proposalCopy.headline.replaceAll("{{screens}}", String(data.buildings)),
    data.buildings
  );
  const icons = PROOF_ICONS;
  const valueProps = data.proposalCopy.valueProps.slice(0, 4).map((value, index) => `
    <div class="proof-row">
      <div class="proof-icon">${renderIcon(icons[index], true)}</div>
      <div class="proof-copy">
        <h3>${escapeHtml(value)}</h3>
      </div>
    </div>`).join("");
  const fontFaces = [
    fontFace("Proposal Sans", data.bodyFontRegularDataUrl, 400, "opentype"),
    fontFace("Proposal Sans", data.bodyFontSemiboldDataUrl, 600, "opentype"),
    fontFace("Proposal Sans", data.bodyFontBoldDataUrl, 700, "opentype")
  ].join("\n");
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Digital out-of-home proposal for ${businessName}</title><style>
@page { size: 8.5in 11in; margin: 0; }
${fontFaces}
:root { --navy: #071b43; --navy-deep: #041535; --teal: #14b8b0; --paper: #f7f8f7; --ink: #071b43; }
* { box-sizing: border-box; }
html, body { width: 8.5in; height: 11in; margin: 0; }
body { color: var(--ink); background: var(--paper); font-family: 'Proposal Sans', Arial, sans-serif; }
.page { width: 8.5in; height: 11in; overflow: hidden; background: var(--paper); }
.proposal-page--dark { display: grid; grid-template-rows: 6.32in 3.5in 1.18in; }
.proposal-hero { padding: 0 .36in .24in; color: #fff; background: var(--navy); }
.top { height: .7in; margin: 0 -.36in .12in; padding: .13in .36in .1in; display: flex; align-items: center; justify-content: space-between; }
.top-band { background: var(--navy-deep); border-bottom: 1px solid rgba(255,255,255,.13); }
.brand img { display: block; width: 1.52in; height: .43in; object-fit: contain; object-position: left top; }
.client { max-width: 3.15in; text-align: right; text-transform: uppercase; }
.client strong, .client span { display: block; }
.client strong { color: var(--teal); font-size: 10px; font-weight: 700; letter-spacing: .08em; }
.client span { margin-top: 5px; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .025em; }
h1 { max-width: 7.25in; margin: .08in 0 .18in; font-family: 'Proposal Sans', Arial, sans-serif; font-size: 39px; font-weight: 700; line-height: .98; letter-spacing: 0; text-wrap: balance; }
h1 span { color: var(--teal); white-space: nowrap; }
.campaign-proof { display: grid; grid-template-columns: minmax(0, 4.78in) minmax(0, 1fr); gap: .3in; height: 4.02in; }
.creative-frame { width: 100%; height: 100%; overflow: hidden; border: 1px solid rgba(255,255,255,.16); border-radius: 6px; background: #d5d8db; }
.creative-frame img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 40%; transform: scale(1.06); }
.proof-list { min-width: 0; padding-top: .01in; }
.proof-heading { height: .3in; color: var(--teal); font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.proof-row { min-height: .93in; padding: .12in 0 .1in; display: grid; grid-template-columns: .42in minmax(0, 1fr); gap: .1in; align-items: center; border-bottom: 1px solid rgba(255,255,255,.22); }
.proof-row:first-of-type { padding-top: .08in; }
.proof-row:last-child { border-bottom: 0; }
.proof-icon { color: var(--teal); }
.proof-icon svg { display: block; width: .32in; height: .32in; }
.proof-copy h3 { margin: 0; color: #fff; font-size: 10.5px; font-weight: 700; line-height: 1.24; text-transform: uppercase; }
.evidence { padding: .24in .36in .2in; display: grid; grid-template-columns: 1.78in minmax(0, 1fr); gap: .28in; background: var(--paper); }
.stats { padding: 0 .2in 0 0; display: flex; flex-direction: column; justify-content: center; text-align: center; border-right: 1px solid #9aa4af; }
.stat { padding: .12in .03in .15in; border-bottom: 1.5px solid var(--teal); }
.stat:last-child { border-bottom: 0; }
.stat strong { display: block; font-family: 'Proposal Sans', Arial, sans-serif; font-size: 39px; font-weight: 700; line-height: .96; }
.stat span, .stat small { display: block; text-transform: uppercase; }
.stat span { margin-top: 5px; color: var(--teal); font-size: 8.5px; font-weight: 700; letter-spacing: .12em; }
.stat small { margin-top: 3px; color: #526177; font-size: 6.8px; font-weight: 600; letter-spacing: .08em; line-height: 1.25; }
.map-panel { position: relative; min-width: 0; height: 3.06in; align-self: center; overflow: hidden; background: #e9edef; }
.map-panel img { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.78) contrast(.98); }
.map-panel::before, .map-panel::after { content: ''; position: absolute; left: 51%; top: 52%; z-index: 1; border: 1px solid rgba(20,184,176,.42); border-radius: 50%; transform: translate(-50%, -50%); }
.map-panel::before { width: .62in; height: .62in; }
.map-panel::after { width: .94in; height: .94in; border-color: rgba(20,184,176,.2); }
.map-legend { position: absolute; right: .12in; top: .12in; z-index: 3; padding: .08in .11in; display: flex; gap: .15in; color: var(--ink); background: rgba(255,255,255,.94); border: 1px solid rgba(7,27,67,.1); border-radius: 4px; font-size: 7.5px; font-weight: 600; }
.legend-item { display: flex; align-items: center; gap: 5px; white-space: nowrap; }
.legend-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--navy); }
.legend-dot--business { width: 9px; height: 9px; background: var(--teal); box-shadow: 0 0 0 2px rgba(20,184,176,.2); }
.footer { padding: .15in .36in; display: grid; grid-template-columns: .62in minmax(0, 1fr) auto; gap: .16in; align-items: center; color: #fff; background: #079c9b; }
.rep-photo { width: .58in; height: .58in; display: grid; place-items: center; overflow: hidden; border: 1px solid rgba(255,255,255,.75); border-radius: 50%; background: rgba(4,21,53,.16); }
.rep-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
.rep-photo svg { display: block; width: .29in; height: .29in; color: #fff; }
.rep-details h2 { margin: 0 0 3px; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .025em; }
.rep-details p { margin: 0 0 3px; color: rgba(255,255,255,.96); font-size: 8px; line-height: 1.25; }
.rep-details a { color: #fff; font-size: 8.5px; font-weight: 600; text-decoration: none; }
.footer-contact { display: inline-flex; align-items: center; gap: .08in; padding: .09in .13in; color: #fff; border: 1px solid rgba(255,255,255,.72); border-radius: 5px; font-size: 8.7px; font-weight: 700; letter-spacing: .035em; text-decoration: none; white-space: nowrap; }
.footer-contact svg { width: .18in; height: .18in; }
</style></head><body><main class="page proposal-page--dark">
  <section class="proposal-hero">
    <header class="top top-band">
      <div class="brand"><img src="${logo}" alt="Vertical Impression"></div>
      <div class="client"><strong>Elevator advertising opportunity</strong><span>For ${businessName}</span></div>
    </header>
    <h1>${headline}</h1>
    <section class="campaign-proof">
      <div class="creative-frame"><img src="${mockup}" alt="Generated elevator advertising mockup"></div>
      <div class="proof-list"><div class="proof-heading">Why this works</div>${valueProps}</div>
    </section>
  </section>
  <section class="evidence">
    <div class="stats">
      <div class="stat"><strong>${data.screens}</strong><span>Screens</span></div>
      <div class="stat"><strong>${formatCompact(data.monthlyImpressions)}</strong><span>Monthly impressions</span></div>
      <div class="stat"><strong>$70</strong><span>Per screen</span><small>Per month</small></div>
    </div>
    <div class="map-panel"><img src="${map}" alt="Map of nearby elevator screens"><div class="map-legend"><span class="legend-item"><span class="legend-dot legend-dot--business"></span>Your Business</span><span class="legend-item"><span class="legend-dot"></span>Screens</span></div></div>
  </section>
  <footer class="footer">
    <div class="rep-photo">${repPhoto ? `<img src="${repPhoto}" alt="${repName}">` : renderIcon(USERS_ROUND)}</div>
    <div class="rep-details"><h2>${repName}</h2><p>${repTitle} &nbsp;|&nbsp; ${repPhone}</p><a href="mailto:${repEmail}">${repEmail}</a></div>
    <a class="footer-contact" href="mailto:${repEmail}">${renderIcon(SEND)}<span>Contact a sales person</span></a>
  </footer>
</main></body></html>`;
}
export {
  renderPublicProposalHtml
};
