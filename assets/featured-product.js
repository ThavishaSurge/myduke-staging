(function () {
  const initProductAccordion = (section) => {
    if (!section || !section.classList.contains("featured-product-section")) {
      return;
    }

    const accordions = section.querySelectorAll(".product-accordion");

    accordions.forEach((accordion) => {
      accordion.addEventListener("click", (event) => {
        const toggleEl = event.target.closest(".product-accordion__toggle");
        if (!toggleEl) return;

        const contentEl = toggleEl.nextElementSibling;
        if (
          !contentEl ||
          !contentEl.classList.contains("product-accordion__content")
        ) {
          return;
        }

        const isActive = toggleEl.classList.contains("active");
        if (!isActive) {
          slideDown(toggleEl, contentEl, 300); // func in global.js
        } else {
          slideUp(toggleEl, contentEl, 300); // func in global.js
        }
      });
    });
  };

  initProductAccordion(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (event) => {
    if (!window.Shopify.designMode) {
      initProductAccordion(event.target);
    }
  });
})();
