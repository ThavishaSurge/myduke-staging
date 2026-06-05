(function () {
  /**
   * myduke-vendor-logos.js
   * Swiper slider for the myduke-vendor-logos section (.mdvl-section)
   */

  const activeSliders = new Map();

  function buildBreakpoints(logosPerRow, spaceBetween) {
    const sm = Math.min(logosPerRow, 3);
    const md = Math.min(logosPerRow, 5);
    const lg = logosPerRow;

    return {
      slidesPerViewMobile: 2,
      breakpoints: {
        576: { slidesPerView: sm, spaceBetween },
        768: { slidesPerView: md, spaceBetween },
        990: { slidesPerView: lg, spaceBetween },
      },
    };
  }

  function initSlider(section) {
    const sectionId = section.dataset.sectionId;
    const trackEl   = section.querySelector('.js-mdvl-slider');
    if (!trackEl) return;

    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }

    const logosPerRow  = Number(trackEl.dataset.logosPerRow  || 6);
    const spaceBetween = Number(trackEl.dataset.spaceBetween || 40);

    const prevBtn = section.querySelector('.js-mdvl-prev');
    const nextBtn = section.querySelector('.js-mdvl-next');

    const { slidesPerViewMobile, breakpoints } = buildBreakpoints(logosPerRow, spaceBetween);

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
    if (!section || !section.classList.contains('mdvl-section')) return;
    const box = section.querySelector('.mdvl');
    if (!box) return;

    if (box.querySelector('.js-mdvl-slider')) {
      initSlider(box);
    } else {
      destroySlider(box);
    }
  }

  initSection(document.currentScript.parentElement);

  document.addEventListener('shopify:section:load',   (e) => initSection(e.target));
  document.addEventListener('shopify:section:unload', (e) => {
    const box = e.target.querySelector('.mdvl');
    if (box) destroySlider(box);
  });
})();
