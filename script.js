const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (menuButton && mobileMenu) {
  const setMobileMenuState = (open) => {
    mobileMenu.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("has-mobile-menu-open", open);
  };

  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    setMobileMenuState(!isOpen);
  });

  mobileMenuClose?.addEventListener("click", () => {
    setMobileMenuState(false);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 820) {
        setMobileMenuState(false);
      }
    },
    { passive: true },
  );
}

/* Landing hero parallax (index #home only) */
const landingHero = document.getElementById("home");
const prefersReducedMotion =
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (landingHero && !prefersReducedMotion) {
  const video = landingHero.querySelector(".hero-video");
  const heroContent = landingHero.querySelector(".hero-content--home");
  let ticking = false;

  const updateParallax = () => {
    const y = window.scrollY;
    const rateVideo = 0.38;
    const rateContent = 0.12;
    if (video) {
      video.style.transform = `translate3d(0, ${y * rateVideo}px, 0) scale(1.08)`;
    }
    if (heroContent) {
      heroContent.style.transform = `translate3d(0, ${y * rateContent}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateParallax();
}

/* Contact — period descriptions + mailto submit (runs on full pages and inside loaded nav cards) */
const PERIOD_HINT_HTML = {
  short: `<strong>Short-term perspective (12–18 months)</strong><br /><span class="inquiry-period-meta">Liquidity-focused · Lower risk · Fixed / semi-fixed returns</span><br /><br />Short-term investments are designed for liquidity and controlled exposure. They are often structured around opportunities that have defined timelines and relatively predictable outcomes.<br /><br />This is where discipline matters the most, because speed without structure becomes risk.`,
  mid: `<strong>Mid-term allocation (18+ to 24 months)</strong><br /><span class="inquiry-period-meta">Balanced growth · Mixed return model</span><br /><br />Mid-term investing allows flexibility. It creates room for both stability and growth, combining fixed structures with performance-driven opportunities.<br /><br />This is where portfolios begin to take shape, not as individual investments, but as a balanced system.`,
  long: `<strong>Long-term wealth creation (24+ months)</strong><br /><span class="inquiry-period-meta">Wealth creation · Equity participation · Asset appreciation</span><br /><br />Long-term investments are where real wealth is built.<br /><br />They are not driven by immediate returns, but by compounding value; through equity participation, asset appreciation, and strategic positioning within growing sectors.`,
};

function initInquiryForm(root = document) {
  const form = root.querySelector("#inquiry-form");
  if (!form || form.dataset.inquiryBound === "1") return;

  const periodSelect = root.querySelector("#inquiry-period");
  const periodHint = root.querySelector("#inquiry-period-hint");

  const syncPeriodHint = () => {
    if (!periodSelect || !periodHint) return;
    const key = periodSelect.value;
    if (key && PERIOD_HINT_HTML[key]) {
      periodHint.innerHTML = PERIOD_HINT_HTML[key];
      periodHint.hidden = false;
    } else {
      periodHint.innerHTML = "";
      periodHint.hidden = true;
    }
  };

  if (periodSelect && periodHint) {
    periodSelect.addEventListener("change", syncPeriodHint);
    syncPeriodHint();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const fullName = root.querySelector("#inquiry-name")?.value?.trim() ?? "";
    const email = root.querySelector("#inquiry-email")?.value?.trim() ?? "";
    const amount = root.querySelector("#inquiry-amount")?.value?.trim() ?? "";
    const currency = root.querySelector("#inquiry-currency")?.value ?? "";
    const period = periodSelect?.value ?? "";
    const periodLabel = periodSelect?.selectedOptions?.[0]?.text?.trim() ?? period;
    const periodPlain = periodHint?.innerText?.replace(/\s+/g, " ").trim() ?? "";

    const lines = [
      "Investor inquiry — Opulent Prime Investment",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Amount: ${amount} ${currency}`,
      "",
      `Period: ${periodLabel}`,
      "",
      "Period detail:",
      periodPlain || "(see selection on website)",
    ];

    const subject = encodeURIComponent("Investor inquiry — Opulent Prime");
    const body = encodeURIComponent(lines.join("\n"));
    const mail = "advisory@opulentprimeinvestment.ae";
    window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  });

  form.dataset.inquiryBound = "1";
}

