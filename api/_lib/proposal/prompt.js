const INDUSTRY_TEMPLATES = {
  // Dental - patient in chair, friendly dentist
  dental: {
    scene: `A friendly dentist in blue scrubs examining a relaxed patient reclined in a modern dental chair. Bright overhead light, clean white and teal office. The patient is smiling, comfortable. Warm, trustworthy atmosphere.`,
    cta: "Your Best Smile Awaits"
  },
  dentist: {
    scene: `A friendly dentist in blue scrubs examining a relaxed patient reclined in a modern dental chair. Bright overhead light, clean white and teal office. The patient is smiling, comfortable. Warm, trustworthy atmosphere.`,
    cta: "Your Best Smile Awaits"
  },
  // Gym - person working out
  gym: {
    scene: `An athletic person mid-workout, lifting dumbbells with focused determination. Modern gym with sleek equipment, dramatic lighting, mirrors in background. Energy and motivation. Sweat and effort visible.`,
    cta: "Unleash Your Strength"
  },
  fitness: {
    scene: `An athletic person mid-workout, lifting dumbbells with focused determination. Modern gym with sleek equipment, dramatic lighting, mirrors in background. Energy and motivation. Sweat and effort visible.`,
    cta: "Unleash Your Strength"
  },
  // Law - lawyer meeting with client
  law: {
    scene: `A confident lawyer in a tailored suit shaking hands with a relieved client across a mahogany desk. Leather chairs, legal books on shelves, warm office lighting. Trust and professionalism.`,
    cta: "Justice On Your Side"
  },
  lawyer: {
    scene: `A confident lawyer in a tailored suit shaking hands with a relieved client across a mahogany desk. Leather chairs, legal books on shelves, warm office lighting. Trust and professionalism.`,
    cta: "Justice On Your Side"
  },
  // Accounting - professional reviewing numbers with client
  accounting: {
    scene: `An accountant at a clean modern desk showing a tablet with financial charts to a smiling business owner. Organized office, calculator nearby, documents neatly arranged. Confidence and clarity.`,
    cta: "Grow Your Wealth"
  },
  accountant: {
    scene: `An accountant at a clean modern desk showing a tablet with financial charts to a smiling business owner. Organized office, calculator nearby, documents neatly arranged. Confidence and clarity.`,
    cta: "Grow Your Wealth"
  },
  // Real Estate - agent handing keys to happy couple
  realestate: {
    scene: `A real estate agent handing house keys to a happy young couple in front of a beautiful home with a SOLD sign. Sunny day, well-manicured lawn, excitement and new beginnings.`,
    cta: "Find Your Dream Home"
  },
  realtor: {
    scene: `A real estate agent handing house keys to a happy young couple in front of a beautiful home with a SOLD sign. Sunny day, well-manicured lawn, excitement and new beginnings.`,
    cta: "Find Your Dream Home"
  },
  real_estate: {
    scene: `A real estate agent handing house keys to a happy young couple in front of a beautiful home with a SOLD sign. Sunny day, well-manicured lawn, excitement and new beginnings.`,
    cta: "Find Your Dream Home"
  },
  // Restaurant - people enjoying a meal
  restaurant: {
    scene: `Friends laughing together at a beautifully set restaurant table, clinking wine glasses over a delicious meal. Warm ambient lighting, elegant plated food, cozy atmosphere. Joy and connection.`,
    cta: "Taste The Difference"
  },
  // Auto - person admiring a new car
  auto: {
    scene: `A person running their hand along the hood of a sleek new car in a bright showroom, admiring the vehicle with excitement. Polished floors, dramatic lighting on the car. Aspiration and desire.`,
    cta: "Drive Your Dreams"
  },
  automotive: {
    scene: `A person running their hand along the hood of a sleek new car in a bright showroom, admiring the vehicle with excitement. Polished floors, dramatic lighting on the car. Aspiration and desire.`,
    cta: "Drive Your Dreams"
  },
  dealership: {
    scene: `A person running their hand along the hood of a sleek new car in a bright showroom, admiring the vehicle with excitement. Polished floors, dramatic lighting on the car. Aspiration and desire.`,
    cta: "Drive Your Dreams"
  },
  auto_dealer: {
    scene: `A person running their hand along the hood of a sleek new car in a bright showroom, admiring the vehicle with excitement. Polished floors, dramatic lighting on the car. Aspiration and desire.`,
    cta: "Drive Your Dreams"
  },
  // Medical - doctor with patient
  medical: {
    scene: `A caring doctor in a white coat listening attentively to a patient in a bright, modern exam room. Stethoscope around neck, warm smile, medical equipment visible. Compassion and expertise.`,
    cta: "Your Health Matters"
  },
  healthcare: {
    scene: `A caring doctor in a white coat listening attentively to a patient in a bright, modern exam room. Stethoscope around neck, warm smile, medical equipment visible. Compassion and expertise.`,
    cta: "Your Health Matters"
  },
  // Chiropractor - adjustment scene
  chiropractor: {
    scene: `A chiropractor in professional attire performing a gentle spinal adjustment on a relaxed patient lying on a treatment table. Clean, modern clinic with anatomical charts visible. Relief and expertise.`,
    cta: "Feel Better Today"
  },
  // Veterinarian - caring for a pet
  veterinarian: {
    scene: `A friendly veterinarian in scrubs gently examining a happy golden retriever on an exam table, the dog's tail wagging. Bright, clean animal clinic. The pet owner watches with a smile. Trust and care.`,
    cta: "Your Pet Deserves The Best"
  },
  // Home Services - craftsman at work
  homeservices: {
    scene: `A skilled contractor installing a beautiful new kitchen countertop, tools in hand, proud of their work. Modern kitchen renovation in progress, natural light, quality craftsmanship visible.`,
    cta: "Transform Your Home"
  },
  contractor: {
    scene: `A skilled contractor installing a beautiful new kitchen countertop, tools in hand, proud of their work. Modern kitchen renovation in progress, natural light, quality craftsmanship visible.`,
    cta: "Transform Your Home"
  },
  // Retail - happy shopper
  retail: {
    scene: `A happy shopper holding colorful shopping bags, browsing through an attractive boutique store. Warm lighting, appealing product displays, excitement of finding something special.`,
    cta: "Discover Something Special"
  },
  // Spa/Wellness - person receiving massage
  spa: {
    scene: `A person lying peacefully on a massage table, eyes closed in relaxation, while a therapist works on their shoulders. Soft candlelight, orchids, serene spa environment. Pure tranquility.`,
    cta: "Relax And Rejuvenate"
  },
  wellness: {
    scene: `A person lying peacefully on a massage table, eyes closed in relaxation, while a therapist works on their shoulders. Soft candlelight, orchids, serene spa environment. Pure tranquility.`,
    cta: "Relax And Rejuvenate"
  },
  // Insurance - family feeling protected
  insurance: {
    scene: `A happy family of four standing together in front of their home, arms around each other, looking secure and content. Beautiful house, sunny day, sense of protection and peace.`,
    cta: "Protection You Can Trust"
  }
};
function generateAdPrompt(business) {
  const template = INDUSTRY_TEMPLATES[business.type] || INDUSTRY_TEMPLATES.retail;
  const brandName = business.name.toUpperCase();
  return `Create a 16:9 image showing: ${template.scene}

Text overlaid on the image:
- "${brandName}" in very large, bold white text with drop shadow at the top
- "${template.cta}" in smaller white text below

The business name "${brandName}" should be the most prominent element. Clean, professional look.`;
}
function generateSimpleAdPrompt(business) {
  return generateAdPrompt(business);
}
export {
  generateAdPrompt,
  generateSimpleAdPrompt
};
