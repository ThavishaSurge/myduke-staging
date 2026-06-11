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
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: -130,
      loop: true,
      loopAdditionalSlides: 2,
      speed: 600,
      allowTouchMove: false,
      navigation: {
        prevEl: prevBtn || null,
        nextEl: nextBtn || null,
        disabledClass: 'swiper-button-disabled',
      },
      breakpoints: {
        // Desktop breakpoint
        1160: {
          spaceBetween: -190,
        }
      }
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
