const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    menuButton.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
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

/* Contact — period descriptions + mailto submit */
const inquiryForm = document.getElementById("inquiry-form");
const periodSelect = document.getElementById("inquiry-period");
const periodHint = document.getElementById("inquiry-period-hint");

const PERIOD_HINT_HTML = {
  short: `<strong>Short-term perspective (12–18 months)</strong><br /><span class="inquiry-period-meta">Liquidity-focused · Lower risk · Fixed / semi-fixed returns</span><br /><br />Short-term investments are designed for liquidity and controlled exposure. They are often structured around opportunities that have defined timelines and relatively predictable outcomes.<br /><br />This is where discipline matters the most, because speed without structure becomes risk.`,
  mid: `<strong>Mid-term allocation (18+ to 24 months)</strong><br /><span class="inquiry-period-meta">Balanced growth · Mixed return model</span><br /><br />Mid-term investing allows flexibility. It creates room for both stability and growth, combining fixed structures with performance-driven opportunities.<br /><br />This is where portfolios begin to take shape, not as individual investments, but as a balanced system.`,
  long: `<strong>Long-term wealth creation (24+ months)</strong><br /><span class="inquiry-period-meta">Wealth creation · Equity participation · Asset appreciation</span><br /><br />Long-term investments are where real wealth is built.<br /><br />They are not driven by immediate returns, but by compounding value; through equity participation, asset appreciation, and strategic positioning within growing sectors.`,
};

if (periodSelect && periodHint) {
  const syncPeriodHint = () => {
    const key = periodSelect.value;
    if (key && PERIOD_HINT_HTML[key]) {
      periodHint.innerHTML = PERIOD_HINT_HTML[key];
      periodHint.hidden = false;
    } else {
      periodHint.innerHTML = "";
      periodHint.hidden = true;
    }
  };
  periodSelect.addEventListener("change", syncPeriodHint);
  syncPeriodHint();
}

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;

    const fullName = document.getElementById("inquiry-name")?.value?.trim() ?? "";
    const email = document.getElementById("inquiry-email")?.value?.trim() ?? "";
    const amount = document.getElementById("inquiry-amount")?.value?.trim() ?? "";
    const currency = document.getElementById("inquiry-currency")?.value ?? "";
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
}
