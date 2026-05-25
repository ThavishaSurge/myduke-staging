(function () {
  let imagesSlider;
  let contentSlider;
  let isCursorInit;

  const animateLines = (lines, delay = 0) => {
    lines.forEach((line, i) => {
      line.classList.add("animated");
      Array.from(line.children).forEach((element) => {
        element.style.animationDelay = `${delay + i * 0.15}s`;
        setTimeout(() => {
          line.style.overflow = "visible";
        }, delay * 1000 + i * 150 + 600);
      });
    });
  };

  const headingAnimation = (section) => {
    if (!section || !section.classList.contains("testimonials-section")) return;

    const wrapper = section.querySelector(".testimonials__wrapper");
    if (!wrapper || !wrapper.getAttribute("data-text-animation")) return;

    const texts = section.querySelectorAll(
      ".testimonials__content-text--animation"
    );
    let splitInstances = [];

    const splitHeadings = () => {
      const headings = section.querySelectorAll(".js-split-text");
      if (headings.length === 0) return;
      if (splitInstances.length > 0) {
        splitInstances.forEach((instance) => {
          requestAnimationFrame(() => {
            instance.split({ types: "lines, words" });
          });
        });
      } else {
        headings.forEach((heading) => {
          const split = new SplitType(heading, { types: "lines, words" });
          splitInstances.push(split);
          heading.classList.add("visible");
        });
      }
    };

    if (window.SplitType?.clearData) {
      window.SplitType.clearData();
    }

    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const lines = entry.target.querySelectorAll(".js-split-text .line");
        const autoplayEnabled =
          section.querySelector(".js-content-slider").dataset.autoplay;

        const slider = section.querySelector(".js-content-slider").swiper;
        if (entry.isIntersecting) {
          const speed = 0.8;
          animateLines(lines, speed);
          if (autoplayEnabled === "true" && slider.autoplay.running) {
            section
              .querySelector(".swiper-slide-active .circle")
              .classList.add("run");
          }
        } else {
          lines.forEach((line) => {
            line.classList.remove("animated");
            line.style.overflow = "hidden";
          });
        }
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      splitHeadings();
      texts.forEach((text) => textObserver.observe(text));
    });

    splitHeadings();
    texts.forEach((text) => {
      textObserver.observe(text);
      resizeObserver.observe(text);
    });
  };

  const initSliders = (section) => {
    if (!section || !section.classList.contains("testimonials-section")) return;

    const initImagesSlider = () => {
      const imagesSliderEl = section.querySelector(".js-media-slider");
      if (!imagesSliderEl) return;

      const autoplayConfig = false;

      imagesSlider = new Swiper(imagesSliderEl, {
        slidesPerView: 1,
        spaceBetween: 1,
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: 800,
        allowTouchMove: true,
        mousewheel: { forceToAxis: true },
        autoplay: autoplayConfig,
      });
    };

    const initContentSlider = () => {
      const contentSliderEl = section.querySelector(".js-content-slider");
      const slides = contentSliderEl?.querySelectorAll(".swiper-slide");
      if (!contentSliderEl || !slides) return;

      const pagination = section.querySelector(".swiper-pagination");
      const prevButton = section.querySelector(".swiper-button-prev");
      const nextButton = section.querySelector(".swiper-button-next");

      const autoplayEnabled = contentSliderEl.dataset.autoplay;
      const autoplayDelay =
        Number(contentSliderEl.dataset.swiperAutoplay) || 5000;

      const autoplayConfig =
        autoplayEnabled === "true"
          ? { delay: autoplayDelay, disableOnInteraction: false }
          : false;

      const sliderDesktopEvents = {
        init: function () {
          section.classList.add("testimonials--slider-isBeggining");
        },
        slideChange: function () {
          if (this.isBeginning) {
            section.classList.add("testimonials--slider-isBeggining");
          } else {
            section.classList.remove("testimonials--slider-isBeggining");
          }

          if (this.isEnd) {
            section.classList.add("testimonials--slider-isEnd");
          } else {
            section.classList.remove("testimonials--slider-isEnd");
          }

          slides.forEach((slide, i) => {
            if (i !== this.activeIndex) {
              const heading = slide.querySelector(".js-split-text");
              if (heading) {
                heading.querySelectorAll(".line").forEach((line) => {
                  line.classList.remove("animated");
                  line.style.overflow = "hidden";
                });
              }
            }
          });
        },
        transitionEnd: function () {
          const activeSlide = this.slides[this.activeIndex];
          const headingSlide = activeSlide.querySelector(".js-split-text");
          if (headingSlide) {
            animateLines(headingSlide.querySelectorAll(".line"), 0.8);
          }
        },
      };

      contentSlider = new Swiper(contentSliderEl, {
        slidesPerView: 1,
        spaceBetween: 1,
        speed: 800,
        allowTouchMove: true,
        mousewheel: { forceToAxis: true },
        pagination: {
          el: pagination,
          clickable: "true",
          renderBullet: function (activeIndex, className) {
            return (
              '<div class="' +
              className +
              '">' +
              "<span>" +
              "</span>" +
              "</div>"
            );
          },
        },
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
          disabledClass: "swiper-button-disabled",
        },
        autoplay: autoplayConfig,
        on: {
          ...sliderDesktopEvents,
          slideChangeTransitionEnd() {
            if (autoplayEnabled === "true") {
              document
                .querySelectorAll(".swiper-slide-active #shape")
                .forEach((el) => {
                  el.classList.add("start-spin");
                });
              document
                .querySelectorAll(".swiper-slide-active #shape1")
                .forEach((el) => {
                  el.classList.add("start-spin");
                });
              if (this.autoplay.running) {
                section
                  .querySelector(".swiper-slide-active .circle")
                  .classList.add("run");
              }
            }
          },
          slideChange() {
            if (autoplayEnabled === "true") {
              document
                .querySelectorAll(
                  ".swiper-slide:not(.swiper-slide-active) .circle"
                )
                .forEach((el) => {
                  el.classList.remove("run");
                });

              if (!this.autoplay.running) {
                document
                  .querySelectorAll(".swiper-slide .circle")
                  .forEach((el) => {
                    el.classList.remove("run");
                  });
              }
            }
          },
        },
      });

      if (autoplayEnabled === "true") {
        const id = section.id;
        const contentEl = section.querySelector(".testimonials__content");
        if (contentEl) {
          contentEl.addEventListener("mouseenter", () => {
            document
              .querySelectorAll(
                ".swiper-slide-active #shape, .swiper-slide-active #shape1"
              )
              .forEach((el) => el.classList.remove("start-spin"));
            if (contentSlider?.autoplay) contentSlider.autoplay.stop();
          });

          contentEl.addEventListener("mouseleave", () => {
            document
              .querySelectorAll(
                ".swiper-slide-active #shape, .swiper-slide-active #shape1"
              )
              .forEach((el) => el.classList.add("start-spin"));
            if (contentSlider?.autoplay) contentSlider.autoplay.start();
          });
        }
      }
    };

    initImagesSlider();
    initContentSlider();

    if (contentSlider && imagesSlider) {
      contentSlider.controller.control = imagesSlider;
      imagesSlider.controller.control = contentSlider;
    }

    const stopAutoplay =
      section.querySelector(".js-content-slider")?.dataset.stopAutoplay;
    const enableAutoplay =
      section.querySelector(".js-content-slider")?.dataset.autoplay;

    if (enableAutoplay === "true" && stopAutoplay === "true") {
      section
        .querySelector(".testimonials__wrapper")
        .addEventListener("mouseenter", function () {
          contentSlider.autoplay.stop();
          section
            .querySelector(".swiper-slide-active .circle")
            .classList.remove("run");
        });
      section
        .querySelector(".testimonials__wrapper")
        .addEventListener("mouseleave", function () {
          contentSlider.autoplay.start();
          section
            .querySelector(".swiper-slide-active .circle")
            .classList.add("run");
        });
    }
  };

  initSliders(document.currentScript.parentElement);
  headingAnimation(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (event) => {
    initSliders(event.target);
    headingAnimation(event.target);
  });
})();
