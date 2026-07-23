(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav solidify-on-scroll */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mobileMenu");
  var closeMenu = function () {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Link-line draw trigger for the services cards */
  var cardsWrap = document.querySelector(".cards-wrap");
  if (cardsWrap) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      cardsWrap.classList.add("is-visible");
    } else {
      var lineIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              cardsWrap.classList.add("is-visible");
              lineIO.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      lineIO.observe(cardsWrap);
    }
  }

  /* Modal system — Packages "Learn more" info modals + Work preview modals, all on-page, never navigate */
  var overlay = document.getElementById("modalOverlay");
  if (overlay) {
    var triggers = document.querySelectorAll("[data-modal]");
    var panels = overlay.querySelectorAll(".modal-panel");
    var lastFocused = null;

    var closeModal = function () {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        panels.forEach(function (p) { p.hidden = true; });
      }, 400);
      if (lastFocused) lastFocused.focus();
    };

    var openModal = function (key, trigger) {
      lastFocused = trigger;
      panels.forEach(function (p) { p.hidden = p.id !== "modal-" + key; });
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var activePanel = overlay.querySelector("#modal-" + key);
      var closeBtn = activePanel && activePanel.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openModal(trigger.getAttribute("data-modal"), trigger);
      });
    });

    overlay.querySelectorAll(".modal-close").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
    });
  }
})();
