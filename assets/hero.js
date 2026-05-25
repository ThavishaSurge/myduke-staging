(function () {
  const initProductDetailsAnimations = (section) => {
    if (!section) return;

    // ===== IMAGES ANIMATION ON SCROLL =====
    const animationItems = section.querySelectorAll(".hero__animation-wrapper");
    if (animationItems.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              el.classList.add("animate");
              setTimeout(() => el.classList.add("reveal--show"), 500);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );

      animationItems.forEach((el) => observer.observe(el));
    }

    // ===== PARALLAX LEFT BLOCK =====
    const leftInner = section.querySelector(".hero__left-inner-parallax");
    const rightBlock = section.querySelector(".hero__right-block");

    if (!leftInner || !rightBlock) return;

    const parallaxStrength = 150; // max offset
    let ticking = false;

    // default value 0
    leftInner.style.transform = "translateY(0)";

    const isParallaxAllowed = () =>
      leftInner.offsetHeight < rightBlock.offsetHeight;

    const onScroll = () => {
      if (window.innerWidth <= 750 || !isParallaxAllowed()) {
        leftInner.style.transform = "translateY(0)";
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const leftRect = leftInner.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // middle of the section and middle of the window
      const sectionMiddle = sectionRect.top + sectionRect.height / 2;
      const windowMiddle = windowHeight / 2;

      // movement start only after the middle of the section has crossed the middle of the window
      if (sectionMiddle > windowMiddle) {
        leftInner.style.transform = "translateY(0)";
        return;
      }

      let progress =
        (windowMiddle - sectionMiddle) /
        (windowMiddle + sectionRect.height / 2);
      progress = Math.min(Math.max(progress, 0), 1);

      const translateY = progress * parallaxStrength;

      // Ensure it does not go beyond the bottom boundary of the section

      leftInner.style.transform = `translateY(${Math.min(translateY)}px)`;
    };

    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener(
      "resize",
      () => (leftInner.style.transform = "translateY(0)")
    );
    onScroll();
  };
  const createFooterName = (section) => {
    if (!section) return;

    const heroes = section.classList?.contains("hero")
      ? [section]
      : section.querySelectorAll(".hero");

    if (!heroes.length) return;

    heroes.forEach((hero) => {
      const svg = hero.querySelector("#authorNameSvg");
      const text = hero.querySelector("#authorText");

      if (!svg || !text) return;

      const adjustViewBox = () => {
        const bbox = text.getBBox();
        svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);
      };

      adjustViewBox();
    });
  };

  createFooterName();
  initProductDetailsAnimations(document.currentScript.parentElement);
  document.addEventListener(
    "DOMContentLoaded",
    initProductDetailsAnimations(document.currentScript.parentElement),
    createFooterName(document.currentScript.parentElement)
  );
  document.addEventListener("shopify:section:load", (event) => {
    createFooterName(document.currentScript.parentElement);
    if (!window.Shopify.designMode) initProductDetailsAnimations(event.target);
  });
})();
