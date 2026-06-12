(function () {
  const activeSliders = new Map();
  const MQ = window.matchMedia('(max-width: 749px)');

  function initSlider(sectionEl) {
    const sectionId = sectionEl.dataset.sectionId || sectionEl.id;
    const trackEl = sectionEl.querySelector('.js-mob-slider');
    if (!trackEl) return;

    if (activeSliders.has(sectionId)) {
      activeSliders.get(sectionId).destroy(true, true);
      activeSliders.delete(sectionId);
    }

    const prevBtn = sectionEl.querySelector('.js-mob-slider-prev');
    const nextBtn = sectionEl.querySelector('.js-mob-slider-next');
    const thumbBtns = sectionEl.querySelectorAll('.js-mob-thumb');

    function updateThumbs(index) {
      thumbBtns.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === index);
      });
    }

    const swiper = new Swiper(trackEl, {
      slidesPerView: 1,
      loop: false,
      speed: 400,
      allowTouchMove: true,
      navigation: {
        prevEl: prevBtn || null,
        nextEl: nextBtn || null,
        disabledClass: 'swiper-button-disabled',
      },
      on: {
        slideChange: function () {
          updateThumbs(this.activeIndex);
        },
      },
    });

    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        swiper.slideTo(parseInt(btn.dataset.index, 10));
      });
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
    if (root.classList && root.classList.contains('myduke-how-works-mob-slider-section')) {
      return root;
    }
    return root.querySelector ? root.querySelector('.myduke-how-works-mob-slider-section') : null;
  }

  function initAll() {
    document.querySelectorAll('.myduke-how-works-mob-slider-section').forEach(initSlider);
  }

  function destroyAll() {
    document.querySelectorAll('.myduke-how-works-mob-slider-section').forEach(destroySlider);
  }

  // Only initialise at mobile viewport widths — never touch the desktop slider
  if (MQ.matches) {
    initAll();
  }

  MQ.addEventListener('change', function (e) {
    if (e.matches) {
      initAll();
    } else {
      destroyAll();
    }
  });

  // ── Shopify theme-editor events ──
  document.addEventListener('shopify:section:load', function (event) {
    const section = findSection(event.target);
    if (section && MQ.matches) initSlider(section);
  });

  document.addEventListener('shopify:section:unload', function (event) {
    const section = findSection(event.target);
    if (section) destroySlider(section);
  });
})();
