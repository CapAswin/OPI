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

// Burn effect on scroll
const burnEl = document.getElementById("hero-burn");
const heroSection = document.querySelector(".hero-frame");

if (burnEl && heroSection) {
  const updateBurn = () => {
    const heroH = heroSection.offsetHeight;
    const progress = Math.min(window.scrollY / (heroH * 0.75), 1);
    burnEl.style.opacity = progress;
  };
  window.addEventListener("scroll", updateBurn, { passive: true });
  updateBurn();
}

// Landing hero: downward interaction exits to next section below
const landingHero = document.querySelector("main > section.hero-frame");
const nextSection = landingHero ? landingHero.nextElementSibling : null;
const scrollIndicator = landingHero ? landingHero.querySelector(".scroll-indicator") : null;

if (landingHero && nextSection) {
  let touchStartY = 0;

  const isInLandingHero = () => window.scrollY < landingHero.offsetHeight - 40;
  const isAtTopOfNextSection = () => {
    const y = window.scrollY;
    const top = nextSection.offsetTop;
    return y >= top - 6 && y <= top + 60;
  };

  const jumpToNextSection = () => {
    nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumpToHero = () => {
    landingHero.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (isInLandingHero() && e.deltaY > 0) {
        e.preventDefault();
        jumpToNextSection();
        return;
      }

      if (isAtTopOfNextSection() && e.deltaY < 0) {
        e.preventDefault();
        jumpToHero();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const delta = touchStartY - e.touches[0].clientY;

      // swipe up while in hero -> next section
      if (isInLandingHero() && delta > 12) jumpToNextSection();

      // swipe down while at top of next section -> hero
      if (isAtTopOfNextSection() && delta < -12) jumpToHero();
    },
    { passive: true }
  );

  window.addEventListener("keydown", (e) => {
    const wantsDown =
      e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
    const wantsUp = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);

    if (wantsDown && isInLandingHero()) {
      e.preventDefault();
      jumpToNextSection();
    }

    if (wantsUp && isAtTopOfNextSection()) {
      e.preventDefault();
      jumpToHero();
    }
  });

  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", (e) => {
      e.preventDefault();
      jumpToNextSection();
    });
  }
}
