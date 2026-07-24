const form = document.querySelector('[data-proposal-form]');
const addressField = document.querySelector('[data-address-field]');
const addressInput = form?.elements.address;
const results = document.querySelector('[data-address-results]');
const submitButton = form?.querySelector('button[type="submit"]');
const submitLabel = document.querySelector('[data-submit-label]');
const errorBox = document.querySelector('[data-proposal-error]');
const previewImage = document.querySelector('[data-proposal-preview-image]');
const loading = document.querySelector('[data-proposal-loading]');
const loadingMessage = document.querySelector('[data-loading-message]');
const previewState = document.querySelector('[data-preview-state]');
const previewActions = document.querySelector('[data-preview-actions]');
const openPdf = document.querySelector('[data-open-pdf]');
const downloadPdf = document.querySelector('[data-download-pdf]');
const emailBusiness = [...document.querySelectorAll('[data-email-business]')];
const emailIndustryTitles = [...document.querySelectorAll('[data-email-industry-title]')];
const emailIndustries = [...document.querySelectorAll('[data-email-industry]')];
const emailIndustryPlurals = [...document.querySelectorAll('[data-email-industry-plural]')];
const emailAudiences = [...document.querySelectorAll('[data-email-audience]')];
const emailLocations = [...document.querySelectorAll('[data-email-location]')];
const emailScreenCounts = [...document.querySelectorAll('[data-email-screen-count]')];
const proposalExplainer = document.querySelector('.proposal-explainer');
const proposalConnectors = document.querySelector('[data-proposal-connectors]');
const proposalTargets = [...document.querySelectorAll('[data-proposal-target]')];
const proposalCallouts = [...document.querySelectorAll('[data-proposal-callout]')];

let selectedAddress = null;
let suggestions = [];
let activeSuggestion = -1;
let suggestionTimer = 0;
let suggestionRequest = null;
let proposalUrl = '';
let generatedPreviewUrl = '';
let generatedScreenCount = null;
const PROPOSAL_BUNDLE_TYPE = 'application/vnd.michael.proposal-bundle';

const loadingSteps = [
  'Finding nearby elevator inventory.',
  'Creating an industry-specific campaign concept.',
  'Building the local market map.',
  'Assembling the presentation-ready PDF.',
];

const industryLanguage = {
  accountant: { title: 'accounting firm', place: 'firm', plural: 'accounting firms', audience: 'potential clients' },
  auto_dealer: { title: 'auto dealer', place: 'dealership', plural: 'auto dealers', audience: 'potential customers' },
  chiropractor: { title: 'chiropractor', place: 'practice', plural: 'chiropractors', audience: 'potential patients' },
  dentist: { title: 'dental practice', place: 'practice', plural: 'dental practices', audience: 'potential patients' },
  gym: { title: 'gym or fitness studio', place: 'business', plural: 'gyms and fitness studios', audience: 'potential members' },
  insurance: { title: 'insurance agency', place: 'agency', plural: 'insurance agencies', audience: 'potential clients' },
  lawyer: { title: 'law firm', place: 'firm', plural: 'law firms', audience: 'potential clients' },
  medical: { title: 'medical practice', place: 'practice', plural: 'medical practices', audience: 'potential patients' },
  optometrist: { title: 'optometrist', place: 'practice', plural: 'optometrists', audience: 'potential patients' },
  real_estate: { title: 'real estate business', place: 'business', plural: 'real estate businesses', audience: 'potential clients' },
  veterinarian: { title: 'veterinary practice', place: 'practice', plural: 'veterinary practices', audience: 'local pet owners' },
  other: { title: 'local business', place: 'business', plural: 'businesses', audience: 'potential customers' },
};

function setText(elements, text) {
  elements.forEach((element) => { element.textContent = text; });
}

function deriveLocalArea(fullAddress = '') {
  const parts = fullAddress.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[1];
  return fullAddress.trim() || '[Neighbourhood]';
}

function syncProposalConnectors() {
  if (!proposalExplainer || !proposalConnectors || matchMedia('(max-width: 700px)').matches) return;
  const explainerRect = proposalExplainer.getBoundingClientRect();
  if (!explainerRect.width || !explainerRect.height) return;

  proposalConnectors.setAttribute('viewBox', `0 0 ${explainerRect.width} ${explainerRect.height}`);
  proposalConnectors.setAttribute('width', String(explainerRect.width));
  proposalConnectors.setAttribute('height', String(explainerRect.height));

  proposalTargets.forEach((target) => {
    const key = target.dataset.proposalTarget;
    const callout = proposalCallouts.find((candidate) => candidate.dataset.proposalCallout === key);
    const path = proposalConnectors.querySelector(`[data-proposal-path="${key}"]`);
    if (!callout || !path) return;

    const targetRect = target.getBoundingClientRect();
    const calloutRect = callout.getBoundingClientRect();
    const startX = calloutRect.left - explainerRect.left;
    const startY = calloutRect.top + (calloutRect.height / 2) - explainerRect.top;
    const endX = targetRect.left + (targetRect.width / 2) - explainerRect.left;
    const endY = targetRect.top + (targetRect.height / 2) - explainerRect.top;
    const horizontalGap = Math.max(48, startX - endX);
    const firstControlX = startX - Math.min(110, horizontalGap * .42);
    const secondControlX = endX + Math.min(150, horizontalGap * .5);
    path.setAttribute('d', `M ${startX} ${startY} C ${firstControlX} ${startY}, ${secondControlX} ${endY}, ${endX} ${endY}`);
  });
}

