function setCollectionsMinHeight() {
  const collectionsSections = document.querySelectorAll(".collections-list");

  collectionsSections.forEach((section) => {
    const content = section.querySelector(".collections-list__content");
    if (!content) return;

    const items = content.querySelectorAll(".collections-list__item");

    let maxHeight = 0;

    items.forEach((item) => {
      const imgWrapper = item.querySelector(".collections-list__image-wrapper");
      if (imgWrapper) {
        const height = imgWrapper.offsetHeight;
        if (height > maxHeight) maxHeight = height;
      }
    });

    content.style.minHeight = 76 + maxHeight + "px";

    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    const imgWrappers = section.querySelectorAll(
      ".collections-list__image-wrapper"
    );
    imgWrappers.forEach((imgWrapper) => {
      if (sectionHeight > windowHeight) {
        imgWrapper.style.top = "50%";
        imgWrapper.style.transform = "translateY(-50%)";
      } else {
        imgWrapper.style.transform = "";
      }
    });
  });
}

function initCollectionsHover() {
  document.querySelectorAll(".collections-list__content").forEach((content) => {
    const items = content.querySelectorAll(".collections-list__item");
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        content.classList.add("has-hover");
        item.classList.add("is-hovered");
      });
      item.addEventListener("mouseleave", () => {
        content.classList.remove("has-hover");
        item.classList.remove("is-hovered");
      });
    });
  });
}

function initCollectionsReveal() {
  const sections = document.querySelectorAll(".collections-list");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const section = entry.target;
        const content = section.querySelector(".collections-list__content");
        if (!content) return;

        content.classList.add("is-visible");

        obs.unobserve(section);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCollectionsMinHeight();
  initCollectionsHover();
  initCollectionsReveal();
});

document.addEventListener("shopify:section:load", () => {
  setCollectionsMinHeight();
  initCollectionsHover();
  initCollectionsReveal();
});

window.addEventListener("resize", setCollectionsMinHeight);
