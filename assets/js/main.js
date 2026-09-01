document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector(".mobile-navigation");
const mainContent = document.querySelector("main");
const siteFooter = document.querySelector(".site-footer");
let lastFocusedElement = null;

const setHeaderState = () => {
  if (header) {
    const heroBoundary = hero ? hero.offsetTop + hero.offsetHeight : 24;
    header.classList.toggle("is-scrolled", window.scrollY >= heroBoundary - 1);
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", setHeaderState);

const setBackgroundInert = (isInert) => {
  [mainContent, siteFooter].forEach((element) => {
    if (element) element.inert = isInert;
  });
};

const closeMenu = ({ restoreFocus = false } = {}) => {
  if (!menuButton || !mobileNavigation || !header) return;

  mobileNavigation.classList.remove("is-open");
  mobileNavigation.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  setBackgroundInert(false);

  if (restoreFocus && lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

const openMenu = () => {
  if (!menuButton || !mobileNavigation || !header) return;

  lastFocusedElement = document.activeElement;
  mobileNavigation.hidden = false;
  mobileNavigation.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation menu");
  header.classList.add("menu-active");
  document.body.classList.add("menu-open");
  setBackgroundInert(true);

  mobileNavigation.querySelector("a")?.focus();
};

if (menuButton && mobileNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key === "Tab" && isOpen) {
      const focusableItems = [menuButton, ...mobileNavigation.querySelectorAll("a[href]")];
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960 && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

}

const productBrowser = document.querySelector("[data-product-browser]");

if (productBrowser) {
  const image = productBrowser.querySelector("[data-product-image]");
  const visual = productBrowser.querySelector(".product-visual");
  const label = productBrowser.querySelector("[data-product-label]");
  const categories = [...productBrowser.querySelectorAll(".product-category")];

  const selectCategory = (category) => {
    if (category.classList.contains("is-active") || !image || !visual || !label) return;

    categories.forEach((item) => {
      const isSelected = item === category;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    const nextImage = new Image();
    nextImage.src = category.dataset.image;
    nextImage.alt = category.dataset.alt;
    visual.classList.add("is-changing");

    const updateImage = () => {
      image.src = category.dataset.image;
      image.alt = category.dataset.alt;
      label.textContent = category.dataset.label;
      requestAnimationFrame(() => visual.classList.remove("is-changing"));
    };

    if (nextImage.complete) {
      updateImage();
    } else {
      nextImage.addEventListener("load", updateImage, { once: true });
      nextImage.addEventListener("error", () => visual.classList.remove("is-changing"), { once: true });
    }
  };

  categories.forEach((category) => {
    category.addEventListener("click", () => selectCategory(category));
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const rfqForm = document.querySelector("[data-rfq-form]");
const formStatus = document.querySelector("[data-form-status]");

if (rfqForm && formStatus) {
  rfqForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!rfqForm.reportValidity()) return;

    formStatus.textContent = "Your requirement is structured and ready. Form delivery will be connected after the concept is approved; no information has been sent yet.";
    formStatus.classList.add("is-visible");
    formStatus.focus();
  });
}

const yearElement = document.querySelector("[data-current-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
