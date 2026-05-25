(function () {
  const initMainSlider = (section) => {
    if (!section || !section.classList.contains("product-section")) {
      return;
    }

    const sliderEl = section.querySelector(".js-media-list");
    if (!sliderEl) return;

    const desktopType = sliderEl.dataset?.desktopType || "slider";
    const mobileType = sliderEl.dataset?.mobileType || "slider";
    const hasDesktopZoom = sliderEl.dataset?.hasDesktopZoom === "true";
    const navPrev = sliderEl.querySelector(".swiper-button-prev");
    const navNext = sliderEl.querySelector(".swiper-button-next");
    const mediaBox = sliderEl.closest(".product__media");
    const thumbsSlider = mediaBox?.querySelector(".js-media-sublist");

    const isLoop = sliderEl.querySelectorAll(".swiper-slide").length > 3;

    const initSwiper = () => {
      new Swiper(sliderEl, {
        slidesPerView: mobileType === "slider" ? "auto" : 1,
        spaceBetween: 0,
        autoHeight: false,
        loop: isLoop,
        direction: "horizontal",
        speed: 800,
        allowTouchMove: true,
        watchSlidesProgress: true,
        mousewheel: {
          forceToAxis: true,
        },
        navigation: {
          nextEl: navNext,
          prevEl: navPrev,
        },
        breakpoints: {
          990: {
            slidesPerView: desktopType === "slider" ? "auto" : 1,
            allowTouchMove: !hasDesktopZoom,
          },
        },
        thumbs: {
          swiper: thumbsSlider?.swiper ? thumbsSlider.swiper : "",
        },
        on: {
          slideChangeTransitionStart: function () {
            if (thumbsSlider && thumbsSlider.swiper) {
              //thumbsSlider.swiper.slideTo(activeIndex);

              const activeIndex = isLoop ? this.realIndex : this.activeIndex;
              const thumbs = thumbsSlider.swiper;
              const centeredIndex = activeIndex - 1;
              thumbs.slideTo(centeredIndex < 0 ? 0 : centeredIndex, 300);
            }
          },
          slideChange: function () {
            //window.pauseAllMedia();
            window.pauseAllModels();
            this.params.noSwiping = false;
          },
          slideChangeTransitionEnd: function () {
            const activeIndex = isLoop ? this.realIndex : this.activeIndex;
            const model3D =
              this.slides[activeIndex]?.querySelector("model-viewer");
            const posterBtn3D = this.slides[activeIndex]?.querySelector(
              ".shopify-model-viewer-ui__button--poster"
            );
            if (model3D && posterBtn3D) {
              posterBtn3D.removeAttribute("hidden");
            }
          },
          touchStart: function () {
            const activeIndex = isLoop ? this.realIndex : this.activeIndex;
            const model3D =
              this.slides[activeIndex]?.querySelector("model-viewer");
            if (model3D) {
              if (
                !model3D.classList.contains("shopify-model-viewer-ui__disabled")
              ) {
                this.params.noSwiping = true;
                this.params.noSwipingClass = "swiper-slide";
              } else {
                this.params.noSwiping = false;
              }
            }
          },
        },
      });
      /* --- FIX: local video --- */
      const videos = sliderEl.querySelectorAll("video");
      videos.forEach((video) => {
        const update = () => {
          if (!sliderEl.swiper) return;
          [10, 100, 300, 500].forEach((ms) =>
            setTimeout(() => sliderEl.swiper.update(), ms)
          );
        };
        video.addEventListener("loadedmetadata", update);
        video.addEventListener("loadeddata", update);
        video.addEventListener("canplay", update);
        if (video.readyState >= 2) update();
      });

      /* --- FIX: iframe (Vimeo, other...) --- */
      const iframes = sliderEl.querySelectorAll(
        "iframe:not([src*='youtube.com'])"
      );
      iframes.forEach((iframe) => {
        const update = () => {
          if (!sliderEl.swiper) return;
          [10, 100, 300, 500].forEach((ms) =>
            setTimeout(() => sliderEl.swiper.update(), ms)
          );
        };
        iframe.addEventListener("load", update);
        if (iframe.contentWindow) update();
      });

      /* --- FIX: YouTube iframe --- */
      const youtubeIframes = sliderEl.querySelectorAll(
        'iframe[src*="youtube.com"]'
      );
      youtubeIframes.forEach((iframe) => {
        if (typeof YT === "undefined") return;
        new YT.Player(iframe, {
          events: {
            onReady: () => {
              if (!sliderEl.swiper) return;
              [10, 100, 300, 500].forEach((ms) =>
                setTimeout(() => sliderEl.swiper.update(), ms)
              );
            },
          },
        });
      });
    };

    const destroySwiper = () => {
      if (sliderEl.swiper) {
        sliderEl.swiper.destroy();
      }
      sliderEl.querySelectorAll(".swiper-wrapper").forEach((wrapper) => {
        wrapper.removeAttribute("style");
      });
      sliderEl.querySelectorAll(".swiper-slide").forEach((slide) => {
        slide.removeAttribute("style");
      });
    };

    const hasDesktopSwiper =
      desktopType === "slider" || desktopType == "slider_previews";
    const hasMobileSwiper =
      mobileType === "slider" || mobileType == "slider_previews";

    if (hasDesktopSwiper && hasMobileSwiper) {
      initSwiper();
    } else {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (window.innerWidth >= 990 && hasDesktopSwiper) {
            initSwiper();
            return;
          }

          if (window.innerWidth < 990 && hasMobileSwiper) {
            initSwiper();
            return;
          }

          destroySwiper();
        });
      });

      resizeObserver.observe(section);
    }
  };

  const initSubSlider = (section) => {
    if (!section || !section.classList.contains("product-section")) {
      return;
    }

    const sliderEl = section.querySelector(".js-media-sublist");
    if (!sliderEl) return;

    const desktopType = sliderEl.dataset?.desktopType || "slider";
    const mobileType = sliderEl.dataset?.mobileType || "slider";
    const hasDesktopSwiper = desktopType === "slider_previews";
    const hasMobileSwiper = mobileType === "slider_previews";

    const isLoop = sliderEl.querySelectorAll(".swiper-slide").length > 3;

    const initSwiper = () => {
      const thumbSlider = new Swiper(sliderEl, {
        spaceBetween: 8,
        slidesPerView: 4,
        loop: isLoop,
        direction: "horizontal",
        allowTouchMove: true,
        watchSlidesProgress: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        autoHeight: false,
        slideToClickedSlide: true,
        on: {
          touchEnd: function (swiper) {
            let range = 5;
            let diff = (swiper.touches.diff = swiper.isHorizontal()
              ? swiper.touches.currentX - swiper.touches.startX
              : swiper.touches.currentY - swiper.touches.startY);
            if (diff < range || diff > -range) swiper.allowClick = true;
          },
        },
        breakpoints: {
          576: {
            slidesPerView: 6,
          },
          990: {
            slidesPerView: "auto",
            direction: "vertical",
          },
        },
      });

      return thumbSlider;
    };

    if (hasDesktopSwiper || hasMobileSwiper) {
      initSwiper();

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (sliderEl.swiper) {
            if (window.innerWidth >= 990 && hasDesktopSwiper) {
              sliderEl.swiper.enable();
              sliderEl.swiper.changeDirection("vertical", true);
            }

            if (
              window.innerWidth >= 990 &&
              desktopType === "stacked_previews"
            ) {
              sliderEl.swiper.disable();
            }

            if (window.innerWidth < 990 && hasMobileSwiper) {
              sliderEl.swiper.enable();
              sliderEl.swiper.changeDirection("horizontal", true);
            }
          }
        });
      });

      resizeObserver.observe(section);
    }
  };

  const initZoomSlider = (section) => {
    if (!section || !section.classList.contains("product-section")) {
      return;
    }

    const sectionBox = section.querySelector('[id^="MainProduct-"]');
    const sectionId = sectionBox?.dataset?.section;
    const sliderEl = document.querySelector(
      `[data-section-id='${sectionId}'].js-popup-slider`
    );
    if (!sliderEl) return;

    const buttonPrev = sliderEl.querySelector(".swiper-button-prev");
    const buttonNext = sliderEl.querySelector(".swiper-button-next");

    const isLoop = sliderEl.querySelectorAll(".swiper-slide").length > 3;

    const onMainSliderToggleClick = (event) => {
      if (!sliderEl.swiper) return;
      const zoomToggle = event.target.closest(".product__media-toggle");
      if (!zoomToggle) return;
      const mediaId = zoomToggle.dataset?.mediaId;
      if (!mediaId) return;
      sliderEl
        .querySelectorAll(".product-media-modal__item.swiper-slide")
        .forEach((slide, index) => {
          const zoomImageEl = slide.querySelector(
            `[data-media-id="${mediaId}"]`
          );
          if (zoomImageEl) {
            const slideIndex = Number(slide.dataset?.swiperSlideIndex || index);
            sliderEl.swiper.slideTo(slideIndex, 0);
            sliderEl.swiper.update();
          }
        });
    };

    new Swiper(sliderEl, {
      slidesPerView: 1,
      speed: 800,
      loop: isLoop,
      zoom: {
        maxRatio: 2,
      },
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: buttonNext,
        prevEl: buttonPrev,
      },
      on: {
        afterInit: function () {
          section
            .querySelectorAll(".product__media-list .product__media-toggle")
            .forEach((elem) => {
              elem.addEventListener("click", onMainSliderToggleClick);
            });
        },
        slideChange: function () {
          //window.pauseAllMedia();
          window.pauseAllModels();
          this.params.noSwiping = false;
          sliderEl.classList.remove("zoom");
        },
        touchMove: function () {
          sliderEl.classList.remove("zoom");
        },
        slideChangeTransitionEnd: function () {
          const activeIndex = isLoop ? this.realIndex : this.activeIndex;
          const model3D =
            this.slides[activeIndex]?.querySelector("model-viewer");
          const posterBtn3D = this.slides[activeIndex]?.querySelector(
            ".shopify-model-viewer-ui__button--poster"
          );
          if (model3D && posterBtn3D) {
            posterBtn3D.removeAttribute("hidden");
          }
        },
        touchStart: function () {
          const activeIndex = isLoop ? this.realIndex : this.activeIndex;
          const model3D =
            this.slides[activeIndex]?.querySelector("model-viewer");
          if (model3D) {
            if (
              !model3D.classList.contains("shopify-model-viewer-ui__disabled")
            ) {
              this.params.noSwiping = true;
              this.params.noSwipingClass = "swiper-slide";
            } else {
              this.params.noSwiping = false;
            }
          }
        },
      },
    });
  };

  const initCarousel = (section) => {
    if (!section || !section.classList.contains("product-section")) return;

    const sliderEl = section.querySelector(".js-media-list");
    if (!sliderEl) return;

    const desktopType = sliderEl.dataset?.desktopType || "carousel";
    const mobileType = sliderEl.dataset?.mobileType || "carousel";
    const hasDesktopZoom = sliderEl.dataset?.hasDesktopZoom === "true";

    const slides = Array.from(sliderEl.querySelectorAll(".swiper-slide"));
    if (!slides.length || slides.length < 4) return;

    let swiperInstance;
    let interactionTimeout;
    let updateTimeout;

    const initSwiper = () => {
      const isLoop = slides.length > 3;

      swiperInstance = new Swiper(sliderEl, {
        slidesPerView: 3,
        spaceBetween: 4,
        loop: isLoop,
        loopedSlides: slides.length,
        watchSlidesProgress: true,
        freeMode: true,
        freeModeMomentum: false,
        freeModeSticky: false,
        grabCursor: true,
        allowTouchMove: true,
        speed: 5000,
        resistance: true,
        resistanceRatio: 0,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.2,
          },
          990: {
            slidesPerView: 3,
            allowTouchMove: !hasDesktopZoom,
          },
        },
        on: {
          beforeInit(swiper) {
            swiper.wrapperEl.style.transitionTimingFunction = "linear";
            swiper.wrapperEl.style.willChange = "transform";
            swiper.slides.forEach((slide) => {
              slide.style.backfaceVisibility = "hidden";
            });
          },
          setTransition(swiper) {
            swiper.wrapperEl.style.transitionTimingFunction = "linear";
          },
          touchStart(swiper) {
            const activeIndex = isLoop ? swiper.realIndex : swiper.activeIndex;
            const model3D =
              swiper.slides[activeIndex]?.querySelector("model-viewer");
            if (
              model3D &&
              !model3D.classList.contains("shopify-model-viewer-ui__disabled")
            ) {
              swiper.params.noSwiping = true;
            } else {
              swiper.params.noSwiping = false;
            }
          },
          touchEnd(swiper) {
            swiper.params.noSwiping = false;
          },
        },
      });

      const updateSwiper = () => {
        if (!swiperInstance) return;
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          if (swiperInstance) {
            requestAnimationFrame(() => swiperInstance.update());
          }
        }, 100);
      };

      const stopAutoplay = () => {
        if (swiperInstance?.autoplay) swiperInstance.autoplay.stop();
      };

      const resumeAutoplay = (delay = 2000) => {
        if (swiperInstance?.autoplay) {
          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => {
            if (swiperInstance?.autoplay) swiperInstance.autoplay.start();
          }, delay);
        }
      };

      const pauseAutoplay = () => {
        if (swiperInstance?.autoplay) swiperInstance.autoplay.pause();
      };

      sliderEl.querySelectorAll("video").forEach((video) => {
        video.addEventListener("loadedmetadata", updateSwiper);
        video.addEventListener("loadeddata", updateSwiper);
        video.addEventListener("canplay", updateSwiper);
        video.addEventListener("play", stopAutoplay);
        video.addEventListener("pause", () => resumeAutoplay(2000));
        if (video.readyState >= 2) updateSwiper();
      });

      sliderEl
        .querySelectorAll("iframe:not([src*='youtube.com'])")
        .forEach((iframe) => {
          iframe.addEventListener("load", updateSwiper);
          if (iframe.contentWindow) updateSwiper();
        });

      sliderEl
        .querySelectorAll('iframe[src*="youtube.com"]')
        .forEach((iframe) => {
          if (typeof YT === "undefined") return;
          new YT.Player(iframe, {
            events: {
              onReady: updateSwiper,
              onStateChange: (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                  stopAutoplay();
                } else {
                  resumeAutoplay(2000);
                }
              },
            },
          });
        });

      sliderEl.querySelectorAll("model-viewer").forEach((model) => {
        model.addEventListener("load", updateSwiper);
        model.addEventListener("interaction-prompt", stopAutoplay);
        new MutationObserver(() => {
          if (model.classList.contains("shopify-model-viewer-ui__disabled")) {
            resumeAutoplay(1000);
          }
        }).observe(model, { attributes: true, attributeFilter: ["class"] });
      });

      sliderEl
        .querySelectorAll("video, iframe, model-viewer")
        .forEach((media) => {
          media.addEventListener("mouseenter", pauseAutoplay);
          media.addEventListener("mouseleave", () => resumeAutoplay(500));
        });
    };

    const destroySwiper = () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      if (updateTimeout) clearTimeout(updateTimeout);
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
    };

    const hasDesktopSwiper = desktopType === "carousel";
    const hasMobileSwiper = mobileType === "carousel";

    if (hasDesktopSwiper || hasMobileSwiper) {
      const resizeObserver = new ResizeObserver(() => {
        destroySwiper();
        if (window.innerWidth >= 990 && hasDesktopSwiper) {
          initSwiper();
        } else if (window.innerWidth < 990 && hasMobileSwiper) {
          initSwiper();
        }
      });
      resizeObserver.observe(section);
    }
  };
  const initProductAccordion = (section) => {
    if (!section || !section.classList.contains("product-section")) {
      return;
    }

    const accordions = section.querySelectorAll(".product-accordion");

    accordions.forEach((accordion) => {
      accordion.addEventListener("click", (event) => {
        const toggleEl = event.target.closest(".product-accordion__toggle");
        if (!toggleEl) return;

        const contentEl = toggleEl.nextElementSibling;
        if (
          !contentEl ||
          !contentEl.classList.contains("product-accordion__content")
        ) {
          return;
        }

        const isActive = toggleEl.classList.contains("active");
        if (!isActive) {
          slideDown(toggleEl, contentEl, 300); // func in global.js
        } else {
          slideUp(toggleEl, contentEl, 300); // func in global.js
        }
      });
    });
  };

  const initDescriptionToggle = (section) => {
    if (!section || !section.classList.contains("product-section")) return;

    const containers = section.querySelectorAll(".product__description");
    if (!containers.length) return;

    containers.forEach((container) => {
      if (container.dataset.descInited === "true") return;

      const previewEl = container.querySelector(
        ".product__description__preview"
      );
      const fullEl = container.querySelector(".product__description__full");
      const toggleBtn = container.querySelector(
        ".product__description__toggle"
      );
      if (!previewEl || !fullEl || !toggleBtn) return;

      const showMore = () => {
        toggleBtn.setAttribute("aria-expanded", "true");
        const hideLabel = toggleBtn.getAttribute("data-hide-label") || "";
        const span = toggleBtn.querySelector(
          ".product__description__toggle-label"
        );
        if (span) span.textContent = hideLabel;
        previewEl.hidden = true;
        fullEl.hidden = false;
      };

      const showLess = () => {
        toggleBtn.setAttribute("aria-expanded", "false");
        const showLabel = toggleBtn.getAttribute("data-show-label") || "";
        const span = toggleBtn.querySelector(
          ".product__description__toggle-label"
        );
        if (span) span.textContent = showLabel;
        fullEl.hidden = true;
        previewEl.hidden = false;
      };

      toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        if (!expanded) showMore();
        else showLess();
      });

      container.dataset.descInited = "true";
    });
  };

  const initStickyAddBar = (section) => {
    if (!section || !section.classList.contains("product-section")) return;

    const buyButtons = section.querySelector(
      ".product__buy-buttons > product-form"
    );
    const stickyBar = section.querySelector(".product-sticky-add-bar");
    const footerBottom = document.querySelector(
      ".shopify-section-group-footer-group .footer-bottom"
    );

    if (!stickyBar) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.01,
    };

    const isElementBelowScroll = (element) => {
      return element ? element.getBoundingClientRect().top > 0 : false;
    };

    const toggleStickyBar = (isVisible) => {
      if (isVisible || isElementBelowScroll(buyButtons)) {
        stickyBar.classList.remove("active");
      } else {
        stickyBar.classList.add("active");
      }
    };

    const handleIntersect = (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      toggleStickyBar(isVisible);
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (buyButtons) observer.observe(buyButtons);
    if (footerBottom) observer.observe(footerBottom);
  };

  initSubSlider(document.currentScript.parentElement);
  initMainSlider(document.currentScript.parentElement);
  initZoomSlider(document.currentScript.parentElement);
  initCarousel(document.currentScript.parentElement);

  initStickyAddBar(document.currentScript.parentElement);
  initProductAccordion(document.currentScript.parentElement);
  initDescriptionToggle(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (event) => {
    initSubSlider(event.target);
    initMainSlider(event.target);
    initZoomSlider(event.target);
    initCarousel(event.target);

    initStickyAddBar(event.target);
    if (!window.Shopify.designMode) {
      initProductAccordion(event.target);
    }
    initDescriptionToggle(event.target);
  });
})();
