(function () {
  const INTERACTION_THRESHOLD = 0.5;
  const VIEWPORT_HEIGHT_THRESHOLD = 120;

  function initPortfolioScroll(section) {
    if (!section) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(() => initPortfolioScroll(section), 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const blocks = [...section.querySelectorAll(".portfolio-content-item")];
    const totalSlides = blocks.length;
    if (!totalSlides) return;

    const contentWrapper = section.querySelector(".portfolio-content");
    const pagination = section.querySelector(".portfolio-pagination");
    const paginationCurrent = section.querySelector(
      ".portfolio-pagination__current"
    );
    let currentSlideNumber = 1;

    ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger === section || t.vars?.trigger === section) {
        t.kill();
      }
    });

    section.style.minHeight = "";
    section.classList.remove("portfolio--scroll-ready", "portfolio--mobile");
    section.classList.add("portfolio--scroll-ready");
    if (window.innerWidth < 990) section.classList.add("portfolio--mobile");

    const textSlides = blocks
      .map((block) => block.querySelector(".portfolio-text-item"))
      .filter(Boolean);
    const thumbSlides = blocks
      .map((block) => block.querySelector(".portfolio-thumbnail-image"))
      .filter(Boolean);
    const contentLefts = blocks
      .map((block) => block.querySelector(".portfolio-content-left"))
      .filter(Boolean);
    const overlayLinks = blocks
      .map((block) =>
        block.querySelector(".portfolio-content-item__overlay-link")
      )
      .filter(Boolean);

    const setClip = (el, topPct, bottomPct) => {
      if (!el) return;
      el.style.clipPath = `inset(${topPct}% 0% ${bottomPct}% 0%)`;
      el.style.webkitClipPath = `inset(${topPct}% 0% ${bottomPct}% 0%)`;
    };

    const setZState = (el, state) => {
      if (!el) return;
      el.classList.remove("is-active", "is-incoming");
      if (state === "active") el.classList.add("is-active");
      else if (state === "incoming") el.classList.add("is-incoming");
    };

    const setInteractive = (index) => {
      overlayLinks.forEach((el, k) =>
        el?.classList.toggle("is-interactive", k === index)
      );
      contentLefts.forEach((left, k) => {
        const btn = left?.querySelector(".portfolio-text-item__button");
        btn?.classList.toggle("is-interactive", k === index);
      });
    };

    const isMobile = window.innerWidth < 990;

    textSlides.forEach((el, i) => {
      if (!el) return;
      if (!isMobile) {
        setClip(el, i === 0 ? 0 : 100, 0);
        setZState(el, i === 0 ? "active" : null);
      }
    });

    thumbSlides.forEach((el, i) => {
      if (!el) return;
      setClip(el, i === 0 ? 0 : 100, 0);
      setZState(el, i === 0 ? "active" : null);
    });

    contentLefts.forEach((el, i) => {
      setZState(el, i === 0 ? "active" : null);
    });

    overlayLinks.forEach((el, i) => {
      setZState(el, i === 0 ? "active" : null);
    });
    setInteractive(0);

    blocks.forEach((block, index) => {
      const bg = block.querySelector(".portfolio-background-image");
      if (bg) {
        gsap.set(bg, {
          yPercent: index === 0 ? 0 : 100,
          zIndex: 1,
        });
      }
    });

    const bgTimeline = gsap.timeline({ paused: true });
    for (let i = 1; i < totalSlides; i++) {
      const prevBg = blocks[i - 1].querySelector(".portfolio-background-image");
      const currBg = blocks[i].querySelector(".portfolio-background-image");
      if (prevBg && currBg) {
        const pos = i - 1;
        bgTimeline
          .to(prevBg, { yPercent: -20, duration: 1, ease: "power1.inOut" }, pos)
          .set(currBg, { zIndex: 1 }, pos)
          .fromTo(
            currBg,
            { yPercent: 100 },
            { yPercent: 0, duration: 1, ease: "power1.inOut" },
            pos
          );
      }
    }

    const getScrollHeight = () => window.innerHeight * (totalSlides - 1) * 1.25;
    const scrollHeight = getScrollHeight();
    section.style.minHeight = `${scrollHeight + window.innerHeight}px`;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollHeight()}`,
      scrub: true,
      pin: contentWrapper,
      pinSpacing: true,
      pinReparent: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        if (pagination) pagination.classList.add("is-active");
      },
      onLeave: () => {
        if (pagination) pagination.classList.remove("is-active");
      },
      onEnterBack: () => {
        if (pagination) pagination.classList.add("is-active");
      },
      onLeaveBack: () => {
        if (pagination) pagination.classList.remove("is-active");
      },
      onUpdate: (self) => {
        const total = self.progress * (totalSlides - 1);
        const i = Math.floor(total);
        const t = total - i;

        const idx = Math.min(i, totalSlides - 2);
        const p = i >= totalSlides - 1 ? 1 : t;

        const interactiveIndex =
          i >= totalSlides - 1
            ? totalSlides - 1
            : p < INTERACTION_THRESHOLD
            ? idx
            : idx + 1;
        setInteractive(interactiveIndex);

        if (paginationCurrent) {
          const currentSlide =
            i >= totalSlides - 1
              ? totalSlides
              : p < INTERACTION_THRESHOLD
              ? idx + 1
              : idx + 2;
          if (currentSlide !== currentSlideNumber) {
            const slideNumber = String(currentSlide).padStart(2, "0");
            gsap.to(paginationCurrent, {
              opacity: 0,
              y: -10,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                paginationCurrent.textContent = slideNumber;
                gsap.fromTo(
                  paginationCurrent,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                );
              },
            });
            currentSlideNumber = currentSlide;
          }
        }

        for (let k = 0; k < totalSlides; k++) {
          const isActivePair = k === idx || k === idx + 1;
          const isIncoming = k === idx + 1;
          const zState = !isActivePair
            ? null
            : isIncoming
            ? "incoming"
            : "active";
          if (textSlides[k]) {
            if (!isActivePair) setClip(textSlides[k], 100, 0);
            setZState(textSlides[k], zState);
          }
          if (thumbSlides[k]) {
            if (!isActivePair) setClip(thumbSlides[k], 100, 0);
            setZState(thumbSlides[k], zState);
          }
          setZState(contentLefts[k], zState);
          setZState(overlayLinks[k], zState);
        }

        const outText = textSlides[idx];
        const inText = textSlides[idx + 1];
        const outThumb = thumbSlides[idx];
        const inThumb = thumbSlides[idx + 1];

        if (outText && inText) {
          setClip(outText, 0, p * 100);
          setClip(inText, (1 - p) * 100, 0);
        } else if (outText) {
          setClip(outText, 0, 0);
        }

        if (outThumb && inThumb) {
          setClip(outThumb, 0, p * 100);
          setClip(inThumb, (1 - p) * 100, 0);
        } else if (outThumb) {
          setClip(outThumb, 0, 0);
        }

        if (bgTimeline.duration() > 0) {
          const timelineProgress = Math.min(1, Math.max(0, self.progress));
          bgTimeline.progress(timelineProgress, false);
        }
      },
    });

    let resizeTimeout;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const widthChanged = w !== lastWidth;
        const heightChangedEnough =
          Math.abs(h - lastHeight) > VIEWPORT_HEIGHT_THRESHOLD;
        if (!widthChanged && !heightChangedEnough) {
          return;
        }
        lastWidth = w;
        lastHeight = h;
        if (w < 990) {
          section.classList.add("portfolio--mobile");
        } else {
          section.classList.remove("portfolio--mobile");
        }
        section.style.minHeight = `${getScrollHeight() + h}px`;
        ScrollTrigger.refresh();
      }, 100);
    };
    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();
  }

  function init() {
    document.querySelectorAll(".portfolio").forEach(initPortfolioScroll);

    document.addEventListener("shopify:section:load", (e) => {
      const section =
        e.target.querySelector(".portfolio") || e.target.closest(".portfolio");
      if (section) initPortfolioScroll(section);
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
