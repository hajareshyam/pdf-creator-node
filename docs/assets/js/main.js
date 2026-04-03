(function () {
  "use strict";

  var STORAGE_KEY = "pdf-creator-node-theme";

  function getInitialTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: light)").matches)
      return "light";
    return "dark";
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        theme === "dark" ? "#0f1419" : "#f0f4fa"
      );
    }
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  function initTheme() {
    applyTheme(getInitialTheme(), false);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next, true);
      });
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light", false);
        }
      });
  }

  function wrapCopyable(el, label) {
    if (!el || el.closest(".code-wrap")) return;
    var wrap = document.createElement("div");
    wrap.className = "code-wrap";
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = label || "Copy";
    btn.addEventListener("click", function () {
      var code = el.querySelector("code");
      var text = code ? code.textContent : el.textContent;
      function done() {
        btn.textContent = "Copied";
        btn.classList.add("is-done");
        window.setTimeout(function () {
          btn.textContent = label || "Copy";
          btn.classList.remove("is-done");
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    wrap.appendChild(btn);
  }

  function initCopyButtons() {
    document.querySelectorAll("pre.code-block, .install-block").forEach(function (el) {
      wrapCopyable(el, "Copy");
    });
  }

  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    var root = document.documentElement;
    function toggle() {
      btn.classList.toggle("is-visible", root.scrollTop > 400);
    }
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTheme();
      initCopyButtons();
      initBackToTop();
    });
  } else {
    initTheme();
    initCopyButtons();
    initBackToTop();
  }
})();
