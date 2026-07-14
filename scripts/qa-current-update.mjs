import { chromium } from '/Users/michaelmckerracher/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ headless: true });
const checks = [
  { name: 'home-desktop', path: '/index.html#work', width: 1440, height: 1000, target: '.work-case--cool-runnings' },
  { name: 'home-tablet', path: '/index.html#work', width: 1024, height: 900, target: '.work-case--cool-runnings' },
  { name: 'home-mobile', path: '/index.html#work', width: 390, height: 844, target: '.work-case--cool-runnings' },
  { name: 'proposal-desktop', path: '/proposal-generator.html', width: 1440, height: 1000, target: '.proposal-demo-workspace' },
  { name: 'proposal-mobile', path: '/proposal-generator.html', width: 390, height: 844, target: '.proposal-demo-workspace' },
  { name: 'case-desktop', path: '/work-local-yard-care-seo-build.html', width: 1440, height: 1000, target: '.cr-hero' },
  { name: 'case-mobile', path: '/work-local-yard-care-seo-build.html', width: 390, height: 844, target: '.cr-hero' },
];

for (const check of checks) {
  const page = await browser.newPage({ viewport: { width: check.width, height: check.height } });
  await page.goto(`http://127.0.0.1:8787${check.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.locator(check.target).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const result = await page.evaluate(() => {
    const videos = [...document.querySelectorAll('video')].map((video) => ({
      src: video.currentSrc.split('/').pop(),
      readyState: video.readyState,
      width: Math.round(video.getBoundingClientRect().width),
      height: Math.round(video.getBoundingClientRect().height),
    }));
    const proposalForm = document.querySelector('.proposal-form')?.getBoundingClientRect();
    const proposalPreview = document.querySelector('.proposal-preview__frame')?.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      videos,
      proposalWidths: proposalForm && proposalPreview
        ? { form: Math.round(proposalForm.width), preview: Math.round(proposalPreview.width) }
        : null,
    };
  });
  await page.screenshot({ path: `/tmp/${check.name}.png`, fullPage: false });
  console.log(JSON.stringify({ name: check.name, ...result }));
  await page.close();
}

await browser.close();
