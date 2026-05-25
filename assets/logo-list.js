document.addEventListener("DOMContentLoaded", () => {
  const speedInput = document.getElementById("ticker_speed");

  const startTicker = () => {
    const sections = document.querySelectorAll(".section-logo-list");

    sections.forEach(section => {
      const ticker = section.querySelector(".brands-items");
      if (!ticker) return;

      if (section.classList.contains("slider_started")) return;
      section.classList.add("slider_started");


      ticker.innerHTML += ticker.innerHTML;

      const animateTicker = () => {
        ticker.style.transform = "translateX(0)";
        ticker.style.transition = "none";

        setTimeout(() => {
          const totalWidth = ticker.scrollWidth;
          const tickerWidth = ticker.offsetWidth;

          const speed = speedInput ? Number(speedInput.value) : 25;
          const duration = (totalWidth / tickerWidth) * speed * 1000;

          ticker.style.transition = `transform ${duration}ms linear`;
          ticker.style.transform = "translateX(-50%)";
        }, 100);

        const onTransitionEnd = () => {
          ticker.style.transition = "none";
          ticker.style.transform = "translateX(0)";
          requestAnimationFrame(animateTicker);
        };

        ticker.addEventListener("transitionend", onTransitionEnd, { once: true });
      };

      animateTicker();
    });
  };

  startTicker();

  if (speedInput) {
    speedInput.addEventListener("input", () => {
      document.querySelectorAll(".section-logo-list").forEach(section => {
        section.classList.remove("slider_started");
      });
      startTicker();
    });
  }

  document.addEventListener("shopify:section:load", () => startTicker());
});
