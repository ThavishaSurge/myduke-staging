document.addEventListener("DOMContentLoaded", function () {

  const cards = document.querySelectorAll(".myduke-guided-support__card");
  const mobileQuery = window.matchMedia("(max-width: 575px)");

  const minusIcon = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6.5" width="12" height="1" fill="#264653"/>
      <rect x="13" y="6.5" width="1" height="12" transform="rotate(90 13 6.5)" fill="#264653"/>
    </svg>
  `;

  const plusIcon = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6.5" width="12" height="1" fill="#264653"/>
      <rect x="6.5" y="1" width="1" height="12" fill="#264653"/>
    </svg>
  `;

  function closeCard(card) {
    const ul = card.querySelector("ul");
    const icon = card.querySelector(".myduke-guided-support__card_icon_mobile");
    const top = card.querySelector(".myduke-guided-support__card-top");

    if (ul) ul.style.maxHeight = "0px";
    card.classList.remove("active");
    icon.innerHTML = plusIcon;
    top.setAttribute("aria-expanded", "false");
  }

  function openCard(card) {
    const ul = card.querySelector("ul");
    const icon = card.querySelector(".myduke-guided-support__card_icon_mobile");
    const top = card.querySelector(".myduke-guided-support__card-top");

    if (ul) ul.style.maxHeight = ul.scrollHeight + "px";
    card.classList.add("active");
    icon.innerHTML = minusIcon;
    top.setAttribute("aria-expanded", "true");
  }

  function resetDesktop() {
    cards.forEach(card => {
      const ul = card.querySelector("ul");
      const icon = card.querySelector(".myduke-guided-support__card_icon_mobile");
      const top = card.querySelector(".myduke-guided-support__card-top");

      if (ul) ul.style.maxHeight = "";
      card.classList.remove("active");
      icon.innerHTML = plusIcon;
      top.setAttribute("aria-expanded", "false");
    });
  }

  function initMobileAccordion() {
    cards.forEach((card, index) => {
      const ul = card.querySelector("ul");
      const icon = card.querySelector(".myduke-guided-support__card_icon_mobile");
      const top = card.querySelector(".myduke-guided-support__card-top");

      if (index === 0) {
        if (ul) ul.style.maxHeight = ul.scrollHeight + "px";
        card.classList.add("active");
        icon.innerHTML = minusIcon;
        top.setAttribute("aria-expanded", "true");
      } else {
        if (ul) ul.style.maxHeight = "0px";
        card.classList.remove("active");
        icon.innerHTML = plusIcon;
        top.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Bind interaction handlers once — not inside handleMode/initMobileAccordion
  // to prevent listeners stacking up on every resize or breakpoint re-entry.
  document.querySelectorAll(".myduke-guided-support__card-top").forEach(top => {
    top.addEventListener("click", function () {
      if (!mobileQuery.matches) return;
      const card = this.closest(".myduke-guided-support__card");

      cards.forEach(c => {
        if (c !== card) closeCard(c);
      });

      if (card.classList.contains("active")) {
        closeCard(card);
      } else {
        openCard(card);
      }
    });

    top.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  function handleMode() {
    if (mobileQuery.matches) {
      initMobileAccordion();
    } else {
      resetDesktop();
    }
  }

  handleMode();

  // Change event fires only on breakpoint crossings, not on every resize tick.
  mobileQuery.addEventListener("change", handleMode);

});
