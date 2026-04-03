import Handlebars from "handlebars";
import type { IfCondOptions } from "./types";

/**
 * Registers helpers used by templates (e.g. `ifCond` for comparisons).
 * Pass a Handlebars instance from `Handlebars.create()` for isolated rendering.
 */
export function registerHandlebarsHelpers(
  handlebars: typeof Handlebars = Handlebars
): void {
  handlebars.registerHelper(
    "ifCond",
    function (
      this: any,
      v1: any,
      operator: string,
      v2: any,
      options: IfCondOptions
    ) {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  );
}
