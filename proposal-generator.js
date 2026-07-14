const form = document.querySelector('[data-proposal-form]');
const addressField = document.querySelector('[data-address-field]');
const addressInput = form?.elements.address;
const results = document.querySelector('[data-address-results]');
const submitButton = form?.querySelector('button[type="submit"]');
const submitLabel = document.querySelector('[data-submit-label]');
const errorBox = document.querySelector('[data-proposal-error]');
const frame = document.querySelector('[data-proposal-frame]');
const loading = document.querySelector('[data-proposal-loading]');
const loadingMessage = document.querySelector('[data-loading-message]');
const previewState = document.querySelector('[data-preview-state]');
const previewActions = document.querySelector('[data-preview-actions]');
const openPdf = document.querySelector('[data-open-pdf]');
const downloadPdf = document.querySelector('[data-download-pdf]');

let selectedAddress = null;
let suggestions = [];
let activeSuggestion = -1;
let suggestionTimer = 0;
let suggestionRequest = null;
let proposalUrl = '';

const loadingSteps = [
  'Finding nearby elevator inventory.',
  'Creating an industry-specific campaign concept.',
  'Building the local market map.',
  'Assembling the presentation-ready PDF.',
];

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

form?.addEventListener('input', updateSubmitState);

function startLoading() {
  loading.hidden = false;
  previewActions.hidden = true;
  previewState.textContent = 'Generating';
  submitButton.disabled = true;
  submitLabel.textContent = 'Generating proposal';
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
      headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' },
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

    const pdf = await response.blob();
    if (proposalUrl) URL.revokeObjectURL(proposalUrl);
    proposalUrl = URL.createObjectURL(pdf);
    const disposition = response.headers.get('content-disposition') || '';
    const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || 'elevator-advertising-proposal.pdf';

    frame.src = `${proposalUrl}#view=FitH&toolbar=0`;
    openPdf.href = proposalUrl;
    downloadPdf.href = proposalUrl;
    downloadPdf.download = filename;
    previewActions.hidden = false;
    previewState.textContent = 'Generated proposal';
    frame.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  } catch (error) {
    previewState.textContent = 'Approved sample';
    setError(error.message || 'Proposal generation failed.');
  } finally {
    finishLoading(timer);
  }
});

window.addEventListener('beforeunload', () => {
  if (proposalUrl) URL.revokeObjectURL(proposalUrl);
});
