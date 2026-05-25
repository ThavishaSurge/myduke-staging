(function () {
  function initScrollImageReveal(scope) {
    const root = scope && scope.nodeType === 1 ? scope : document;
    const items = root.querySelectorAll(
      "[data-scroll-image-reveal]:not([data-reveal-initialized])"
    );
    if (!items.length) return;

    const grouped = new Map();
    items.forEach((el) => {
      el.setAttribute("data-reveal-initialized", "");
      const section = el.closest(".shopify-section");
      const key = section || root;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(el);
    });

    grouped.forEach((elements, sectionOrRoot) => {
      const observers = [];

      elements.forEach((el, index) => {
        const threshold = parseFloat(el.dataset.revealThreshold || "0.4");
        const baseDelay = parseInt(el.dataset.revealDelay || "500", 10);

        const isSequence = el.hasAttribute("data-reveal-sequence");
        const delay = isSequence ? baseDelay + index * 200 : baseDelay;

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              const target = entry.target;

              setTimeout(() => {
                target.classList.add("animate");

                setTimeout(() => {
                  target.classList.add("reveal--show");
                }, 500);
              }, delay);

              obs.disconnect();
            });
          },
          { threshold }
        );

        observer.observe(el);
        observers.push(observer);
      });

      if (
        sectionOrRoot.classList &&
        sectionOrRoot.classList.contains("shopify-section")
      ) {
        sectionOrRoot.addEventListener(
          "shopify:section:unload",
          () => {
            observers.forEach((o) => o.disconnect());
          },
          { once: true }
        );
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollImageReveal(document);
  });

  document.addEventListener("shopify:section:load", (event) => {
    if (!window.Shopify || !window.Shopify.designMode) return;
    initScrollImageReveal(event.target);
  });
})();
