(function () {
  const initCollectionSlider = (section) => {
    //if (!section || !section.classList.contains("collection-hero")) return;
    const sliderWrapper = section.querySelector(
      ".collection-hero__slider-wrapper.swiper"
    );
    if (!sliderWrapper) return;

    const slides = sliderWrapper.querySelectorAll(".swiper-slide");
    if (!slides.length) return;

    const prevBtn = section.querySelector(
      ".collection-hero__navigation-button-prev"
    );
    const nextBtn = section.querySelector(
      ".collection-hero__navigation-button-next"
    );

    new Swiper(sliderWrapper, {
      slidesPerView: 3,
      spaceBetween: 12,
      speed: 800,
      allowTouchMove: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      },
      mousewheel: {
        forceToAxis: true,
      },
      breakpoints: {
        750: {
          slidesPerView: 5,
        },
      },
    });
  };

  initCollectionSlider(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (event) => {
    initCollectionSlider(event.target);
  });
})();
