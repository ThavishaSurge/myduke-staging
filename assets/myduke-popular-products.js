(function () {
  /**
   * myduke-popular-products.js
   * Shared slider initialisation for:
   *   .mdpp-section  (myduke-popular-products & myduke-manual-products)
   *
   * Relies on Swiper being available globally (swiper-bundle.min.js).
   */

  const activeSliders = new Map(); // sectionId → Swiper instance

  /**
   * Derive responsive breakpoint values from the `data-cards-per-row`
   * attribute so the slider always matches the theme-editor setting.
   */
  function buildBreakpoints(cardsPerRow, spaceBetween) {
    const sm     = cardsPerRow >= 3 ? 3 : 2;
    const md     = cardsPerRow >= 4 ? 4 : sm;
    const lg     = cardsPerRow;

    return {
      slidesPerViewMobile: 2,
      breakpoints: {
        576: { slidesPerView: sm,   spaceBetween, grid: { rows: 1 }, slidesPerGroup: 1 },
        768: { slidesPerView: md,   spaceBetween, grid: { rows: 1 }, slidesPerGroup: 1 },
        990: { slidesPerView: lg,   spaceBetween, grid: { rows: 1 }, slidesPerGroup: 1 },
      },
    };
  }

  function initSlider(section) {
    const sectionId  = section.dataset.sectionId;
    const trackEl    = section.querySelector('.js-mdpp-slider');
    if (!trackEl) return;

    // Destroy any existing instance for this section
    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }

    const cardsPerRow  = Number(trackEl.dataset.cardsPerRow  || 6);
    const spaceBetween = Number(trackEl.dataset.spaceBetween || 24);

    const prevBtn = section.querySelector('.js-mdpp-prev');
    const nextBtn = section.querySelector('.js-mdpp-next');

    const { slidesPerViewMobile, breakpoints } = buildBreakpoints(cardsPerRow, spaceBetween);

    const swiper = new Swiper(trackEl, {
      slidesPerView : slidesPerViewMobile,
      slidesPerGroup: slidesPerViewMobile,
      grid: {
        rows: 2,
        fill: 'row'
      },
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
    if (!section || !section.classList.contains('mdpp-section')) return;

    const box = section.querySelector('.mdpp');
    if (!box) return;

    // The slider track carries the js-mdpp-slider class only when the
    // Liquid `enable_slider` setting is true.
    const hasSlider = !!box.querySelector('.js-mdpp-slider');
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
    const box = event.target.querySelector('.mdpp');
    if (box) destroySlider(box);
  });
})();
