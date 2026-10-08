# Industry page verification

- 24 distinct industry pages plus the index; 24 unique image hashes and responsive WebP variants.
- 145 non-browser regression checks passed. One pre-existing Puppeteer mobile test cannot launch Chromium in this environment and was excluded after confirming its baseline failure.
- Connected-browser review: all 24 pages at 320, 390, 768 and 1440 pixels (96 checks), no horizontal overflow, no off-screen headings/actions, hero images loaded.
- All 24 project images loaded after visiting their section at phone width. The school/charity project image was then replaced with the St James campus artwork.
- Native FAQ expansion worked. Consultation actions point to the intended email address. Shared navigation uses the existing site header.
- Every new canonical URL appears in the sitemap and LLM index; HTML and Markdown contain corresponding content; Service, Person, WebPage, Breadcrumb and FAQ data parse successfully.
- All internal new-page links and image/font/style assets resolve to files. The source and public industry HTML match.
- Repeat build produces identical HTML, Markdown and discovery outputs.

Source commit: 0e44dbd28d9052d16cedb9554f0534aa6c040b3b.
Production deployment: dpl_CJBmbgH579NXTADW95kWucGVjBfB, Ready and aliased to https://michaelmck.site.

Live verification completed: 105 HTML, Markdown, image, CSS and discovery resources returned 200 and matched the local files byte-for-byte. Accept: text/markdown requests for plumber, hotel and index routes followed to Markdown with the correct content type. The live plumber route was visually checked at 1440 and 390 pixels; the live index exposes all 24 links. School campus replacement was also visually checked on mobile.
