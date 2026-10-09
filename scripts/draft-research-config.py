from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/draft-library-2026-10-08'
QUERIES='''
service business website phone calls vs contact forms
small business brand identity deliverables website social media
nonprofit donor fundraising video planning best practices
small business website design brief requirements
website monthly subscription vs one time cost ownership
small business AI workflow automation buying guide
business website holiday opening hours update checklist
website design client handover checklist ownership
plumber website design best practices Kelowna
Framer vs Webflow vs custom website small business
electrician website design best practices Okanagan
accountant website design attracting business clients
branding services small business Kelowna
law firm website design best practices British Columbia
hotel website design direct bookings best practices
landscaping website design seasonal services lead generation
Framer small business website CMS limitations
website enquiry lead follow up workflow service business
winery website design tasting reservations visitor information
Webflow small business website CMS ownership costs
vacation rental direct booking website design Okanagan
dental website design new patient booking best practices
HVAC website design services calls best practices
charity website CMS WordPress Webflow nonprofit
physiotherapy website design patient appointment
small business website social media video content strategy
restaurant website design menu reservations mobile
property management website design owners tenants
Shopify vs WooCommerce vs catalogue small retail business
AI automation service business website enquiries
roofing website design estimates project photos
medical practice website design appointment enquiries
small business website design examples typography layout
car dealership website design inventory enquiry
financial advisor website design client fit
small business website Google AI search optimization
Sanity CMS small business website headless hosting
website wrong leads enquiries service business
medical spa website design treatment consultation
rebrand vs website redesign vs messaging small business
appliance repair website design service areas booking
self hosted vs managed hosting custom business website ownership
private school website design admissions marketing
website design photography video animation performance
charity donation page design best practices Canada
Framer vs Webflow local SEO business website
service business website landing page before Google Ads
AI skills vs prompts small business workflows
boutique hotel accommodation website design examples Okanagan
local SEO service area pages location pages website
professional services homepage design examples
how to compare website design quotes small business
small business administrative task automation priorities
template vs custom website design small business
website client editing CMS training handover
customer case study website content photography video
custom AI workflow maintenance cost business
website performance metrics qualified leads service business
small business website accessibility checklist W3C
small business website growth strategy annual planning
'''
SOURCES='''
forms|https://www.w3.org/WAI/tutorials/forms/|W3C accessible forms
wcag|https://www.w3.org/WAI/test-evaluate/preliminary/|W3C accessibility first checks
video|https://www.w3.org/WAI/media/av/|W3C accessible audio and video
google-local|https://support.google.com/business/answer/7091?hl=en|Google local ranking guidance
google-hours|https://support.google.com/business/answer/6303076?hl=en|Google special hours
google-starter|https://developers.google.com/search/docs/fundamentals/seo-starter-guide|Google SEO starter guide
google-helpful|https://developers.google.com/search/docs/fundamentals/creating-helpful-content|Google people-first content
google-ai|https://developers.google.com/search/docs/appearance/ai-features|Google AI search features
google-spam|https://developers.google.com/search/docs/essentials/spam-policies|Google spam policies
openai-bots|https://platform.openai.com/docs/bots|OpenAI crawler documentation
web-vitals|https://web.dev/articles/vitals|Google Core Web Vitals
ga4|https://support.google.com/analytics/answer/9267735?hl=en|Google Analytics events
gsc|https://support.google.com/webmasters/answer/7576553?hl=en|Search Console performance reporting
framer-cms|https://www.framer.com/cms/|Framer CMS
framer-export|https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/|Framer HTML export help
framer-port|https://www.framer.com/help/articles/porting-your-data-from-framer/|Framer data portability help
framer-price|https://www.framer.com/pricing/|Framer plans
framer-seo|https://www.framer.com/seo/|Framer SEO features
webflow-cms|https://webflow.com/cms|Webflow CMS
webflow-export|https://help.webflow.com/hc/en-us/articles/33961386739347-How-do-I-export-my-Webflow-site-code|Webflow code export
webflow-price|https://webflow.com/pricing|Webflow plans
webflow-seo|https://webflow.com/feature/seo|Webflow SEO
sanity-intro|https://www.sanity.io/headless-cms|Sanity headless CMS
sanity-host|https://www.sanity.io/docs/studio/development|Sanity Studio and Content Lake
sanity-export|https://www.sanity.io/docs/content-lake/exporting-data|Sanity data export
wordpress|https://wordpress.org/about/features/|WordPress capabilities
shopify|https://www.shopify.com/online|Shopify online store
woo|https://woocommerce.com/|WooCommerce
bc-law|https://www.lawsociety.bc.ca/for-lawyers/act-rules-and-code/code-of-professional-conduct/chapter-4-%E2%80%93-marketing-of-legal-services/|BC Code marketing of legal services
privacy|https://www.oipc.bc.ca/guidance-documents/2286|BC OIPC developing a privacy policy under PIPA
tsbc|https://www.technicalsafetybc.ca/regulatory-resources/find-a-licensed-contractor|Technical Safety BC contractor lookup
hotel-links|https://support.google.com/hotelprices/answer/10472393?hl=en|Google hotel free booking links
cra-charity|https://www.canada.ca/en/revenue-agency/services/charities-giving/charities/sample-official-donation-receipts.html|CRA donation receipt requirements
tourism-kelowna|https://www.tourismkelowna.com/|Tourism Kelowna
tourism-west|https://www.tourismkelowna.com/explore/neighbouring-communities/west-kelowna/|Tourism Kelowna West Kelowna visitor information
tourism-vernon|https://www.tourismvernon.com/|Tourism Vernon
treehouse|https://okanagantreehouse.ca/|Okanagan Treehouse
abc|https://www.abcappliance.ca/|ABC Appliance
cool|https://michaelmck.site/v2/work/local-search-magnet.html|Michael McKerracher Cool Runnings work
michael-web|https://michaelmck.site/web-design/|Michael McKerracher website design
michael-brand|https://michaelmck.site/marketing-branding/|Michael McKerracher marketing and branding
michael-ai|https://michaelmck.site/ai-implementation/|Michael McKerracher AI implementation
twincreek|https://www.twincreekmedia.com/|Twin Creek Media
svice|https://www.svice.ca/|Svice
'''
if __name__=='__main__':
    b=json.loads((OUT/'briefs.json').read_text());q=QUERIES.strip().splitlines();assert len(b)==len(q)
    for r,query in zip(b,q):r['primaryQuery']=query
    for r in b:
        if 'framer-export' in r['sourceIds']:r['sourceIds'].append('framer-port')
    (OUT/'briefs.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
    sources=[dict(zip(['id','url','name'],r.split('|'))) for r in SOURCES.strip().splitlines()]
    (OUT/'source-config.json').write_text(json.dumps(sources,indent=2)+'\n')
