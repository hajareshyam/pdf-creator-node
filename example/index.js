/**
 * Example: generate PDFs from a Handlebars HTML template with different layouts.
 * From `example/` run `npm install` then `npm start`.
 * Uses the public API only (`require("pdf-creator-node")` — same as consumers).
 *
 * Each `pdf.create()` run produces one PDF with one paper layout. To ship
 * multiple sizes (A4, Letter, landscape, etc.), call `create` once per layout.
 * Pass layout-specific fields in `document.data` so the template matches each job.
 */

const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

const users = [
  { name: "Shyam", age: "26" },
  { name: "Navjot", age: "26" },
  { name: "Vitthal", age: "26" },
];

/**
 * Several layout presets: each becomes its own file under `example/`.
 * `summary` / `audience` are example fields you might vary per customer or region.
 */
const layoutJobs = [
  {
    file: "output-a4-portrait.pdf",
    summary: "Standard A4 portrait handout with comfortable margins.",
    audience: "EU / APAC (A4 default in many locales)",
    pdfChrome: {
      layout: {
        format: "A4",
        orientation: "portrait",
        border: "12mm",
      },
      header: { title: "User list — A4 portrait" },
      footer: {
        copyright: "© pdf-creator-node example (A4)",
        showPageNumbers: true,
      },
    },
  },
  {
    file: "output-a3-landscape.pdf",
    summary: "Wide canvas for tables or diagrams; landscape uses horizontal space.",
    audience: "Wall display / working session",
    pdfChrome: {
      layout: {
        format: "A3",
        orientation: "landscape",
        border: "10mm",
      },
      header: { title: "User list — A3 landscape" },
      footer: {
        copyright: "© pdf-creator-node example (A3 landscape)",
        showPageNumbers: true,
      },
    },
  },
  {
    file: "output-letter.pdf",
    summary: "US Letter with imperial margin shorthand on the layout preset.",
    audience: "North America",
    pdfChrome: {
      layout: {
        format: "Letter",
        orientation: "portrait",
        border: "0.5in",
      },
      header: { title: "User list — Letter" },
      footer: {
        copyright: "© pdf-creator-node example (Letter)",
        showPageNumbers: true,
      },
    },
  },
];

function buildDataForJob(job) {
  const L = job.pdfChrome.layout ?? {};
  return {
    users,
    summary: job.summary,
    audience: job.audience,
    layout: {
      outputFile: job.file,
      format: L.format ?? "—",
      orientation: L.orientation ?? "—",
      border: L.border ?? "—",
    },
  };
}

async function main() {
  try {
    for (const job of layoutJobs) {
      const document = {
        html,
        data: buildDataForJob(job),
        path: path.join(__dirname, job.file),
      };

      const options = { pdfChrome: job.pdfChrome };

      const res = await pdf.create(document, options);
      console.log(`Wrote ${job.file}:`, res);
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
