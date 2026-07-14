const LETZAI_API_URL = "https://api.letz.ai";
const LETZAI_API_KEY = process.env.LETZAI_API_KEY;
async function generateImage(options) {
  if (!LETZAI_API_KEY) {
    throw new Error("LETZAI_API_KEY environment variable is not set");
  }
  const response = await fetch(`${LETZAI_API_URL}/images`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LETZAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: options.prompt,
      baseModel: "gemini-3-pro-image-preview",
      // Nano Banana Pro
      width: options.width || 1600,
      height: options.height || 900,
      // 16:9 aspect ratio
      quality: options.quality || 3,
      mode: options.mode || "default"
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Letz.ai API error: ${response.status} - ${error}`);
  }
  const data = await response.json();
  return {
    id: data.id,
    status: data.status || "new",
    progress: data.progress || 0,
    previewImage: data.previewImage
  };
}
async function getImageStatus(imageId) {
  if (!LETZAI_API_KEY) {
    throw new Error("LETZAI_API_KEY environment variable is not set");
  }
  const response = await fetch(`${LETZAI_API_URL}/images/${imageId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${LETZAI_API_KEY}`
    }
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Letz.ai API error: ${response.status} - ${error}`);
  }
  const data = await response.json();
  let imageUrl;
  if (data.imageVersions) {
    imageUrl = data.imageVersions["1920x1920"] || data.imageVersions["1280x1280"] || data.imageVersions["960x960"] || data.imageVersions["640x640"];
  }
  return {
    id: data.id,
    status: data.status,
    progress: data.progress || 0,
    imageUrl,
    previewImage: data.previewImage
  };
}
async function waitForImage(imageId, timeoutMs = 12e4, pollIntervalMs = 3e3) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const result = await getImageStatus(imageId);
    if (result.status === "ready") {
      return result;
    }
    if (result.status === "failed") {
      throw new Error(`Image generation failed for ID: ${imageId}`);
    }
    console.log(`Image ${imageId}: ${result.status} (${result.progress}%)`);
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
  throw new Error(`Image generation timed out after ${timeoutMs}ms`);
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const { config } = await import("dotenv");
  config();
  console.log("Testing Letz.ai integration...");
  const result = await generateImage({
    prompt: 'Modern dental office advertisement showing "BRIGHT SMILE DENTAL" in large white text on a clean blue background with a subtle tooth icon, professional healthcare marketing style',
    width: 1600,
    height: 900
  });
  console.log("Generation started:", result);
  console.log("Waiting for completion...");
  const final = await waitForImage(result.id);
  console.log("Final result:", final);
}
export {
  generateImage,
  getImageStatus,
  waitForImage
};
