(() => {
  let isManuallyPaused = false;

  const playVideo = (swiper) => {
    if (!swiper?.enabled) return;
    const prevSlide = swiper.slides[swiper.previousIndex];
    const activeSlide = swiper.slides[swiper.activeIndex];

    if (activeSlide) {
      const videoActive = activeSlide.querySelector(".slideshow__video");
      if (videoActive) videoActive.play().catch(() => {});
    }

    if (prevSlide && prevSlide !== activeSlide) {
      const videoPrev = prevSlide.querySelector(".slideshow__video");
      if (videoPrev) videoPrev.pause();
    }
  };

  const stopVideo = (swiper) => {
    if (!swiper?.enabled) return;
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (activeSlide) {
      const videoActive = activeSlide.querySelector(".slideshow__video");
      if (videoActive) videoActive.pause();
    }
  };

  const toggleAutoplay = (swiper, button, section) => {
    if (!swiper?.autoplay) return;

    const iconPlay = button.querySelector(".icon-play");
    const iconPause = button.querySelector(".icon-pause");
    const progressBar = section.querySelector(".slideshow__progress-bar");

    if (!isManuallyPaused) {
      swiper.autoplay.stop();
      isManuallyPaused = true;

      if (progressBar) {
        progressBar.style.animationPlayState = "paused";
      }

      button.classList.add("paused");
      updatePaginationAnimation(section, "paused");

      iconPlay.classList.remove("hidden");
      iconPause.classList.add("hidden");
    } else {
      swiper.autoplay.start();
      playVideo(swiper);
      isManuallyPaused = false;

      if (progressBar) {
        progressBar.style.animationPlayState = "running";
      }

      button.classList.remove("paused");
      updatePaginationAnimation(section, "running");

      iconPlay.classList.add("hidden");
      iconPause.classList.remove("hidden");
    }
  };

  const updatePaginationAnimation = (section, state) => {
    const pagination = section.querySelector(".swiper-pagination");
    if (!pagination) return;
    pagination.classList.toggle("pagination-paused", state === "paused");
    pagination.classList.toggle("pagination-running", state === "running");
  };

  const changeColorScheme = (swiper, box) => {
    if (!swiper?.enabled) return;
    const slide = swiper.slides[swiper.activeIndex];
    const scheme = slide?.dataset.colorScheme;
    if (!scheme) return;

    [
      swiper.navigation?.nextEl,
      swiper.navigation?.prevEl,
      swiper.pagination?.el,
      box.querySelector(".slideshow-autoplay__button"),
      box.querySelector(".slideshow__cursor"),
    ].forEach((el) => {
      if (!el) return;
      el.className = el.className.replace(/color-background-\d+/g, "");
      el.classList.add(scheme);
    });
  };

  const getSwiperParams = (box, isVerticalStack) => {
    const effect = isVerticalStack
      ? "slide"
      : box.dataset.animationType === "fade"
        ? "fade"
        : "slide";
    const base = {
      speed: isVerticalStack ? 0 : 1400,
      watchSlidesProgress: true,
      parallax: !isVerticalStack,
      preventInteractionOnTransition: true,
      resistanceRatio: 0.85,
      mousewheel: {
        forceToAxis: true,
      },
      effect,
      autoplay:
        box.dataset.autoplay === "true"
          ? {
              disableOnInteraction: false,
              pauseOnMouseEnter: box.dataset.stopAutoplay === "true",
            }
          : false,
      pagination:
        box.dataset.pagination === "true"
          ? {
              el: box.querySelector(".swiper-pagination"),
              clickable: true,
              renderBullet: (_, className) =>
                `<div class="${className}"><span></span></div>`,
            }
          : false,
      loop: box.dataset.loop === "true",
      on: {
        slideChange() {
          changeColorScheme(this, box);
          playVideo(this);
        },
      },
    };
    if (isVerticalStack) base.virtualTranslate = true;
    return base;
  };

  const initVerticalStack = (swiper, box) => {
    if (typeof gsap === "undefined") return;

    const mainSlider = swiper.el;
    const EXIT_DURATION = 1.45;
    const SCALE_DURATION = 2.15;
    const CONTENT_OUT_DURATION = 1.05;
    const CONTENT_IN_DURATION = 1.38;
    const CONTENT_IN_DELAY = 0.22;
    const CONTENT_STAGGER = 0.08;
    const IN_SCALE = 1.09;
    let stackTween = null;
    let lastRealIndex = swiper.realIndex;

    const slideCountReal = () =>
      swiper.slides.filter((s) => !s.classList.contains("swiper-slide-duplicate"))
        .length;

    const syncHostHeight = () => {
      const probe =
        box.querySelector(".slideshow__slide:not(.swiper-slide-duplicate)") ||
        box.querySelector(".slideshow__slide");
      if (probe && mainSlider) {
        const h = probe.offsetHeight;
        if (h > 0) mainSlider.style.minHeight = `${h}px`;
      }
    };

    syncHostHeight();
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => syncHostHeight()).observe(box);
    }

    const applyInactiveMedia = (slide) => {
      const media = slide?.querySelector(".slideshow__media");
      if (media) gsap.set(media, { yPercent: 100, scale: 1.05 });
    };

    const applyActiveMedia = (slide) => {
      const media = slide?.querySelector(".slideshow__media");
      if (media) gsap.set(media, { yPercent: 0, scale: 1 });
    };

    const getContentAnimTargets = (slide) => {
      const lines = slide?.querySelectorAll(".slideshow__content-reveal-inner");
      if (lines?.length) return Array.from(lines);
      const g = slide?.querySelector(".slideshow__content-group");
      return g ? [g] : [];
    };

    const hideContent = (slide) => {
      getContentAnimTargets(slide).forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: 0, yPercent: 0 });
      });
    };

    const showContentStatic = (slide) => {
      getContentAnimTargets(slide).forEach((el) => {
        gsap.set(el, { autoAlpha: 1, y: 0, yPercent: 0 });
      });
    };

    const slideLogicalIndex = (slide) =>
      slide?.getAttribute?.("data-swiper-slide-index");

    const syncStackVisuals = () => {
      swiper.slides.forEach((slide, i) => {
        if (i === swiper.activeIndex) {
          applyActiveMedia(slide);
          showContentStatic(slide);
          slide.style.zIndex = "2";
        } else {
          applyInactiveMedia(slide);
          hideContent(slide);
          slide.style.zIndex = "1";
        }
      });
    };

    syncStackVisuals();

    swiper.on("setTranslate", (sw) => {
      sw.wrapperEl.style.transform = "translate3d(0px, 0px, 0px)";
    });

    swiper.on("slideChange", () => {
      const prevSlide = swiper.slides[swiper.previousIndex];
      const nextSlide = swiper.slides[swiper.activeIndex];
      if (!prevSlide || !nextSlide || prevSlide === nextSlide) return;

      if (stackTween) {
        stackTween.kill();
        stackTween = null;
      }
      delete mainSlider.dataset.stackAnimating;
      swiper.allowTouchMove = true;

      const prevLogical = slideLogicalIndex(prevSlide);
      const nextLogical = slideLogicalIndex(nextSlide);
      const sameByDataAttr =
        prevLogical !== null &&
        nextLogical !== null &&
        prevLogical === nextLogical;
      const sameRealSwiper =
        swiper.params.loop &&
        typeof swiper.previousRealIndex === "number" &&
        typeof swiper.realIndex === "number" &&
        swiper.previousRealIndex === swiper.realIndex;

      if (sameByDataAttr || sameRealSwiper) {
        lastRealIndex = swiper.realIndex;
        syncStackVisuals();
        return;
      }

      const cr = swiper.realIndex;
      const pr = lastRealIndex;
      lastRealIndex = cr;

      let forward = cr > pr;
      if (swiper.params.loop) {
        const total = slideCountReal();
        if (pr === total - 1 && cr === 0) forward = true;
        if (pr === 0 && cr === total - 1) forward = false;
      }

      const autoplayWas = Boolean(swiper.autoplay?.running);
      if (autoplayWas) swiper.autoplay.stop();

      mainSlider.dataset.stackAnimating = "true";
      swiper.allowTouchMove = false;

      const prevMedia = prevSlide.querySelector(".slideshow__media");
      const nextMedia = nextSlide.querySelector(".slideshow__media");
      const prevLines = getContentAnimTargets(prevSlide);
      const nextLines = getContentAnimTargets(nextSlide);

      prevSlide.style.zIndex = "3";
      nextSlide.style.zIndex = "2";

      if (nextMedia) {
        gsap.set(nextMedia, {
          yPercent: 0,
          scale: IN_SCALE,
          transformOrigin: "50% 50%",
        });
      }

      if (prevMedia) {
        gsap.set(prevMedia, {
          yPercent: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        });
      }

      stackTween = gsap.timeline({
        onComplete: () => {
          delete mainSlider.dataset.stackAnimating;
          swiper.allowTouchMove = true;
          syncStackVisuals();
          if (autoplayWas && !isManuallyPaused && swiper.autoplay) {
            swiper.autoplay.start();
          }
          refreshProgressBarAnimation(box, swiper);
        },
      });

      prevLines.forEach((line, i) => {
        gsap.set(line, { y: 0, yPercent: 0 });
        stackTween.to(
          line,
          {
            yPercent: forward ? -100 : 100,
            autoAlpha: 0,
            duration: CONTENT_OUT_DURATION,
            ease: "power2.inOut",
          },
          i * CONTENT_STAGGER
        );
      });

      if (prevMedia) {
        stackTween.to(
          prevMedia,
          {
            yPercent: forward ? -100 : 100,
            duration: EXIT_DURATION,
            ease: "power2.inOut",
          },
          0
        );
      }

      if (nextMedia) {
        stackTween.to(
          nextMedia,
          {
            scale: 1,
            duration: SCALE_DURATION,
            ease: "sine.out",
          },
          0
        );
      }

      nextLines.forEach((line, i) => {
        gsap.set(line, {
          y: 0,
          yPercent: forward ? 100 : -100,
          autoAlpha: 0,
        });
        stackTween.to(
          line,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: CONTENT_IN_DURATION,
            ease: "power2.out",
          },
          CONTENT_IN_DELAY + i * CONTENT_STAGGER
        );
      });
    });
  };

  const getSliderElements = (box) => {
    const slider = box.querySelector(".slideshow__swiper--overlay");
    return { mainSlider: slider, mediaSlider: slider };
  };

  const initSlider = (box) => {
    const { mainSlider } = getSliderElements(box);
    if (!mainSlider) return;

    const isVerticalStack = box.dataset.animationType === "vertical_stack";
    if (isVerticalStack) {
      const probe = box.querySelector(".slideshow__slide");
      if (probe && mainSlider) {
        const h = probe.offsetHeight;
        if (h) mainSlider.style.minHeight = `${h}px`;
      }
    }

    const swiper = new Swiper(mainSlider, getSwiperParams(box, isVerticalStack));
    if (isVerticalStack) initVerticalStack(swiper, box);

    const button = box.querySelector(".slideshow-autoplay__button");
    button?.addEventListener("click", () =>
      toggleAutoplay(swiper, button, box)
    );

    if (box.dataset.autoplay === "true") swiper.autoplay.start();
    updateProgressBar(swiper, box);
    initProgressBar(box);
    changeColorScheme(swiper, box);
  };

  const initAutoplayObserver = (box) => {
    const { mainSlider } = getSliderElements(box);
    if (!mainSlider?.swiper) return;

    const swiper = mainSlider.swiper;
    const hasAutoplay = box.dataset.autoplay === "true";

    new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          if (hasAutoplay && !isManuallyPaused) swiper.autoplay.start();
          playVideo(swiper);
        } else {
          if (hasAutoplay) swiper.autoplay.pause();
          stopVideo(swiper);
        }
      });
    }).observe(box);
  };
  //let isCursorInit = false;

  const initCursor = (box) => {
    if (!box || box.dataset.flowingCursor !== "true") return;
    let isCursorInit = false;
    const { mainSlider } = getSliderElements(box);
    if (!mainSlider || !mainSlider.swiper) return;

    const cursorEl = box.querySelector(".slideshow__cursor");

    if (!cursorEl) return;
    const swiper = mainSlider.swiper;

    function updateCursor(slide) {
      if (!slide || !cursorEl) return;

      const hasLink = slide.dataset.hasLink === "true";
      cursorEl.classList.toggle("slideshow--no-cursor", !hasLink);
    }

    updateCursor(swiper.slides[swiper.activeIndex]);

    swiper.on("slideChange", () => {
      updateCursor(swiper.slides[swiper.activeIndex]);
    });
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const easingFactor = 0.2;
    let isAnimating = false;

    const animateCursor = () => {
      isAnimating = true;

      currentX += (targetX - currentX) * easingFactor;
      currentY += (targetY - currentY) * easingFactor;

      cursorEl.style.left = `${currentX + 30}px`;
      cursorEl.style.top = `${currentY + 20}px`;

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        requestAnimationFrame(animateCursor);
      } else {
        isAnimating = false;
      }
    };

    const handleMouseMove = (e) => {
      if (
        !e.target.closest(".slideshow__content-title a") &&
        !e.target.closest(".slideshow__content-description a") &&
        !e.target.closest(".slideshow__content-button") &&
        !e.target.closest(".slideshow__pagination")
      ) {
        box.classList.add("cursor-active");
      } else {
        box.classList.remove("cursor-active");
      }

      const rect = box.getBoundingClientRect();
      const cursorRect = cursorEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      cursorEl.classList.toggle("prev", e.clientX < centerX);
      cursorEl.classList.toggle("next", e.clientX >= centerX);

      targetX = e.clientX - rect.left - cursorRect.width / 2;
      targetY = e.clientY - rect.top - cursorRect.height / 2;
      box.classList.toggle(
        "cursor-active_margin",
        currentX >= rect.width - 150
      );
      if (!isAnimating) animateCursor();
    };

    const handleMouseEnter = (e) => {
      const rect = box.getBoundingClientRect();
      const cursorRect = cursorEl.getBoundingClientRect();

      currentX = targetX = e.clientX - rect.left - cursorRect.width / 2;
      currentY = targetY = e.clientY - rect.top - cursorRect.height / 2;

      cursorEl.style.left = `${currentX}px`;
      cursorEl.style.top = `${currentY}px`;
      box.classList.toggle(
        "cursor-active_margin",
        currentX >= rect.width - 150
      );
      box.classList.add("cursor-active");
    };

    const handleMouseLeave = () => {
      box.classList.remove("cursor-active");
    };

    const handleClick = (e) => {
      if (
        e.target.closest(".slideshow__content-description a") ||
        e.target.closest(".slideshow__content-button") ||
        e.target.closest(".slideshow__pagination") ||
        e.target.closest(".slideshow-autoplay__button")
      )
        return;

      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const swiper = mainSlider.swiper;
      const isLoop = box.dataset.loop === "true";
      const activeSlide = swiper.slides[swiper.activeIndex];

      if (activeSlide?.dataset.hasLink === "true") {
        return;
      }
      if (swiper.animating) return;
      if (mainSlider.dataset.stackAnimating === "true") return;

      if (e.clientX >= centerX && (isLoop || !swiper.isEnd)) {
        swiper.slideNext();
      } else if (e.clientX < centerX && (isLoop || !swiper.isBeginning)) {
        swiper.slidePrev();
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.contentRect.width >= 750 && !isCursorInit) {
          box.addEventListener("mouseenter", handleMouseEnter);
          box.addEventListener("mousemove", handleMouseMove);
          box.addEventListener("mouseleave", handleMouseLeave);
          box.addEventListener("click", handleClick);
          isCursorInit = true;
        } else if (entry.contentRect.width < 750 && isCursorInit) {
          box.removeEventListener("mouseenter", handleMouseEnter);
          box.removeEventListener("mousemove", handleMouseMove);
          box.removeEventListener("mouseleave", handleMouseLeave);
          box.removeEventListener("click", handleClick);
          isCursorInit = false;
        }
      });
    });

    resizeObserver.observe(box);
  };

  const stopAutoplayOnHoverSplitScreen = (box) => {
    if (box.dataset.autoplay !== "true" || box.dataset.stopAutoplay !== "true")
      return;

    const { mainSlider } = getSliderElements(box);
    if (!mainSlider?.swiper) return;

    const swiper = mainSlider.swiper;

    box.addEventListener("mouseenter", () => swiper.autoplay.pause());
    box.addEventListener("mouseleave", () => {
      if (!isManuallyPaused) swiper.autoplay.start();
    });
  };

  const refreshProgressBarAnimation = (box, swiper) => {
    const progressBar = box.querySelector(".slideshow__progress-bar");
    const progressNon = box.querySelector(
      ".slideshow__progress-bar-wihout-autoplay"
    );
    if (!progressBar) return;

    progressBar.style.animation = "none";
    void progressBar.offsetHeight;
    progressBar.style.animation = `progress var(--bullet-duration) linear forwards`;
    progressBar.style.animationPlayState =
      !isManuallyPaused && swiper.autoplay?.running ? "running" : "paused";
    if (progressNon) {
      progressNon.style.animation = "none";
    }
  };

  const updateProgressBar = (swiper, box) => {
    const progressBar = box.querySelector(".slideshow__progress-bar");
    if (!progressBar) return;

    const resetAnimation = () => refreshProgressBarAnimation(box, swiper);

    swiper.on("slideChange", resetAnimation);

    const autoplayButton = box.querySelector(".slideshow-autoplay__button");
    if (autoplayButton) {
      autoplayButton.addEventListener("click", () => {
        if (swiper.autoplay.running) {
          progressBar.style.animationPlayState = "running";
        } else {
          progressBar.style.animationPlayState = "paused";
        }
      });
    }

    resetAnimation();
  };

  const initProgressBar = (box) => {
    const swiperEl = box.querySelector(".slideshow__swiper--overlay");
    if (!swiperEl || !swiperEl.swiper) return;
    const swiper = swiperEl.swiper;

    const progressBar = box.querySelector(".slideshow__progress-bar");
    if (!progressBar) return;

    const hasAutoplay =
      swiper.params.autoplay &&
      swiper.params.autoplay.disableOnInteraction !== undefined;

    const resetAnimation = () => {
      if (!hasAutoplay || !swiper.autoplay.running) return;
      progressBar.style.animation = "none";
      void progressBar.offsetHeight;
      progressBar.style.animation = `progress var(--bullet-duration) linear forwards`;
      progressBar.classList.remove("paused");
      progressBar.classList.add("running");
    };

    swiper.on("slideChange", resetAnimation);

    if (hasAutoplay && swiper.autoplay.running) resetAnimation();
  };

  const initSection = (section) => {
    if (!section.classList.contains("slideshow-section")) return;
    const box = section.querySelector(".slideshow");
    if (!box) return;

    const animatedContentsWrapper = section.querySelector(
      ".slideshow_text_inner_container"
    );

    const runInit = () => {
      initSlider(box);
      initAutoplayObserver(box);
      initCursor(box);
      stopAutoplayOnHoverSplitScreen(box);
    };

    if (box.dataset.firstSection === "true") {
      animatedContentsWrapper?.classList.add("is-active");
      runInit();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      animatedContentsWrapper?.classList.add("is-active");
      runInit();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (!ent?.isIntersecting) return;

        animatedContentsWrapper?.classList.add("is-active");

        io.disconnect();
        runInit();
      },
      { rootMargin: "100px", threshold: 0 }
    );

    io.observe(section);
  };

  initSection(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (e) =>
    initSection(e.target)
  );
})();
