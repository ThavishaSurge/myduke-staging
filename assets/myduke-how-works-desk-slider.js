(function () {
  const activeSliders = new Map();

  function initSlider(sectionEl) {
    const sectionId = sectionEl.dataset.sectionId || sectionEl.id;
    const trackEl = sectionEl.querySelector('.js-desk-slider');
    if (!trackEl) return;

    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }

    const prevBtn = sectionEl.querySelector('.js-desk-slider-prev');
    const nextBtn = sectionEl.querySelector('.js-desk-slider-next');

    const swiper = new Swiper(trackEl, {
      slidesPerView: 'auto',
      centeredSlides: true,
      // -133px derived from Figma layout (1482:6211):
      // Inactive slides are visual 283px (71.5% of 396px active).
      // DOM bounding box stays 396px (CSS scale doesn't affect layout).
      // Dead space each side of inactive = (396-283)/2 = 56.5px.
      // Active left edge in Figma = 206.36px, inactive left bounding-box = 206-396+133 = -57px
      // → inactive visual starts at -57+56.5 ≈ 0. Matches Figma exactly.
      spaceBetween: -133,
      speed: 600,
      allowTouchMove: false,
      navigation: {
        prevEl: prevBtn || null,
        nextEl: nextBtn || null,
        disabledClass: 'swiper-button-disabled',
      },
    });

    activeSliders.set(sectionId, swiper);
  }

  function destroySlider(sectionEl) {
    const sectionId = sectionEl.dataset.sectionId || sectionEl.id;
    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }
  }

  function findSection(root) {
    if (!root) return null;
    if (root.classList && root.classList.contains('myduke-how-works-desk-slider-section')) {
      return root;
    }
    return root.querySelector ? root.querySelector('.myduke-how-works-desk-slider-section') : null;
  }

  // ── Boot on page load ──
  document.querySelectorAll('.myduke-how-works-desk-slider-section').forEach(initSlider);

  // ── Re-init on Shopify theme-editor section reload ──
  document.addEventListener('shopify:section:load', function (event) {
    const section = findSection(event.target);
    if (section) initSlider(section);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    const section = findSection(event.target);
    if (section) destroySlider(section);
  });
})();
