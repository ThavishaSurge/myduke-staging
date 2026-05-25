(function () {
  const toggleCollapsible = (event, toggles) => {
    const answer = event.currentTarget.querySelector(
      ".collapsible-content__answer"
    );

    if (!event.currentTarget.classList.contains("active")) {
      const activeItems = Array.from(toggles).filter((item) =>
        item.classList.contains("active")
      );

      activeItems.forEach((item) => {
        const answer = item.querySelector(".collapsible-content__answer");
        slideUp(item, answer);
      });

      slideDown(event.currentTarget, answer);
    } else {
      slideUp(event.currentTarget, answer);
    }
  };

  const initCollapsibleContent = (section) => {
    if (!section || !section?.classList.contains("collapsible-content-section"))
      return;
    const toggles = section.querySelectorAll(".collapsible-content__item");

    if (!toggles) return;

    // Default initialization
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) =>
        toggleCollapsible(event, toggles)
      );

      toggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleCollapsible(event, toggles);
        }
      });
    });
  };

  document.addEventListener(
    "DOMContentLoaded",
    initCollapsibleContent(document.currentScript.parentElement)
  );

  document.addEventListener("shopify:section:load", function (event) {
    initCollapsibleContent(event.target);
  });
})();
