/* ==========================================================
   KHAN ABDUL KALAM — PORTFOLIO INTERACTIONS
   Vanilla JavaScript · Accessible · Responsive
========================================================== */

"use strict";

(() => {

  /* =========================================
     01. SELECTORS & GLOBAL SETTINGS
  ========================================== */

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];

  const body = document.body;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;


  /* Main elements */

  const intro = $("#cinematicIntro");
  const skipIntro = $("#skipIntro");

  const progressBar = $("#scrollProgress");
  const header = $("#siteHeader");

  const menu = $("#navLinks");
  const menuToggle = $("#menuToggle");

  const themeToggle = $("#themeToggle");

  const typingText = $("#typingText");

  const backToTop = $("#backToTop");
  const currentYear = $("#currentYear");


  /* =========================================
     02. CINEMATIC INTRO
  ========================================== */

  let introTimer;

  const closeIntro = () => {

    if (!intro || intro.classList.contains("intro-hidden")) {
      return;
    }

    window.clearTimeout(introTimer);

    intro.classList.add("intro-hidden");

    body.classList.remove("intro-active");

    if (skipIntro) {
      skipIntro.setAttribute("aria-hidden", "true");
      skipIntro.tabIndex = -1;
    }

  };


  if (intro) {

    body.classList.add("intro-active");

    if (reducedMotion) {
      closeIntro();
    } else {

      introTimer = window.setTimeout(
        closeIntro,
        2850
      );

    }

  }


  /* Skip intro button */

  skipIntro?.addEventListener("click", closeIntro);


  /* Escape key */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      closeIntro();

      closeMobileMenu();

    }

  });


  /* =========================================
     03. LIGHT / DARK THEME SWITCHER
  ========================================== */

  const THEME_KEY = "kak-portfolio-theme";


  const applyTheme = (theme) => {

    const light = theme === "light";

    body.classList.toggle("light-theme", light);

    if (themeToggle) {

      themeToggle.setAttribute(
        "aria-pressed",
        String(light)
      );

      themeToggle.setAttribute(
        "aria-label",
        light
          ? "Switch to dark theme"
          : "Switch to light theme"
      );

      themeToggle.title = light
        ? "Switch to dark theme"
        : "Switch to light theme";


      const icon = $(
        "[data-theme-icon]",
        themeToggle
      );

      if (icon) {
        icon.textContent = light ? "☾" : "☼";
      }

    }

  };


  /* Load saved theme */

  let savedTheme = null;

  try {

    savedTheme = localStorage.getItem(THEME_KEY);

  } catch (error) {

    savedTheme = null;

  }


  applyTheme(
    savedTheme === "light" ? "light" : "dark"
  );


  /* Theme toggle click */

  themeToggle?.addEventListener("click", () => {

    const nextTheme = body.classList.contains("light-theme")
      ? "dark"
      : "light";

    applyTheme(nextTheme);

    try {

      localStorage.setItem(
        THEME_KEY,
        nextTheme
      );

    } catch (error) {

      /* Local storage may be unavailable. */

    }

  });


  /* =========================================
     04. MOBILE NAVIGATION
  ========================================== */

  function closeMobileMenu() {

    menu?.classList.remove("open");

    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle?.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    body.classList.remove("menu-open");

  }


  function toggleMobileMenu() {

    if (!menu || !menuToggle) {
      return;
    }

    const isOpen = !menu.classList.contains("open");

    menu.classList.toggle("open", isOpen);

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    body.classList.toggle("menu-open", isOpen);

  }


  /* Menu button */

  menuToggle?.addEventListener(
    "click",
    toggleMobileMenu
  );


  /* Close menu after selecting a navigation link */

  $$('.nav-links a[href^="#"]').forEach((link) => {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });


  /* Close menu when clicking outside */

  document.addEventListener("click", (event) => {

    if (
      menu?.classList.contains("open") &&
      !menu.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {

      closeMobileMenu();

    }

  });


  /* Close menu on desktop resize */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 900) {
        closeMobileMenu();
      }

    },
    { passive: true }
  );


  /* =========================================
     05. TYPING ANIMATION
  ========================================== */

  const words = [
    "Developer",
    "Problem Solver",
    "Creative Thinker",
    "IT Engineering Student"
  ];


  if (typingText) {

    if (reducedMotion) {

      typingText.textContent = words[0];

    } else {

      let word = 0;
      let char = 0;

      let deleting = false;
      let timer;


      const type = () => {

        const current = words[word];

        char += deleting ? -1 : 1;

        typingText.textContent = current.slice(
          0,
          char
        );


        let delay = deleting ? 34 : 68;


        if (
          !deleting &&
          char === current.length
        ) {

          deleting = true;

          delay = 1450;

        } else if (
          deleting &&
          char === 0
        ) {

          deleting = false;

          word = (word + 1) % words.length;

          delay = 320;

        }


        timer = window.setTimeout(
          type,
          delay
        );

      };


      timer = window.setTimeout(
        type,
        550
      );


      document.addEventListener(
        "visibilitychange",
        () => {

          if (document.hidden) {
            window.clearTimeout(timer);
          }

        }
      );

    }

  }
    /* =========================================
     06. SCROLL REVEAL ANIMATIONS
  ========================================== */

  const revealItems = $$(
    ".reveal, .reveal-left, .reveal-right"
  );


  if (
    "IntersectionObserver" in window &&
    !reducedMotion
  ) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("active");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );


    revealItems.forEach((item) => {

      revealObserver.observe(item);

    });

  } else {

    revealItems.forEach((item) => {

      item.classList.add("active");

    });

  }


  /* =========================================
     07. STAGGERED CARD ANIMATIONS
  ========================================== */

  [
    ".profile-grid",
    ".project-grid",
    ".contact-details"
  ].forEach((selector) => {

    const group = $(selector);

    if (!group) {
      return;
    }


    const cards = [...group.children].filter(
      (child) => {

        return child.matches(
          ".profile-card, .project-card, .contact-detail-card"
        );

      }
    );


    cards.forEach((card, index) => {

      card.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 75, 450)}ms`
      );

    });

  });


  /* =========================================
     08. SCROLL STATE MANAGEMENT
     Progress Bar
     Sticky Header
     Active Navigation
     Back To Top Visibility
  ========================================== */

  const navLinks = $$(
    '.nav-links a[href^="#"]'
  );


  const sections = navLinks

    .map((link) => {

      const target = $(
        link.getAttribute("href")
      );

      return target
        ? { link, target }
        : null;

    })

    .filter(Boolean);


  let scrollQueued = false;


  const updateScrollState = () => {

    const y =
      window.scrollY ||
      document.documentElement.scrollTop;


    const max =
      document.documentElement.scrollHeight -
      window.innerHeight;


    const progress =
      max > 0
        ? (y / max) * 100
        : 0;


    /* Scroll progress */

    if (progressBar) {

      progressBar.style.width =
        `${Math.min(progress, 100)}%`;

    }


    /* Sticky header */

    header?.classList.toggle(
      "scrolled",
      y > 24
    );


    /* Back to top visibility */

    backToTop?.classList.toggle(
      "show",
      y > 500
    );


    /* Active navigation */

    const marker = window.innerHeight * 0.38;

    let current = null;


    sections.forEach(({ link, target }) => {

      const rect = target.getBoundingClientRect();

      if (
        rect.top <= marker &&
        rect.bottom > marker
      ) {

        current = link;

      }

    });


    if (
      !current &&
      y < 100 &&
      sections.length
    ) {

      current = sections[0].link;

    }


    navLinks.forEach((link) => {

      const active = link === current;

      link.classList.toggle(
        "active",
        active
      );


      if (active) {

        link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });


    scrollQueued = false;

  };


  /* Run scroll updates efficiently */

  window.addEventListener(
    "scroll",
    () => {

      if (scrollQueued) {
        return;
      }

      scrollQueued = true;

      window.requestAnimationFrame(
        updateScrollState
      );

    },
    { passive: true }
  );


  window.addEventListener(
    "load",
    updateScrollState,
    { once: true }
  );


  updateScrollState();


  /* =========================================
     09. BACK TO TOP BUTTON
  ========================================== */

  backToTop?.addEventListener(
    "click",
    () => {

      window.scrollTo({

        top: 0,

        behavior: reducedMotion
          ? "auto"
          : "smooth"

      });

    }
  );


  /* =========================================
     10. HERO PARALLAX EFFECT
  ========================================== */

  const hero = $(".hero");

  const orbs = $$(".hero-orb");


  if (
    hero &&
    orbs.length &&
    finePointer &&
    !reducedMotion
  ) {

    hero.addEventListener(
      "pointermove",
      (event) => {

        const rect = hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width - 0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height - 0.5;


        orbs.forEach((orb, index) => {

          const depth = (index + 1) * 10;

          orb.style.transform =
            `translate3d(${x * depth}px, ${y * depth}px, 0)`;

        });

      }
    );


    hero.addEventListener(
      "pointerleave",
      () => {

        orbs.forEach((orb) => {

          orb.style.transform = "";

        });

      }
    );

  }


  /* =========================================
     11. PROJECT CARD TILT EFFECT
  ========================================== */

  if (
    finePointer &&
    !reducedMotion
  ) {

    $$(".project-card").forEach((card) => {

      card.addEventListener(
        "pointermove",
        (event) => {

          const rect = card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;


          const rotateX = (0.5 - y) * 3;

          const rotateY = (x - 0.5) * 3;


          card.style.transform =
            `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;

        }
      );


      card.addEventListener(
        "pointerleave",
        () => {

          card.style.transform = "";

        }
      );

    });

  }
    /* =========================================
     12. IMAGE ERROR HANDLING
  ========================================== */

  $$("img").forEach((image) => {

    image.addEventListener(
      "error",
      () => {

        image.classList.add(
          "image-unavailable"
        );

        image.setAttribute(
          "aria-label",
          "Image unavailable. Check assets/images/kalam-profile.jpg"
        );

      }
    );

  });


  /* =========================================
     13. CURRENT YEAR
  ========================================== */

  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }


  /* =========================================
     14. SECURE EXTERNAL LINKS
  ========================================== */

  $$('a[target="_blank"]').forEach((link) => {

    link.setAttribute(
      "rel",
      "noopener noreferrer"
    );

  });


  /* =========================================
     15. JAVASCRIPT ENABLED CLASS
  ========================================== */

  document.documentElement.classList.add(
    "js-enabled"
  );


  /* =========================================
     16. CONSOLE BRANDING
  ========================================== */

  console.info(
    "%cKhan Abdul Kalam · Portfolio",
    "color:#B69A83;font-size:16px;font-weight:800"
  );


})();
