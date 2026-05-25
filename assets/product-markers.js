(function () {
  const productMarkers = (section) => {
    const parent = section || document;
    const productsSelector =
      ".product-markers-for-mobile .product-markers__item-inner";
    const markersSelector = ".js-product-markers__item";
    const markersContent = document.querySelector(
      ".product-markers .content .product-markers__markers"
    );

    const products = parent.querySelectorAll(productsSelector);
    const markers = parent.querySelectorAll(markersSelector);

    if (!markers.length) return;

    markers.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation();

        const index = item.dataset.index;
        const product = parent.querySelector(
          `${productsSelector}[data-index="${index}"]`
        );
        const otherMarkers = [...markers].filter((marker) => marker !== item);
        const otherProducts = parent.querySelectorAll(
          `${productsSelector}:not([data-index="${index}"])`
        );

        item.classList.toggle("active");
        product?.classList.toggle("active");

        otherMarkers.forEach((marker) => marker.classList.remove("active"));
        otherProducts.forEach((p) => p.classList.remove("active"));

        parent
          .querySelector(".product-markers-for-mobile")
          ?.classList.add("active");
      });
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.click();
        }
      });
    });

    const firstMarker = parent.querySelector(markersSelector);
    if (firstMarker) firstMarker.click();

    markersContent.addEventListener("click", (e) => {
      const parentClicked = e.target.closest(markersSelector);
      markers.forEach((marker) => {
        if (parentClicked !== marker && !e.target.closest(productsSelector)) {
          marker.classList.remove("active");
          products.forEach((product) => product.classList.remove("active"));
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => productMarkers(document));
  document.addEventListener("shopify:section:load", (e) =>
    productMarkers(e.target)
  );
})();
