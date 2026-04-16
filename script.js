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

// Home: first scroll exits hero to next section
const overviewSection = document.getElementById("overview");
const homeHero = document.getElementById("home");

if (overviewSection && homeHero) {
  let didAutoJump = false;
  let touchStartY = 0;

  const jumpToOverview = () => {
    if (didAutoJump) return;
    didAutoJump = true;
    overviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (didAutoJump) return;
      const inHero = window.scrollY < 8;
      if (!inHero) return;
      if (e.deltaY > 0) {
        e.preventDefault();
        jumpToOverview();
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
      if (didAutoJump) return;
      const inHero = window.scrollY < 8;
      if (!inHero) return;
      if (!e.touches || e.touches.length === 0) return;
      const delta = touchStartY - e.touches[0].clientY;
      if (delta > 12) {
        jumpToOverview();
      }
    },
    { passive: true }
  );
}