initInquiryForm(document);

/* Index — stacked nav cards (full-viewport panels over landing) */
const navStackEl = document.getElementById("nav-stack");
const NAV_CARD_ORDER = ["home", "about", "portfolio", "insights", "contact"];
const CARD_FETCH_URL = {
  about: "./about.html",
  portfolio: "./portfolio.html",
  insights: "./insights.html",
  contact: "./contact.html",
};

function stripScripts(root) {
  root.querySelectorAll("script").forEach((n) => n.remove());
}

function cardIdFromHref(href) {
  if (!href) return null;
  try {
    const u = new URL(href, window.location.href);
    const c = u.searchParams.get("card");
    if (c && NAV_CARD_ORDER.includes(c)) return c;
  } catch {
    /* ignore */
  }
  return null;
}

function extractCardBody(doc, id) {
  if (id === "contact") {
    const main = doc.querySelector("main");
    const wrap = document.createElement("div");
    wrap.className = "page-card-content";
    const hero = main?.querySelector(".hero-content.page.hero-content--contact");
    const below = main?.querySelector(".home-below-hero");
    if (hero) wrap.appendChild(hero.cloneNode(true));
    if (below) wrap.appendChild(below.cloneNode(true));
    stripScripts(wrap);
    return wrap;
  }
  const node = doc.querySelector("#page-card-content");
  if (!node) return null;
  const clone = node.cloneNode(true);
  stripScripts(clone);
  return clone;
}

/** Deck stack: first card sits 10px below landing navbar, +10px per layer. */
function stackTopInsetPx(index) {
  const siteHeader = document.getElementById("site-header");
  const headerBottom = siteHeader?.getBoundingClientRect?.().bottom ?? 0;
  const baseInset = Math.max(10, Math.round(headerBottom + 10));
  return baseInset + index * 10;
}

function layoutStackDeck(stack, panels) {
  stack.forEach((id, idx) => {
    const el = panels.get(id);
    if (!el) return;
    el.style.zIndex = String(5000 + idx * 2);
    const topPx = stackTopInsetPx(idx);
    el.style.top = `${topPx}px`;
    el.style.left = "0";
    el.style.right = "0";
    el.style.bottom = "0";
  });
}

function syncNavAria(stack) {
  const activeId = stack.length ? stack[stack.length - 1] : "home";
  document.querySelectorAll("[data-nav-card]").forEach((el) => {
    const id = el.dataset.navCard || cardIdFromHref(el.getAttribute("href"));
    if (!id || !NAV_CARD_ORDER.includes(id)) return;
    const isCurrent = id === activeId;
    el.classList.toggle("current", isCurrent);
    if (el.tagName === "A") {
      if (isCurrent) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    }
  });
}