function unpackProposalBundle(buffer) {
  if (buffer.byteLength < 5) throw new Error('The generated proposal response was incomplete.');
  const view = new DataView(buffer);
  const previewLength = view.getUint32(0);
  if (previewLength < 1 || previewLength > buffer.byteLength - 5) {
    throw new Error('The generated proposal preview was invalid.');
  }
  return {
    preview: new Blob([buffer.slice(4, 4 + previewLength)], { type: 'image/jpeg' }),
    pdf: new Blob([buffer.slice(4 + previewLength)], { type: 'application/pdf' }),
  };
}

function updateEmailPreview() {
  if (!form) return;
  const businessName = form.elements.businessName.value.trim() || '[Business name]';
  const type = form.elements.businessType.value;
  const language = industryLanguage[type] || {
    title: type ? form.elements.businessType.selectedOptions[0]?.textContent.toLowerCase() : '[Industry]',
    place: 'business',
    plural: 'businesses',
    audience: 'potential customers',
  };
  const location = deriveLocalArea(selectedAddress?.fullAddress || '');

  setText(emailBusiness, businessName);
  setText(emailIndustryTitles, language.title);
  setText(emailIndustries, language.place);
  setText(emailIndustryPlurals, language.plural);
  setText(emailAudiences, language.audience);
  setText(emailLocations, location);
  setText(emailScreenCounts, generatedScreenCount == null ? '[number of screens]' : String(generatedScreenCount));
}

