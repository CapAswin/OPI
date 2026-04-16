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
