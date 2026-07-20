import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

function replaceAll(source, replacements) {
  return replacements.reduce(
    (result, [from, to]) => result.split(from).join(to),
    source,
  );
}

function promoteHomepage(source) {
  return replaceAll(source, [
    ['href="https://michaelmck.site/v2/"', 'href="https://michaelmck.site/"'],
    ['href="../assets/', 'href="assets/'],
    ['src="../assets/', 'src="assets/'],
    ['srcset="../assets/', 'srcset="assets/'],
    ['data-src="../assets/', 'data-src="assets/'],
    ['href="../output/', 'href="output/'],
    ['href="styles.css"', 'href="v2/styles.css"'],
    ['src="assets/videos/rccv-showcase-laptop.', 'src="v2/assets/videos/rccv-showcase-laptop.'],
    ['src="assets/finale/', 'src="v2/assets/finale/'],
    ['src="assets/workflows/', 'src="v2/assets/workflows/'],
    ['srcset="assets/workflows/', 'srcset="v2/assets/workflows/'],
    ['src="okanagan-preview/', 'src="v2/okanagan-preview/'],
    ['src="portrait/', 'src="v2/portrait/'],
    ['href="work/', 'href="v2/work/'],
    ['href="workflows/', 'href="v2/workflows/'],
    ['src="app.js"', 'src="v2/app.js"'],
    ['src="contact-finale.js"', 'src="v2/contact-finale.js"'],
  ]);
}

function promoteProposal(source) {
  return replaceAll(source, [
    ['href="https://michaelmck.site/v2/proposal-generator.html"', 'href="https://michaelmck.site/proposal-generator.html"'],
    ['href="../assets/', 'href="assets/'],
    ['src="../assets/', 'src="assets/'],
    ['src="../output/', 'src="output/'],
    ['href="styles.css"', 'href="v2/styles.css"'],
    ['href="proposal-generator.css"', 'href="v2/proposal-generator.css"'],
    ['href="workflows/', 'href="v2/workflows/'],
    ['src="../proposal-generator.js', 'src="proposal-generator.js'],
  ]);
}

const [homepage, proposal] = await Promise.all([
  readFile(new URL("v2/index.html", root), "utf8"),
  readFile(new URL("v2/proposal-generator.html", root), "utf8"),
]);

await mkdir(new URL("vendor/", root), { recursive: true });

await Promise.all([
  writeFile(new URL("index.html", root), promoteHomepage(homepage)),
  writeFile(new URL("proposal-generator.html", root), promoteProposal(proposal)),
  copyFile(
    new URL("v2/vendor/matter.min.js", root),
    new URL("vendor/matter.min.js", root),
  ),
]);
