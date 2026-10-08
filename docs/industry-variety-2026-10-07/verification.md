# Verification — industry design variety

- 24 distinct new website designs, 48 responsive WebP files. Largest primary image 264,044 bytes.
- Four hero compositions and four section orders, with unchanged shared header and industry-specific content.
- 96 browser checks across 1440 / 768 / 390 / 320 px: no overflow, all hero images load, exactly one H1 and six FAQs per page.
- Visual inspection: collection, plumbing, law, hotel, dental desktop; law, hotel and retail mobile.
- Native FAQ expansion and consultation email link verified.
- Full repository suite: 145 passed, one pre-existing failure in tests/v2-about-mobile.test.mjs due to its Chromium launch. Same result on baseline and final run. Browser verification for the changed pages used the connected browser and passed.
- Production commit: `27dcc216e162d771d9212cbba9d9a9c29f3fbce3`.
- Vercel production deployment: `dpl_BED4WvqCdQCCfaUp535LWq1y5ABe`, ready and aliased to `https://michaelmck.site`.
- 103 live HTML, Markdown, image, CSS and discovery resources returned successfully and matched local bytes. Markdown negotiation returned 200 with `text/markdown`.
- Live desktop collection and mobile dental page inspected; published first-row thumbnails confirmed loaded.
