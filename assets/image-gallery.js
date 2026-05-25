(() => {
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";

  const initCursor = (section) => {
    if (!section || !section?.classList.contains("image-gallery-section"))
      return;

    const box = section.querySelector(".image-gallery__wrapper");
    const cursorEl = section.querySelector(".image-gallery__cursor");
    const sliderEl = box?.querySelector(".image-gallery__slider");

    if (!box || !cursorEl) return;

    const slidesCounts = Number(box.getAttribute("data-slides-count"));
    if (slidesCounts <= 1) return;

    const handleMouseMove = (event) => {
      cursorEl.classList.add("active");
      cursorEl.classList.remove("disabled");

      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      cursorEl.classList.toggle(
        "cursor-active_margin",
        event.clientX >= rect.width - 100
      );
      if (!sliderEl?.swiper) return;
      const slider = sliderEl.swiper;

      let isLeftSide = event.clientX < centerX;
      if (isRTL) isLeftSide = !isLeftSide;

      if (isLeftSide) {
        cursorEl.classList.add("prev");
        cursorEl.classList.remove("next");
        cursorEl.textContent = Shopify?.localizedStrings?.prev || "Prev";

        if (box.getAttribute("data-loop") !== "true" && slider.isBeginning) {
          cursorEl.classList.add("disabled");
        }
      } else {
        cursorEl.classList.remove("prev");
        cursorEl.classList.add("next");
        cursorEl.textContent = Shopify?.localizedStrings?.next || "Next";

        if (box.getAttribute("data-loop") !== "true" && slider.isEnd) {
          cursorEl.classList.add("disabled");
        }
      }

      cursorEl.style.left = `${event.clientX - rect.left + 5}px`;
      cursorEl.style.top = `${event.clientY - rect.top + 35}px`;
    };

    const handleMouseLeave = () => {
      cursorEl.classList.remove("active", "disabled");
    };

    const handleClick = (event) => {
      if (event.target.classList.contains("swiper-pagination")) return;

      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const slider = sliderEl?.swiper;
      if (!slider) return;

      const hasNext =
        box.getAttribute("data-loop") === "true" ? true : !slider.isEnd;
      const hasPrev =
        box.getAttribute("data-loop") === "true" ? true : !slider.isBeginning;

      let isLeftSide = event.clientX < centerX;
      if (isRTL) isLeftSide = !isLeftSide;

      if (isLeftSide && hasPrev) {
        slider.slidePrev();
      } else if (!isLeftSide && hasNext) {
        slider.slideNext();
      }
    };

    let isCursorInit = false;

    const enableCursor = () => {
      sliderEl.addEventListener("mousemove", handleMouseMove);
      sliderEl.addEventListener("mouseleave", handleMouseLeave);
      sliderEl.addEventListener("click", handleClick);
      isCursorInit = true;
    };

    const disableCursor = () => {
      sliderEl.removeEventListener("mousemove", handleMouseMove);
      sliderEl.removeEventListener("mouseleave", handleMouseLeave);
      sliderEl.removeEventListener("click", handleClick);
      isCursorInit = false;
    };

    if (
      window.innerWidth >= 990 &&
      window.matchMedia("(pointer:fine)").matches
    ) {
      enableCursor();
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.contentRect.width >= 990) {
          if (!isCursorInit) enableCursor();
        } else {
          if (isCursorInit) disableCursor();
        }
      });
    });

    resizeObserver.observe(section);
  };

  const initSlider = (section) => {
    if (!section || !section?.classList.contains("image-gallery-section"))
      return;

    const box = section.querySelector(".image-gallery__wrapper");
    const sliderEl = box?.querySelector(".image-gallery__slider");

    const nextBtn = section.querySelector(
      ".heading-group__navigation-button-next"
    );
    const prevBtn = section.querySelector(
      ".heading-group__navigation-button-prev"
    );

    if (!box || !sliderEl) return;

    const slidesCounts = Number(box.getAttribute("data-slides-count"));
    if (slidesCounts <= 1) return;

    const loopEnabled = box.getAttribute("data-loop") === "true";

    const swiperParams = {
      speed: 1000,
      direction: isRTL ? "horizontal" : "horizontal",
      rtl: isRTL,
      centeredSlides: loopEnabled,
      slidesPerView: "auto",
      spaceBetween: 12,
      allowTouchMove: true,
      mousewheel: { forceToAxis: true },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        990: {
          spaceBetween: 24,
          slidesPerView: 3,
          centeredSlides: loopEnabled,
        },
        1200: {
          spaceBetween: 24,
          slidesPerView: 3,
          centeredSlides: loopEnabled,
          grabCursor: box.getAttribute("data-navigation") !== "true",
          allowTouchMove: box.getAttribute("data-navigation") !== "true",
        },
      },
    };

    if (box.getAttribute("data-autoplay") === "true") {
      swiperParams.autoplay = { disableOnInteraction: true };
    }

    if (loopEnabled) {
      swiperParams.loop = true;
      swiperParams.loopPreventsSliding = false;
    }

    if (box.getAttribute("data-pagination") === "true") {
      const paginationEl = box.querySelector(".swiper-pagination");
      if (paginationEl) {
        swiperParams.pagination = {
          el: paginationEl,
          clickable: true,
          type: "bullets",
        };
      }
    }

    new Swiper(sliderEl, swiperParams);
  };

  initSlider(document.currentScript.parentElement);
  initCursor(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", function (event) {
    initSlider(event.target);
    initCursor(event.target);
  });
})();
