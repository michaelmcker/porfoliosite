# Industry pages implementation

User approval: implement the shared image-first template across the 24 researched industries. Use generated industry-relevant website artwork without image labels; retain the existing portfolio identity and consistent navigation. Responsive desktop and mobile implementation.

Source: saved independent industry briefs. Each industry has its own headline, customer decisions, practical content, local context, enquiry path and FAQs. Shared styling does not mean replacing an industry name in repeated body copy.

Visual extraction: white opening, roughly equal copy and laptop columns, bold DM Sans headline with Fraunces emphasis; image fitted to its content, no caption. Forest result or value band. Open editorial content rows with light hairlines and occasional paper sidebar. Gold closing consultation section. Phone order is copy, CTA, media, proof; single-column detailed content.

Tokens scoped to industry pages: display clamp(44px,5vw,76px), secondary heading clamp(32px,3.4vw,52px), editorial title clamp(28px,2.8vw,40px); section spacing clamp(48px,6vw,88px); copy 18px/1.6. Shared local fonts and existing header.

Routes: /web-design/{industry}/ and /web-design/industries/. Canonical HTML, Markdown alternate, Service/Person/WebPage/Breadcrumb schema, sitemap, discovery files, related industry links and a parent web-design link. Retain current three-service routes and homepage.

Claims: use the user's 30% increase in qualified bookings for Cool Runnings, ABC's improved search visibility, Treehouse design and St James design/marketing. Do not invent new numerical results, reviews, customers or credentials in generated screens. Public copy uses direct wording, without image disclaimers or testing claims.

Verification: non-browser regression suite, internal asset/link/schema checks, desktop/mobile rendered browser checks and consultation/FAQ navigation. Existing baseline has 143 passes and one environment-dependent Puppeteer launch failure; browser review will use the connected in-app browser.
