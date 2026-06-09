(function () {
  /**
   * myduke-collection-products-list.js
   * Slider initialisation for:
   *   .mdcpl-section  (myduke-collection-products-list)
   *
   * Relies on Swiper being available globally (swiper-bundle.min.js).
   */

  const activeSliders = new Map(); // sectionId → Swiper instance

  /**
   * Derive responsive breakpoint values from the `data-cards-per-row`
   * attribute so the slider always matches the theme-editor setting.
   */
  function buildBreakpoints(cardsPerRow, spaceBetween) {
    const mobile = cardsPerRow >= 2 ? 2 : 1;
    const sm     = cardsPerRow >= 3 ? 3 : mobile;
    const md     = cardsPerRow >= 4 ? 4 : sm;
    const lg     = cardsPerRow;

    return {
      slidesPerViewMobile: mobile,
      breakpoints: {
        576: { slidesPerView: sm,  spaceBetween },
        768: { slidesPerView: md,  spaceBetween },
        990: { slidesPerView: lg,  spaceBetween },
      },
    };
  }

  function initSlider(section) {
    const sectionId = section.dataset.sectionId;
    const trackEl   = section.querySelector('.js-mdcpl-slider');
    if (!trackEl) return;

    // Destroy any existing instance for this section
    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }

    const cardsPerRow  = Number(trackEl.dataset.cardsPerRow  || 6);
    const spaceBetween = Number(trackEl.dataset.spaceBetween || 24);

    const prevBtn = section.querySelector('.js-mdcpl-prev');
    const nextBtn = section.querySelector('.js-mdcpl-next');

    const { slidesPerViewMobile, breakpoints } = buildBreakpoints(cardsPerRow, spaceBetween);

    const swiper = new Swiper(trackEl, {
      slidesPerView : slidesPerViewMobile,
      spaceBetween  : spaceBetween / 2,
      speed         : 700,
      watchSlideProgress: true,
      allowTouchMove: true,
      mousewheel    : { forceToAxis: true },
      navigation    : {
        prevEl        : prevBtn || null,
        nextEl        : nextBtn || null,
        disabledClass : 'swiper-button-disabled',
      },
      breakpoints,
    });

    activeSliders.set(sectionId, swiper);
  }

  function destroySlider(section) {
    const sectionId = section.dataset.sectionId;
    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }
  }

  function initSection(section) {
    if (!section || !section.classList.contains('mdcpl-section')) return;

    const box = section.querySelector('.mdcpl');
    if (!box) return;

    // The slider track carries the js-mdcpl-slider class only when the
    // Liquid `enable_slider` setting is true.
    const hasSlider = !!box.querySelector('.js-mdcpl-slider');
    if (hasSlider) {
      initSlider(box);
    } else {
      destroySlider(box);
    }
  }

  // ── Boot on current page load ──
  // `document.currentScript.parentElement` is the wrapping <section> element.
  initSection(document.currentScript.parentElement);

  // ── Re-init on Shopify theme-editor section reload ──
  document.addEventListener('shopify:section:load', function (event) {
    initSection(event.target);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    const box = event.target.querySelector('.mdcpl');
    if (box) destroySlider(box);
  });
})();
