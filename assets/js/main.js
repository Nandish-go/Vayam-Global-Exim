const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector(".mobile-navigation");

if (menuButton && mobileNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileNavigation.classList.toggle("is-open");

    mobileNavigation.hidden = false;
    menuButton.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      mobileNavigation.hidden = true;
    }
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNavigation.classList.remove("is-open");
      mobileNavigation.hidden = true;
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}