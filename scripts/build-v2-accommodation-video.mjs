import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mediaRoot = resolve(repoRoot, "assets/videos/accommodation");
const inputs = ["overview-scroll.mp4", "treehouse-scroll.mp4", "cabin-scroll.mp4"]
  .map((name) => resolve(mediaRoot, name));
const mp4Output = resolve(mediaRoot, "showcase-scroll.mp4");
const webmOutput = resolve(mediaRoot, "showcase-scroll.webm");
const filter = "[0:v][1:v][2:v]concat=n=3:v=1:a=0,scale=800:500,fps=25,format=yuv420p[outv]";

mkdirSync(mediaRoot, { recursive: true });

const inputArgs = inputs.flatMap((input) => ["-i", input]);

execFileSync("ffmpeg", [
  "-y",
  ...inputArgs,
  "-filter_complex", filter,
  "-map", "[outv]",
  "-an",
  "-c:v", "libx264",
  "-preset", "medium",
  "-crf", "22",
  "-g", "12",
  "-movflags", "+faststart",
  mp4Output,
], { stdio: "inherit" });

execFileSync("ffmpeg", [
  "-y",
  ...inputArgs,
  "-filter_complex", filter,
  "-map", "[outv]",
  "-an",
  "-c:v", "libvpx-vp9",
  "-crf", "32",
  "-b:v", "0",
  "-g", "12",
  "-row-mt", "1",
  webmOutput,
], { stdio: "inherit" });

console.log(`Built ${mp4Output}`);
console.log(`Built ${webmOutput}`);
