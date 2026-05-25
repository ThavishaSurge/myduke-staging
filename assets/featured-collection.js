(function () {
  const initFeaturedCollection = (section) => {
    if (!section || !section.classList.contains("featured-collection-section"))
      return;

    /* =========================================
       PRODUCTS ANIMATION
    ========================================= */

    const productItems = section.querySelectorAll(
      ".featured-collection-products__item"
    );

    if (productItems.length) {
      const productsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("animate-in");

            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );

      productItems.forEach((item) => productsObserver.observe(item));

      section.addEventListener("shopify:section:unload", () => {
        productsObserver.disconnect();
      });
    }


    /* =========================================
       IMAGES ANIMATION
    ========================================= */

    const animationItems = section.querySelectorAll(
      ".featured-collection__animation-wrapper"
    );

    if (animationItems.length) {
      const imagesObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            el.classList.add("animate");

            setTimeout(() => {
              el.classList.add("reveal--show");
            }, 500);

            observer.unobserve(el);
          });
        },
        { threshold: 0.4 }
      );

      animationItems.forEach((el) => imagesObserver.observe(el));

      section.addEventListener("shopify:section:unload", () => {
        imagesObserver.disconnect();
      });
    }
  };

  const section = document.currentScript?.parentElement;

  if (section) {
    initFeaturedCollection(section);
  }

  /* Shopify Customizer */
  document.addEventListener("shopify:section:load", (event) => {
    if (!window.Shopify.designMode) return;
    initFeaturedCollection(event.target);
  });
})();
