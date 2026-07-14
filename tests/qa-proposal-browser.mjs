import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8790/proposal-generator.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/tmp/proposal-generator-desktop.png', fullPage: true });

  await page.type('input[name="businessName"]', 'Midtown Family Dental');
  await page.select('select[name="businessType"]', 'dentist');
  await page.type('#proposal-address', '600 West Peachtree Street Atlanta');
  await page.waitForSelector('[data-address-results] button', { visible: true, timeout: 15_000 });
  const suggestions = await page.$$eval('[data-address-results] button', (elements) => elements.map((element) => element.textContent));
  await page.click('[data-address-results] button');
  const enabled = await page.$eval('.proposal-submit', (element) => !element.disabled);
  await page.click('.proposal-submit');
  await page.waitForFunction(
    () => document.querySelector('[data-preview-state]')?.textContent === 'Generated proposal',
    { timeout: 90_000 },
  );
  const ui = await page.evaluate(() => ({
    frame: document.querySelector('[data-proposal-frame]').src,
    download: document.querySelector('[data-download-pdf]').href,
    actionsHidden: document.querySelector('[data-preview-actions]').hidden,
  }));
  await page.screenshot({ path: '/tmp/proposal-generator-generated.png', fullPage: true });

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobile.goto('http://localhost:8790/proposal-generator.html', { waitUntil: 'networkidle0' });
  await mobile.screenshot({ path: '/tmp/proposal-generator-mobile.png', fullPage: true });

  console.log(JSON.stringify({
    suggestionCount: suggestions.length,
    firstSuggestion: suggestions[0],
    enabled,
    ui,
  }, null, 2));
} finally {
  await browser.close();
}

