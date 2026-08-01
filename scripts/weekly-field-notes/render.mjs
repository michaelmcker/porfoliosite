#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://michaelmck.site";
const SERIES = "Marketing Engineering Field Notes";
const DISCLOSURE = "Codex writes this log. Mike McKerracher co-authors it and built the machinery underneath it.";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/\[([^\]]+)]\((https:\/\/[^\s)]+|\/[^\s)]*)\)/g, (_match, label, href) => `<a href="${href}">${label}</a>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  return html;
}

export function markdownToHtml(markdown) {
  if (/<\/?[A-Za-z!][^>]*>/.test(markdown)) throw new Error("Raw HTML is not allowed in field notes Markdown");
  const lines = String(markdown).replaceAll("\r\n", "\n").trim().split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push("<hr>");
      continue;
    }
    const item = trimmed.match(/^[-*]\s+(.+)$/);
    if (item) {
      flushParagraph();
      list.push(item[1]);
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return blocks.join("\n");
}

export function parseEntry(source, filename) {
  const match = String(source).replaceAll("\r\n", "\n").match(/^---\n([\s\S]*?)\n---\n+([\s\S]+)$/);
  if (!match) throw new Error(`${filename}: front matter is required`);
  const metadata = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`${filename}: invalid front matter line`);
    metadata[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  for (const key of ["title", "slug", "description", "date", "week", "status", "authors"]) {
    if (!metadata[key]) throw new Error(`${filename}: ${key} is required`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) throw new Error(`${filename}: slug is invalid`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) throw new Error(`${filename}: date is invalid`);
  if (!/^\d{4}-W\d{2}$/.test(metadata.week)) throw new Error(`${filename}: week is invalid`);
  if (!["draft", "published"].includes(metadata.status)) throw new Error(`${filename}: status must be draft or published`);
  if (metadata.authors !== "Codex, Mike McKerracher") throw new Error(`${filename}: authors must be Codex, Mike McKerracher`);
  markdownToHtml(match[2]);
  return { ...metadata, body: match[2].trim(), filename };
}

function jsonLd(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function head({ title, description, canonical, schema }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" type="application/rss+xml" title="${SERIES}" href="${SITE}/field-notes/feed.xml">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/field-notes/field-notes.css">
  <script type="application/ld+json">${jsonLd(schema)}</script>
</head>`;
}

function siteHeader() {
  return `<a class="skip-link" href="#main-content">Skip to the field note</a>
  <header class="notes-header">
    <a class="notes-brand" href="/" aria-label="Michael McKerracher, home">MM</a>
    <nav aria-label="Field notes navigation"><a href="/">Portfolio</a><a href="/field-notes/">All field notes</a></nav>
  </header>`;
}

function disclosure() {
  return `<aside class="authorship" aria-label="How this entry was written"><p><strong>${DISCLOSURE}</strong> Each week the workflow reviews a sanitized record of tools, skills, research trails, and friction. Mike approves the premise before publication. Private work stays private.</p></aside>`;
}

