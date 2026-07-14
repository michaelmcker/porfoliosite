import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "v2", "artifacts", "presentation-publishing.html");
const outputDirectory = path.join(root, "v2", "assets");
const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const renders = [
  {
    name: "desktop",
    filename: "presentation-publishing-desktop.png",
    viewport: { width: 1800, height: 1100, deviceScaleFactor: 1 },
    expected: { width: 1800, height: 1100 },
  },
  {
    name: "mobile",
    filename: "presentation-publishing-mobile.png",
    viewport: { width: 450, height: 800, deviceScaleFactor: 2 },
    expected: { width: 900, height: 1600 },
  },
];

function dimensions(buffer) {
  if (buffer.subarray(1, 4).toString("ascii") !== "PNG" || buffer.subarray(12, 16).toString("ascii") !== "IHDR") {
    throw new Error("Chrome did not produce a valid PNG");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

await mkdir(outputDirectory, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  for (const render of renders) {
    const page = await browser.newPage();
    await page.setViewport(render.viewport);
    await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('400 18px "DM Sans"'),
        document.fonts.load('700 18px "DM Sans"'),
        document.fonts.load('600 56px "Fraunces"'),
      ]);
      await document.fonts.ready;
      if (!document.fonts.check('400 18px "DM Sans"') || !document.fonts.check('600 56px "Fraunces"')) {
        throw new Error("Local artwork fonts did not load");
      }
      await Promise.all([...document.images].map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", reject, { once: true });
          })));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    const outputPath = path.join(outputDirectory, render.filename);
    await page.screenshot({
      path: outputPath,
      type: "png",
      clip: {
        x: 0,
        y: 0,
        width: render.viewport.width,
        height: render.viewport.height,
      },
      captureBeyondViewport: false,
    });

    const actual = dimensions(await readFile(outputPath));
    if (actual.width !== render.expected.width || actual.height !== render.expected.height) {
      throw new Error(`${render.name} PNG is ${actual.width}x${actual.height}; expected ${render.expected.width}x${render.expected.height}`);
    }
    console.log(`Rendered ${path.relative(root, outputPath)} at ${actual.width}x${actual.height}`);
    await page.close();
  }
} finally {
  await browser.close();
}
