(function () {
  const initSlider = (section) => {
    const sliderEl = section.querySelector(".js-featured-products-slider");

    if (!sliderEl) return;

    const nextBtn = section.querySelector(
      ".featured-products__navigation-button-next"
    );
    const prevBtn = section.querySelector(
      ".featured-products__navigation-button-prev"
    );
    const pagination = section.querySelector(".swiper-pagination");

    new Swiper(sliderEl, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 2,
      speed: 800,
      watchSlidesProgress: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      },
      pagination: {
        el: pagination,
        clickable: "true",
        renderBullet: function (activeIndex, className) {
          return (
            '<div class="' + className + '">' + "<span>" + "</span>" + "</div>"
          );
        },
      },
    });
  };

  const destroySlider = (section) => {
    const sliderEl = section.querySelector(".js-featured-products-slider");
    const slides = section.querySelectorAll(
      ".js-featured-products-slider-item"
    );

    if (sliderEl?.swiper) sliderEl.swiper.destroy();

    slides.forEach((slide) => {
      slide.removeAttribute("style");
    });
  };

  const initIntersection = (section) => {
    const title = section.querySelector(".featured-products__title-wrapper");
    if (!title) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            title.classList.add("is-active");
            observer.unobserve(section);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);
  };

  const initHighlightsSwiper = (section) => {
    if (!section || !section.classList.contains("featured-products-section")) {
      return;
    }

    const sliderEl = section.querySelector(".js-featured-products-slider");

    const resizeObserver = new ResizeObserver(() => {
      if (sliderEl?.swiper) {
        destroySlider(section);
      }
      initSlider(section);
    });

    resizeObserver.observe(section);

    initIntersection(section);
  };

  initHighlightsSwiper(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initHighlightsSwiper(event.target);
  });
})();