function indexHtml(entries) {
  const canonical = `${SITE}/field-notes/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SERIES,
    url: canonical,
    description: "A weekly, AI-authored log about building practical marketing systems.",
    author: [
      { "@type": "Organization", name: "Codex" },
      { "@type": "Person", name: "Michael McKerracher", url: SITE },
    ],
  };
  const cards = entries.length
    ? entries.map((entry) => `<article class="note-card"><p class="note-week">${escapeHtml(entry.week)} · <time datetime="${entry.date}">${escapeHtml(entry.date)}</time></p><h2><a href="/field-notes/${entry.slug}/">${escapeHtml(entry.title)}</a></h2><p>${escapeHtml(entry.description)}</p><a class="read-note" href="/field-notes/${entry.slug}/">Read the field note <span aria-hidden="true">→</span></a></article>`).join("\n")
    : `<p class="empty-log">The first brief is in the workshop. Nothing appears here until Mike approves the premise and every publication check passes.</p>`;
  return `${head({ title: `${SERIES} | Michael McKerracher`, description: "A weekly, AI-authored log about the tools, decisions, friction, and adjustments behind practical marketing systems.", canonical, schema })}
<body>
  ${siteHeader()}
  <main id="main-content">
    <header class="notes-intro"><p class="eyebrow">A weekly build log</p><h1>Marketing Engineering<br><em>Field Notes</em></h1><p class="dek">Tools are easy to list. Decisions are more interesting. This is the record of what worked, what did not, and what changed next.</p></header>
    ${disclosure()}
    <section class="how-it-works" aria-labelledby="how-title"><p class="eyebrow">The machinery</p><h2 id="how-title">How this log works</h2><p>Once a week, the system looks back at the tools Mike reached for, the skills he called, the research trails he followed, and the places the work fought back. Codex looks for the story inside that evidence. Mike reviews the premise on Saturday. If he approves it, Codex writes, checks, and publishes the piece on Sunday. If he does not, the draft stays in the workshop.</p><p>The source packet is anonymized before writing. No specific company, private person, private project, or private result belongs in this log.</p></section>
    <section class="entries" aria-labelledby="entries-title"><div class="entries-heading"><p class="eyebrow">The log</p><h2 id="entries-title">Latest entries</h2></div>${cards}</section>
  </main>
  <footer><p>Built in public, with private work kept out of it.</p><a href="/">Michael McKerracher · Marketing Engineer</a></footer>
</body>
</html>
`;
}

function articleHtml(entry, entries) {
  const canonical = `${SITE}/field-notes/${entry.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.date,
    dateModified: entry.date,
    mainEntityOfPage: canonical,
    url: canonical,
    author: [
      { "@type": "Organization", name: "Codex" },
      { "@type": "Person", name: "Michael McKerracher", url: SITE },
    ],
    isPartOf: { "@type": "Blog", name: SERIES, url: `${SITE}/field-notes/` },
  };
  const index = entries.findIndex(({ slug }) => slug === entry.slug);
  const newer = index > 0 ? entries[index - 1] : null;
  const older = index < entries.length - 1 ? entries[index + 1] : null;
  const navigation = [
    newer ? `<a href="/field-notes/${newer.slug}/"><span>Newer</span>${escapeHtml(newer.title)}</a>` : "",
    older ? `<a href="/field-notes/${older.slug}/"><span>Older</span>${escapeHtml(older.title)}</a>` : "",
  ].filter(Boolean).join("");

  return `${head({ title: `${entry.title} | ${SERIES}`, description: entry.description, canonical, schema })}
<body>
  ${siteHeader()}
  <main id="main-content">
    <article class="field-note">
      <header class="article-header"><p class="eyebrow">${escapeHtml(entry.week)} · Marketing Engineering Field Notes</p><h1>${escapeHtml(entry.title)}</h1><p class="article-dek">${escapeHtml(entry.description)}</p><p class="byline">Written by Codex with Mike McKerracher · <time datetime="${entry.date}">${escapeHtml(entry.date)}</time></p></header>
      ${disclosure()}
      <div class="article-body">${markdownToHtml(entry.body)}</div>
    </article>
    <nav class="article-nav" aria-label="Field note navigation">${navigation}<a class="all-notes" href="/field-notes/">All field notes</a></nav>
  </main>
  <footer><p>The draft only leaves the workshop after approval.</p><a href="/field-notes/">Read the full log</a></footer>
</body>
</html>
`;
}

function xml(value) {
  return escapeHtml(value).replaceAll("&#39;", "&apos;");
}

function feedXml(entries) {
  const items = entries.map((entry) => `    <item>
      <title>${xml(entry.title)}</title>
      <link>${SITE}/field-notes/${entry.slug}/</link>
      <guid isPermaLink="true">${SITE}/field-notes/${entry.slug}/</guid>
      <pubDate>${new Date(`${entry.date}T12:00:00.000Z`).toUTCString()}</pubDate>
      <description>${xml(entry.description)}</description>
    </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SERIES}</title>
    <link>${SITE}/field-notes/</link>
    <description>A weekly, AI-authored log about building practical marketing systems.</description>
    <language>en-ca</language>
${items}
  </channel>
</rss>
`;
}

async function updateSitemap(repoRoot, entries) {
  const sitemapPath = join(repoRoot, "sitemap.xml");
  let sitemap;
  try {
    sitemap = await readFile(sitemapPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  sitemap = sitemap.replace(/^\s*<url><loc>https:\/\/michaelmck\.site\/field-notes\/(?!<\/loc>)[^<]+<\/loc><\/url>\s*\n?/gm, "");
  const articleUrls = entries
    .map(({ slug }) => `  <url><loc>${SITE}/field-notes/${slug}/</loc></url>`)
    .join("\n");
  const addition = articleUrls ? `${articleUrls}\n` : "";
  sitemap = sitemap.replace("</urlset>", `${addition}</urlset>`);
  await writeFile(sitemapPath, sitemap);
}

export async function buildFieldNotes({ repoRoot }) {
  const contentPath = join(repoRoot, "content/field-notes");
  const outputPath = join(repoRoot, "v2/field-notes");
  await mkdir(outputPath, { recursive: true });
  let filenames = [];
  try {
    filenames = (await readdir(contentPath)).filter((name) => name.endsWith(".md") && name !== "README.md").sort();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const entries = [];
  for (const filename of filenames) {
    const entry = parseEntry(await readFile(join(contentPath, filename), "utf8"), filename);
    if (entry.status === "published") entries.push(entry);
  }
  entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  await writeFile(join(outputPath, "index.html"), indexHtml(entries));
  await writeFile(join(outputPath, "feed.xml"), feedXml(entries));
  for (const entry of entries) {
    const articlePath = join(outputPath, entry.slug, "index.html");
    await mkdir(dirname(articlePath), { recursive: true });
    await writeFile(articlePath, articleHtml(entry, entries));
  }
  await updateSitemap(repoRoot, entries);
  return { published: entries.length, slugs: entries.map(({ slug }) => slug) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
  const result = await buildFieldNotes({ repoRoot });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
