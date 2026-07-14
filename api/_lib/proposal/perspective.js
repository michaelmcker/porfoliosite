const DEFAULT_SCREEN_CORNERS = {
  topLeft: { x: 586, y: 161 },
  topRight: { x: 1119, y: -14 },
  bottomRight: { x: 1126, y: 419 },
  bottomLeft: { x: 591, y: 521 }
};
const DEFAULT_BG_WIDTH = 1200;
const DEFAULT_BG_HEIGHT = 900;
const ORIGINAL_BG_WIDTH = 1975;
const ORIGINAL_BG_HEIGHT = 1478;
const SOURCE_ASPECT_RATIO = 16 / 9;
function computePerspectiveMatrix(srcWidth, srcHeight, dst) {
  const src = [
    { x: 0, y: 0 },
    // top-left
    { x: srcWidth, y: 0 },
    // top-right
    { x: srcWidth, y: srcHeight },
    // bottom-right
    { x: 0, y: srcHeight }
    // bottom-left
  ];
  const dstPts = [dst.topLeft, dst.topRight, dst.bottomRight, dst.bottomLeft];
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const sx = src[i].x;
    const sy = src[i].y;
    const dx = dstPts[i].x;
    const dy = dstPts[i].y;
    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    b.push(dx);
    b.push(dy);
  }
  const coeffs = solveLinearSystem(A, b);
  if (!coeffs) {
    throw new Error("Failed to compute perspective transform matrix");
  }
  const [a, bCoef, c, d, e, f, g, h] = coeffs;
  return [
    a,
    d,
    0,
    g,
    bCoef,
    e,
    0,
    h,
    0,
    0,
    1,
    0,
    c,
    f,
    0,
    1
  ];
}
function solveLinearSystem(A, b) {
  const n = b.length;
  const augmented = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
        maxRow = row;
      }
    }
    [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];
    if (Math.abs(augmented[col][col]) < 1e-10) {
      return null;
    }
    for (let row = col + 1; row < n; row++) {
      const factor = augmented[row][col] / augmented[col][col];
      for (let j = col; j <= n; j++) {
        augmented[row][j] -= factor * augmented[col][j];
      }
    }
  }
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    x[row] = augmented[row][n];
    for (let col = row + 1; col < n; col++) {
      x[row] -= augmented[row][col] * x[col];
    }
    x[row] /= augmented[row][row];
  }
  return x;
}
function generateOverlayHtml(backgroundImageUrl, overlayImageUrl, corners = DEFAULT_SCREEN_CORNERS, backgroundWidth = 800, backgroundHeight = 600) {
  const RENDER_SCALE = 0.6;
  const scaledCorners = {
    topLeft: { x: corners.topLeft.x * RENDER_SCALE, y: corners.topLeft.y * RENDER_SCALE },
    topRight: { x: corners.topRight.x * RENDER_SCALE, y: corners.topRight.y * RENDER_SCALE },
    bottomRight: { x: corners.bottomRight.x * RENDER_SCALE, y: corners.bottomRight.y * RENDER_SCALE },
    bottomLeft: { x: corners.bottomLeft.x * RENDER_SCALE, y: corners.bottomLeft.y * RENDER_SCALE }
  };
  const scaledBgWidth = backgroundWidth * RENDER_SCALE;
  const scaledBgHeight = backgroundHeight * RENDER_SCALE;
  const minX = Math.min(scaledCorners.topLeft.x, scaledCorners.bottomLeft.x);
  const minY = Math.min(scaledCorners.topLeft.y, scaledCorners.topRight.y);
  const maxX = Math.max(scaledCorners.topRight.x, scaledCorners.bottomRight.x);
  const maxY = Math.max(scaledCorners.bottomLeft.y, scaledCorners.bottomRight.y);
  const width = maxX - minX;
  const height = maxY - minY;
  const adjustedCorners = {
    topLeft: { x: scaledCorners.topLeft.x - minX, y: scaledCorners.topLeft.y - minY },
    topRight: { x: scaledCorners.topRight.x - minX, y: scaledCorners.topRight.y - minY },
    bottomRight: { x: scaledCorners.bottomRight.x - minX, y: scaledCorners.bottomRight.y - minY },
    bottomLeft: { x: scaledCorners.bottomLeft.x - minX, y: scaledCorners.bottomLeft.y - minY }
  };
  const matrix = computePerspectiveMatrix(width, height, adjustedCorners);
  const matrixStr = `matrix3d(${matrix.join(", ")})`;
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${scaledBgWidth}px;
      height: ${scaledBgHeight}px;
      overflow: hidden;
      background: #000;
    }
    .container {
      position: relative;
      width: ${scaledBgWidth}px;
      height: ${scaledBgHeight}px;
      overflow: hidden;
    }
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: ${scaledBgWidth}px;
      height: ${scaledBgHeight}px;
    }
    .overlay-wrapper {
      position: absolute;
      top: ${minY}px;
      left: ${minX}px;
      width: ${width}px;
      height: ${height}px;
      transform-origin: 0 0;
      transform: ${matrixStr};
      z-index: 10;
    }
    .overlay {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="background" src="${backgroundImageUrl}" alt="Background" />
    <div class="overlay-wrapper">
      <img class="overlay" src="${overlayImageUrl}" alt="Ad overlay" />
    </div>
  </div>
</body>
</html>
  `.trim();
}
async function generateCompositeImage(backgroundImagePath, overlayImagePath, corners = DEFAULT_SCREEN_CORNERS, bgWidth = DEFAULT_BG_WIDTH, bgHeight = DEFAULT_BG_HEIGHT) {
  const chromium = await import("@sparticuz/chromium-min");
  const puppeteer = await import("puppeteer-core");
  const CHROMIUM_VERSION = "143.0.4";
  const RENDER_SCALE = 0.6;
  const scaledWidth = Math.round(bgWidth * RENDER_SCALE);
  const scaledHeight = Math.round(bgHeight * RENDER_SCALE);
  const isServerless = process.platform === "linux" && Boolean(process.env.VERCEL);
  const browser = await puppeteer.default.launch({
    args: isServerless ? chromium.default.args : ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: isServerless ? await chromium.default.executablePath(`https://github.com/Sparticuz/chromium/releases/download/v${CHROMIUM_VERSION}/chromium-v${CHROMIUM_VERSION}-pack.${process.arch === "arm64" ? "arm64" : "x64"}.tar`) : process.env.CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: scaledWidth,
      height: scaledHeight,
      deviceScaleFactor: 1 / RENDER_SCALE
    });
    const html = generateOverlayHtml(
      backgroundImagePath,
      overlayImagePath,
      corners,
      bgWidth,
      bgHeight
    );
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15e3 });
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.length === 2 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, { timeout: 15e3 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const screenshot = await page.screenshot({
      type: "png",
      omitBackground: false
    });
    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
}
export {
  DEFAULT_BG_HEIGHT,
  DEFAULT_BG_WIDTH,
  DEFAULT_SCREEN_CORNERS,
  ORIGINAL_BG_HEIGHT,
  ORIGINAL_BG_WIDTH,
  SOURCE_ASPECT_RATIO,
  generateCompositeImage,
  generateOverlayHtml
};