if (navStackEl) {
  const panels = new Map();
  const fetchCache = new Map();
  let stack = [];

  const homePanel = document.getElementById("nav-card-home");
  if (homePanel) panels.set("home", homePanel);

  function setShellOpen(open) {
    document.body.classList.toggle("has-nav-card-open", open);
    navStackEl.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function replaceUrlForStack() {
    const top = stack.length ? stack[stack.length - 1] : null;
    const next = top ? `./index.html?card=${encodeURIComponent(top)}` : "./index.html";
    window.history.replaceState({}, "", next);
  }

  function openPanelEl(el, animate) {
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    el.classList.toggle("nav-card--instant", !animate);
    void el.offsetWidth;
    el.classList.add("nav-card--open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove("nav-card--instant");
      });
    });
  }

  function closePanelEl(el) {
    return new Promise((resolve) => {
      const done = () => {
        el.removeEventListener("transitionend", onEnd);
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
        el.classList.remove("nav-card--open");
        resolve();
      };
      const onEnd = (ev) => {
        if (ev.propertyName !== "transform") return;
        done();
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        done();
        return;
      }
      el.addEventListener("transitionend", onEnd);
      el.classList.remove("nav-card--open");
      window.setTimeout(done, 600);
    });
  }

  async function ensureRemotePanel(id) {
    if (panels.has(id)) return panels.get(id);
    const url = CARD_FETCH_URL[id];
    if (!url) return null;

    let html = fetchCache.get(id);
    if (!html) {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      html = await res.text();
      fetchCache.set(id, html);
    }

    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = extractCardBody(doc, id);
    if (!body) throw new Error(`No extractable content for ${id}`);

    const article = document.createElement("article");
    article.className = "nav-card";
    article.dataset.cardId = id;
    article.setAttribute("hidden", "");
    article.setAttribute("aria-hidden", "true");
    article.innerHTML = `
      <div class="nav-card-toolbar">
        <button type="button" class="nav-card-back" aria-label="Close panel">Back</button>
      </div>
      <div class="nav-card-scroll"></div>
    `;
    article.querySelector(".nav-card-scroll").appendChild(body);
    navStackEl.appendChild(article);
    panels.set(id, article);
    return article;
  }

  async function ensurePanelReady(id) {
    if (id === "home") return homePanel;
    return ensureRemotePanel(id);
  }

  async function ensurePanelOpen(id, { animate }) {
    const el = await ensurePanelReady(id);
    if (!el) return;
    if (!el.classList.contains("nav-card--open")) {
      openPanelEl(el, animate);
    }
  }

  async function openNavCard(cardId) {
    if (!NAV_CARD_ORDER.includes(cardId)) return;

    const existing = stack.indexOf(cardId);
    if (existing !== -1) {
      while (stack.length > existing + 1) {
        const topId = stack.pop();
        const topEl = panels.get(topId);
        if (topEl) await closePanelEl(topEl);
      }
      layoutStackDeck(stack, panels);
      syncNavAria(stack);
      replaceUrlForStack();
      setShellOpen(stack.length > 0);
      return;
    }

    const idx = NAV_CARD_ORDER.indexOf(cardId);
    for (let k = 0; k < idx; k += 1) {
      const pid = NAV_CARD_ORDER[k];
      if (!stack.includes(pid)) {
        await ensurePanelOpen(pid, { animate: false });
        stack.push(pid);
        layoutStackDeck(stack, panels);
      }
    }

    if (!stack.includes(cardId)) {
      await ensurePanelOpen(cardId, { animate: true });
      stack.push(cardId);
      layoutStackDeck(stack, panels);
    }

    syncNavAria(stack);
    replaceUrlForStack();
    setShellOpen(stack.length > 0);

    if (cardId === "contact") {
      const contactRoot = panels.get("contact");
      if (contactRoot) initInquiryForm(contactRoot);
    }
  }

  async function closeTopCard() {
    if (!stack.length) return;
    const topId = stack.pop();
    const topEl = panels.get(topId);
    if (topEl) await closePanelEl(topEl);
    layoutStackDeck(stack, panels);
    syncNavAria(stack);
    replaceUrlForStack();
    setShellOpen(stack.length > 0);
  }

  async function closeAllCards() {
    while (stack.length) {
      await closeTopCard();
    }
  }

  navStackEl.addEventListener("click", (e) => {
    if (e.target.closest(".nav-card-back")) {
      e.preventDefault();
      closeTopCard();
    }
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav-card]");
    if (!a) return;
    const id = a.dataset.navCard;
    if (!id) return;
    e.preventDefault();
    openNavCard(id).catch(() => {
      window.location.href = a.getAttribute("href") || "./index.html";
    });
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("has-mobile-menu-open");
    }
  });

  const brand = document.querySelector(".brand-mark");
  brand?.addEventListener("click", (e) => {
    if (!stack.length) return;
    e.preventDefault();
    closeAllCards();
    window.history.replaceState({}, "", "./index.html");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const overviewLink = document.querySelector("[data-open-overview]");
  overviewLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openNavCard("home")
      .then(() => {
        document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(() => {});
  });

  window.addEventListener(
    "resize",
    () => {
      if (!stack.length) return;
      layoutStackDeck(stack, panels);
    },
    { passive: true },
  );

  const initial = cardIdFromHref(window.location.href);
  if (initial) {
    openNavCard(initial).catch(() => {});
  }
}