function setError(message = '') {
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function updateSubmitState() {
  if (!submitButton || !form) return;
  const nameReady = form.elements.businessName.value.trim().length > 0;
  const typeReady = form.elements.businessType.value.length > 0;
  submitButton.disabled = !(selectedAddress && nameReady && typeReady);
}

function closeSuggestions() {
  if (!results || !addressInput) return;
  results.hidden = true;
  results.replaceChildren();
  addressInput.setAttribute('aria-expanded', 'false');
  addressInput.removeAttribute('aria-activedescendant');
  activeSuggestion = -1;
}

function chooseAddress(suggestion) {
  selectedAddress = suggestion;
  addressInput.value = suggestion.fullAddress;
  addressField.classList.add('is-selected');
  closeSuggestions();
  setError();
  updateSubmitState();
  updateEmailPreview();
}

function renderSuggestions(nextSuggestions) {
  suggestions = nextSuggestions;
  results.replaceChildren();
  if (!suggestions.length) return closeSuggestions();

  suggestions.forEach((suggestion, index) => {
    const item = document.createElement('li');
    item.setAttribute('role', 'option');
    item.id = `proposal-address-option-${index}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = suggestion.fullAddress;
    button.dataset.suggestionIndex = String(index);
    button.setAttribute('aria-selected', 'false');
    button.addEventListener('mousedown', (event) => event.preventDefault());
    button.addEventListener('click', () => chooseAddress(suggestion));
    item.append(button);
    results.append(item);
  });
  results.hidden = false;
  addressInput.setAttribute('aria-expanded', 'true');
}

function setActiveSuggestion(index) {
  if (!suggestions.length) return;
  activeSuggestion = (index + suggestions.length) % suggestions.length;
  const buttons = [...results.querySelectorAll('button')];
  buttons.forEach((button, buttonIndex) => button.setAttribute('aria-selected', String(buttonIndex === activeSuggestion)));
  const active = document.getElementById(`proposal-address-option-${activeSuggestion}`);
  addressInput.setAttribute('aria-activedescendant', active.id);
  active.scrollIntoView({ block: 'nearest' });
}

async function requestSuggestions(query) {
  suggestionRequest?.abort();
  suggestionRequest = new AbortController();
  try {
    const response = await fetch(`/api/proposal/suggest?q=${encodeURIComponent(query)}`, {
      signal: suggestionRequest.signal,
      headers: { Accept: 'application/json' },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Address lookup failed.');
    if (addressInput.value.trim() === query) renderSuggestions(payload.suggestions || []);
  } catch (error) {
    if (error.name === 'AbortError') return;
    closeSuggestions();
    setError(error.message || 'Address lookup failed.');
  }
}

addressInput?.addEventListener('input', () => {
  selectedAddress = null;
  addressField.classList.remove('is-selected');
  updateSubmitState();
  updateEmailPreview();
  clearTimeout(suggestionTimer);
  const query = addressInput.value.trim();
  if (query.length < 3) return closeSuggestions();
  suggestionTimer = window.setTimeout(() => requestSuggestions(query), 220);
});

addressInput?.addEventListener('keydown', (event) => {
  if (results.hidden || !suggestions.length) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActiveSuggestion(activeSuggestion + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveSuggestion(activeSuggestion - 1);
  } else if (event.key === 'Enter' && activeSuggestion >= 0) {
    event.preventDefault();
    chooseAddress(suggestions[activeSuggestion]);
  } else if (event.key === 'Escape') {
    closeSuggestions();
  }
});

document.addEventListener('click', (event) => {
  if (!addressField?.contains(event.target)) closeSuggestions();
});

form?.addEventListener('input', () => {
  generatedScreenCount = null;
  updateSubmitState();
  updateEmailPreview();
});

function startLoading() {
  loading.hidden = false;
  previewActions.hidden = true;
  previewState.textContent = 'Generating';
  submitButton.disabled = true;
  submitButton.classList.add('is-generating');
  submitLabel.textContent = 'Generating — should be ready in a few minutes.';
  let step = 0;
  loadingMessage.textContent = loadingSteps[step];
  return window.setInterval(() => {
    step = Math.min(step + 1, loadingSteps.length - 1);
    loadingMessage.textContent = loadingSteps[step];
  }, 24_000);
}

function finishLoading(timer) {
  window.clearInterval(timer);
  loading.hidden = true;
  submitButton.classList.remove('is-generating');
  submitLabel.textContent = 'Generate to complete';
  updateSubmitState();
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setError();
  if (!selectedAddress) {
    setError('Select a complete address from the suggestions.');
    addressInput.focus();
    return;
  }

  const timer = startLoading();
  try {
    const response = await fetch('/api/proposal/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: PROPOSAL_BUNDLE_TYPE },
      body: JSON.stringify({
        businessName: form.elements.businessName.value.trim(),
        businessType: form.elements.businessType.value,
        address: selectedAddress.fullAddress,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Proposal generation failed.');
    }

    const responseType = response.headers.get('content-type') || '';
    const generated = responseType.includes(PROPOSAL_BUNDLE_TYPE)
      ? unpackProposalBundle(await response.arrayBuffer())
      : { pdf: await response.blob(), preview: null };
    if (proposalUrl) URL.revokeObjectURL(proposalUrl);
    if (generatedPreviewUrl) URL.revokeObjectURL(generatedPreviewUrl);
    proposalUrl = URL.createObjectURL(generated.pdf);
    if (generated.preview && previewImage) {
      generatedPreviewUrl = URL.createObjectURL(generated.preview);
      previewImage.src = generatedPreviewUrl;
      previewImage.alt = `${form.elements.businessName.value.trim()} generated elevator advertising proposal preview`;
    }
    const disposition = response.headers.get('content-disposition') || '';
    const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || 'elevator-advertising-proposal.pdf';
    const screenCount = Number.parseInt(response.headers.get('x-proposal-screen-count') || '', 10);
    if (Number.isFinite(screenCount) && screenCount > 0) {
      generatedScreenCount = screenCount;
      updateEmailPreview();
    }

    openPdf.href = proposalUrl;
    downloadPdf.href = proposalUrl;
    downloadPdf.download = filename;
    previewActions.hidden = false;
    previewState.textContent = 'Generated proposal';
  } catch (error) {
    previewState.textContent = 'Approved sample';
    setError(error.message || 'Proposal generation failed.');
  } finally {
    finishLoading(timer);
  }
});

window.addEventListener('beforeunload', () => {
  if (proposalUrl) URL.revokeObjectURL(proposalUrl);
  if (generatedPreviewUrl) URL.revokeObjectURL(generatedPreviewUrl);
});

if (proposalExplainer && proposalConnectors) {
  const scheduleConnectorSync = () => window.requestAnimationFrame(syncProposalConnectors);
  const connectorResizeObserver = 'ResizeObserver' in window
    ? new ResizeObserver(scheduleConnectorSync)
    : null;
  connectorResizeObserver?.observe(proposalExplainer);
  proposalTargets.forEach((target) => connectorResizeObserver?.observe(target));
  document.querySelector('.proposal-preview__sample')?.addEventListener('load', scheduleConnectorSync);
  window.addEventListener('resize', scheduleConnectorSync, { passive: true });
  scheduleConnectorSync();
}

updateEmailPreview();
