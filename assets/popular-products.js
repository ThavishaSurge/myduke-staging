(function () {
  const sliders = [];

  const initSliders = (section) => {
    const sliderEls = section.querySelectorAll(".js-popular-products-slider");

    sliderEls.forEach((sliderEl) => {
      const swiperWrapper = sliderEl.querySelector(
        ".popular-products__list--slider"
      );
      const slides = sliderEl.querySelectorAll(".popular-products__item");

      if (!swiperWrapper || !slides || !slides.length) return;

      const productsPerRow = Number(sliderEl.dataset.productsPerRow || 4);
      const productsPerRowMobile = Number(
        sliderEl.dataset.productsPerRowMobile || 1
      );
      const spaceBetween = Number(sliderEl.dataset.spaceBetween || 1);

      const prevBtn = section.querySelector(
        `.heading-group__navigation .heading-group__navigation-button-prev`
      );
      const nextBtn = section.querySelector(
        `.heading-group__navigation .heading-group__navigation-button-next`
      );

      const slidesPerViewMobile = productsPerRowMobile;
      const slidesPerView576 = productsPerRow > 1 ? 2 : 1;
      const slidesPerView990 =
        productsPerRow > 2 ? slidesPerView576 + 1 : slidesPerView576;
      const slidesPerView1200 = productsPerRow >= 4 ? 4 : productsPerRow;
      const slidesPerView1360 = productsPerRow;

      const sliderSettings = {
        slidesPerView: slidesPerViewMobile,
        spaceBetween: spaceBetween / 2,
        speed: 800,
        watchSlideProgress: true,
        allowTouchMove: true,
        mousewheel: {
          forceToAxis: true,
        },
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
          disabledClass: "swiper-button-disabled",
        },
        breakpoints: {
          576: {
            slidesPerView: slidesPerView576,
            spaceBetween: spaceBetween,
          },
          990: {
            slidesPerView: slidesPerView990,
            spaceBetween: spaceBetween,
          },
          1200: {
            slidesPerView: slidesPerView1200,
            spaceBetween: spaceBetween,
          },
          1360: {
            slidesPerView: slidesPerView1360,
            spaceBetween: spaceBetween,
          },
        },
      };

      const slider = new Swiper(sliderEl, sliderSettings);
      sliders.push(slider);
    });
  };

  const destroySliders = () => {
    sliders.forEach((slider) => {
      if (typeof slider.destroy === "function") {
        slider.destroy();
      }
    });
  };

  const initPopularProducts = (section) => {
    if (!section || !section?.classList.contains("popular-products-section")) {
      return;
    }

    const box = section.querySelector(".popular-products");
    if (!box) return;

    const layout = box.dataset.layout || "grid";
    if (layout === "slider") {
      initSliders(box);
    } else {
      destroySliders();
    }
  };

  initPopularProducts(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initPopularProducts(event.target);
  });
})();
