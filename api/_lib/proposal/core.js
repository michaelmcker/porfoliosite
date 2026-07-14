import { generateAdPrompt } from './prompt.js';
import { getIndustryConfig, INDUSTRY_OPTIONS, PROPOSAL_COPY } from './industry-config.js';

const BUSINESS_TYPES = new Set(INDUSTRY_OPTIONS.map(({ id }) => id));
const PRICE_PER_SCREEN = 70;
const MIN_MONTHLY_SPEND = 1_000;
const LOCAL_LOOP_SHARE = 1 / 12;

export function validateProposalInput(input = {}) {
  const businessName = String(input.businessName || '').trim();
  const address = String(input.address || '').trim();
  const businessType = String(input.businessType || '').trim().toLowerCase();

  if (!businessName || businessName.length > 80) {
    throw new Error('Business name must be between 1 and 80 characters.');
  }
  if (!address || address.length > 180) {
    throw new Error('Select a complete address from the suggestions.');
  }
  if (!BUSINESS_TYPES.has(businessType)) {
    throw new Error('Choose a supported business type.');
  }

  return { businessName, address, businessType };
}

export function distanceMiles(origin, target) {
  const toRad = (degrees) => degrees * Math.PI / 180;
  const dLat = toRad(target.lat - origin.lat);
  const dLng = toRad(target.lng - origin.lng);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(origin.lat)) * Math.cos(toRad(target.lat)) * Math.sin(dLng / 2) ** 2;
  return 3959 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function selectInventoryPackage(items, industry) {
  const { radiusMiles } = getIndustryConfig(industry);
  const sorted = items
    .map((item) => ({
      ...item,
      screenCount: Number(item.screenCount) > 0 ? Number(item.screenCount) : 1,
      monthlyImpressions: Number(item.monthlyImpressions) > 0 ? Number(item.monthlyImpressions) : 10_000,
      distanceMiles: Number(item.distanceMiles),
    }))
    .filter((item) => Number.isFinite(item.distanceMiles) && item.distanceMiles >= 0)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);

  const selected = sorted.filter((item) => item.distanceMiles <= radiusMiles);
  let screens = selected.reduce((sum, item) => sum + item.screenCount, 0);

  if (screens * PRICE_PER_SCREEN < MIN_MONTHLY_SPEND) {
    for (const item of sorted) {
      if (selected.includes(item)) continue;
      selected.push(item);
      screens += item.screenCount;
      if (screens * PRICE_PER_SCREEN >= MIN_MONTHLY_SPEND) break;
    }
  }

  const totalInventoryImpressions = selected.reduce((sum, item) => sum + item.monthlyImpressions, 0);
  const distances = selected.map((item) => item.distanceMiles);
  return {
    selected,
    buildings: selected.length,
    screens,
    monthlyImpressions: Math.round(totalInventoryImpressions * LOCAL_LOOP_SHARE),
    nearestDistanceMiles: distances.length ? Math.min(...distances) : 0,
    effectiveRadiusMiles: distances.length ? Math.round(Math.max(...distances) * 10) / 10 : 0,
    monthlyPrice: screens * PRICE_PER_SCREEN,
  };
}

export function summarizeInventory(items, industry) {
  const { selected, ...summary } = selectInventoryPackage(items, industry);
  return summary;
}

export function buildAdPrompt(input) {
  return generateAdPrompt({
    name: input.businessName,
    type: getIndustryConfig(input.businessType).creativeType,
  });
}

export function proposalCopyFor(industry) {
  return PROPOSAL_COPY[industry] || PROPOSAL_COPY.other;
}

