import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPdfChrome, mergePdfCreateOptions } from "../src/pdf/chrome";

test("buildPdfChrome sets layout and header title", () => {
  const o = buildPdfChrome({
    layout: { format: "A4", orientation: "landscape" },
    header: { title: "Report" },
  });
  assert.equal(o.format, "A4");
  assert.equal(o.orientation, "landscape");
  assert.ok(o.header?.contents?.includes("Report"));
  assert.equal(o.header?.height, "45mm");
});

test("buildPdfChrome footer copyright and page numbers", () => {
  const o = buildPdfChrome({
    footer: { copyright: "© 2026 Acme" },
  });
  assert.ok(String(o.footer?.contents?.default).includes("© 2026 Acme"));
  assert.ok(String(o.footer?.contents?.default).includes("{{page}}"));
});

test("buildPdfChrome copyright without page numbers", () => {
  const o = buildPdfChrome({
    footer: { copyright: "Only", showPageNumbers: false },
  });
  const d = String(o.footer?.contents?.default);
  assert.ok(d.includes("Only"));
  assert.ok(!d.includes("{{page}}"));
});

test("mergePdfCreateOptions explicit header overrides pdfChrome", () => {
  const m = mergePdfCreateOptions({
    pdfChrome: { header: { title: "Chrome" } },
    header: { height: "20mm", contents: "<b>User</b>" },
  });
  assert.equal(m.header?.contents, "<b>User</b>");
  assert.equal(m.header?.height, "20mm");
});

test("mergePdfCreateOptions strips handlebarsHelpers", () => {
  const m = mergePdfCreateOptions({
    format: "A4",
    handlebarsHelpers: { x: () => "" },
  });
  assert.equal(Object.prototype.hasOwnProperty.call(m, "handlebarsHelpers"), false);
});
