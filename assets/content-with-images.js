(function () {
  const initProductDetailsAnimations = (section) => {
    if (!section) return;

    // ===== IMAGES ANIMATION ON SCROLL =====
    const animationItems = section.querySelectorAll(
      ".content_with_images__animation-wrapper"
    );
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
    const leftInner = section.querySelector(
      ".content_with_images__left-inner-parallax"
    );
    const rightBlock = section.querySelector(".content_with_images__right-block");

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
      const maxTranslate = sectionRect.bottom - leftRect.bottom;
      leftInner.style.transform = `translateY(${Math.min(
        translateY,
        maxTranslate
      )}px)`;
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

  initProductDetailsAnimations(document.currentScript.parentElement);

  document.addEventListener("shopify:section:load", (event) => {
    if (!window.Shopify.designMode) initProductDetailsAnimations(event.target);
  });
})();
