import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePdfDocument } from "../src/validation";

test("validatePdfDocument accepts file output with path and no type", () => {
  validatePdfDocument({
    html: "<p>{{x}}</p>",
    data: {},
    path: "./out.pdf",
  });
});

test("validatePdfDocument accepts data value 0 (falsy but valid)", () => {
  validatePdfDocument({
    html: "<p>{{x}}</p>",
    data: 0,
    path: "./out.pdf",
  });
});

test("validatePdfDocument rejects missing html", () => {
  assert.throws(
    () =>
      validatePdfDocument({
        html: "",
        data: {},
        path: "./out.pdf",
      } as any),
    /document\.html/
  );
});

test("validatePdfDocument rejects null data", () => {
  assert.throws(
    () =>
      validatePdfDocument({
        html: "<p></p>",
        data: null as any,
        path: "./out.pdf",
      }),
    /document\.data/
  );
});

test("validatePdfDocument rejects file mode without path", () => {
  assert.throws(
    () =>
      validatePdfDocument({
        html: "<p></p>",
        data: {},
      } as any),
    /document\.path/
  );
});

test("validatePdfDocument accepts buffer without path", () => {
  validatePdfDocument({
    html: "<p></p>",
    data: {},
    type: "buffer",
  });
});
