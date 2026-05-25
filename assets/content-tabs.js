(() => {
  const activateTab = (section, targetId) => {
    const allButtons = section.querySelectorAll("[data-tab-button]");
    const allContents = section.querySelectorAll("[data-tab-content]");
    const nav = section.querySelector("[data-tabs-nav]");
    const allClones = nav ? nav.querySelectorAll("[data-tab-button]") : [];

    [...allButtons, ...allClones].forEach((b) => b.classList.remove("active"));
    allContents.forEach((c) => c.classList.remove("active"));

    allButtons.forEach((b) => {
      if (b.dataset.target === targetId) b.classList.add("active");
    });
    allClones.forEach((b) => {
      if (b.dataset.target === targetId) b.classList.add("active");
    });

    const targetEl = section.querySelector(
      `[data-tab-content][id="${targetId}"]`
    );
    if (targetEl) targetEl.classList.add("active");
  };

  const toggleTab = (section) => {
    const tabButtons = section.querySelectorAll("[data-tab-button]");
    if (!tabButtons.length) return;

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () =>
        activateTab(section, btn.dataset.target)
      );
      btn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") activateTab(section, btn.dataset.target);
      });
    });
  };

  const cloneTabs = (section) => {
    const nav = section.querySelector("[data-tabs-nav]");
    const tabButtons = section.querySelectorAll("[data-tab-button]");
    const tabContents = section.querySelectorAll("[data-tab-content]");
    if (!nav || !tabButtons.length) return;

    if (nav.dataset.cloned === "true") return;

    nav.innerHTML = "";

    tabButtons.forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.addEventListener("click", () =>
        activateTab(section, btn.dataset.target)
      );
      nav.appendChild(clone);
    });

    const firstId = tabButtons[0].dataset.target;
    activateTab(section, firstId);

    nav.dataset.cloned = "true";
  };

  const toggleCollapsible = (event, toggles) => {
    const answer = event.currentTarget.querySelector(
      ".content-tabs__tab-collapsible-content__answer"
    );

    if (!event.currentTarget.classList.contains("active")) {
      const activeItems = Array.from(toggles).filter((item) =>
        item.classList.contains("active")
      );

      activeItems.forEach((item) => {
        const answer = item.querySelector(
          ".content-tabs__tab-collapsible-content__answer"
        );
        slideUp(item, answer);
      });

      slideDown(event.currentTarget, answer);
    } else {
      slideUp(event.currentTarget, answer);
    }
  };

  const initCollapsibleBlock = (section) => {
    const blocksWrapper = section.querySelectorAll(
      ".content-tabs__tab-collapsible-content"
    );
    if (!blocksWrapper.length) return;

    blocksWrapper.forEach((wrapper) => {
      const toggles = wrapper.querySelectorAll(
        ".content-tabs__tab-collapsible-content__item"
      );
      toggles.forEach((toggle, index) => {
        const question = toggle.querySelector(
          ".content-tabs__tab-collapsible-content__question"
        );
        const answer = toggle.querySelector(
          ".content-tabs__tab-collapsible-content__answer"
        );
        if (!question || !answer) return;

        if (index === 0) {
          toggle.classList.add("active");
        }

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
    });
  };

  const initSection = (section) => {
    cloneTabs(section);
    toggleTab(section);
    initCollapsibleBlock(section);
  };

  const section = document.currentScript.parentElement;
  initSection(section);

  document.addEventListener("shopify:section:load", (event) => {
    initSection(event.target);
  });

  document.addEventListener("shopify:block:select", (event) => {
    const block = event.target;
    const section = block.closest(".shopify-section");
    if (!section) return;

    const tabContent = block.closest("[data-tab-content]");
    if (tabContent && tabContent.id) {
      activateTab(section, tabContent.id);
    }
  });
})();
