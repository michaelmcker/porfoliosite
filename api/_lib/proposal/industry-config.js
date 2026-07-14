export const INDUSTRY_OPTIONS = [
  ['accountant', 'Accounting Firm'],
  ['auto_dealer', 'Auto Dealer'],
  ['chiropractor', 'Chiropractor'],
  ['dentist', 'Dental Practice'],
  ['gym', 'Gym / Fitness'],
  ['insurance', 'Insurance Agency'],
  ['lawyer', 'Law Firm'],
  ['medical', 'Medical Practice'],
  ['optometrist', 'Optometrist'],
  ['real_estate', 'Real Estate'],
  ['veterinarian', 'Veterinarian'],
  ['other', 'Other / General Business'],
].map(([id, label]) => ({ id, label }));

const SEARCH_RECALL = 'Boost search ad recall by 80%, social posts by 56%';
const DAILY_EXPOSURE = '4x daily exposure as they come and go';

const CONFIG = {
  accountant: { radiusMiles: 5, creativeType: 'accountant' },
  auto_dealer: { radiusMiles: 10, creativeType: 'auto_dealer' },
  chiropractor: { radiusMiles: 5, creativeType: 'chiropractor' },
  dentist: { radiusMiles: 5, creativeType: 'dentist' },
  gym: { radiusMiles: 2, creativeType: 'gym' },
  insurance: { radiusMiles: 5, creativeType: 'insurance' },
  lawyer: { radiusMiles: 10, creativeType: 'lawyer' },
  medical: { radiusMiles: 5, creativeType: 'medical' },
  optometrist: { radiusMiles: 5, creativeType: 'medical' },
  real_estate: { radiusMiles: 10, creativeType: 'real_estate' },
  veterinarian: { radiusMiles: 5, creativeType: 'veterinarian' },
  other: { radiusMiles: 5, creativeType: 'retail' },
};

export const PROPOSAL_COPY = {
  accountant: {
    headline: '{{screens}} Buildings Full of Business Owners Who Need You',
    valueProps: ['Reach decision-makers where they live', 'Stay top-of-mind year-round', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  auto_dealer: {
    headline: '{{screens}} Buildings of Your Next Car Buyers',
    valueProps: ['Reach buyers before they start shopping', 'Service specials to neighbors who trust you', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  chiropractor: {
    headline: '{{screens}} Buildings of People Who Need Relief',
    valueProps: ['Be their first call when their back goes out', 'Build trust before they need you', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  dentist: {
    headline: 'Your Next 50 Patients Live in These {{screens}} Buildings',
    valueProps: ['New patients see you daily before they need you', 'Families build trust before they walk in', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  gym: {
    headline: '{{screens}} Buildings of People Who Should Be Your Members',
    valueProps: ['Catch them when they think "I should work out"', 'Turn elevator rides into membership sign-ups', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  insurance: {
    headline: '{{screens}} Buildings of Families Looking for Protection',
    valueProps: ['Stay visible before renewal decisions', 'Build trust close to home', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  lawyer: {
    headline: 'When These {{screens}} Buildings Need a Lawyer, Will They Call You?',
    valueProps: ['Be the name they remember when it matters', 'Build credibility without the billboard price', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  medical: {
    headline: '{{screens}} Buildings of Patients Looking for a Doctor Like You',
    valueProps: ['New patients find you before they need you', 'Preventive care reminders that work', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  optometrist: {
    headline: '{{screens}} Buildings of Patients Who Need to See You',
    valueProps: ['Reach patients close to your practice', 'Build familiarity before appointments', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  real_estate: {
    headline: '{{screens}} Buildings of Buyers & Sellers Waiting to Meet You',
    valueProps: ['Your listings in front of active buyers daily', 'Become the neighborhood expert', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  veterinarian: {
    headline: '{{screens}} Buildings Full of Pet Owners',
    valueProps: ['Every pet parent in the building sees you daily', 'Be their vet before they need one', SEARCH_RECALL, DAILY_EXPOSURE],
  },
  other: {
    headline: '{{screens}} Buildings of Your Future Customers',
    valueProps: ['Reach neighbors before competitors do', 'Build trust through daily visibility', SEARCH_RECALL, DAILY_EXPOSURE],
  },
};

export function getIndustryConfig(industry) {
  return CONFIG[industry] || CONFIG.other;
}

