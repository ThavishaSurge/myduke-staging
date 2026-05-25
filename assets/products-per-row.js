(function () {
  const TRANSITION_DURATION = 250;

  function updateAllSwipers() {
    document.querySelectorAll("product-card").forEach((card) => {
      if (card.swiper) {
        card.swiper.update();
      }
    });
  }

  function containerUpdate(container, perRow) {
    return new Promise((resolve) => {
      container.classList.add("grid-transitioning");

      setTimeout(() => {
        container.setAttribute("data-products-in-row", perRow);

        updateAllSwipers();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            container.classList.remove("grid-transitioning");
            container.classList.add("grid-transition-in");

            setTimeout(() => {
              container.classList.remove("grid-transition-in");
              resolve();
            }, TRANSITION_DURATION);
          });
        });
      }, TRANSITION_DURATION);
    });
  }

  function productsPerRow() {
    const button = document.querySelector(".js-per-row__button");
    const pageHeader = document.querySelector("sticky-header.header-wrapper");
    let headerRevealTimeout = null;
    let currentAbortController = null;
    let isTransitioning = false;

    if (!button) return;

    const handleToggle = async () => {
      if (isTransitioning) return;
      isTransitioning = true;

      const current = button.dataset.perRow;
      const next = current === "large" ? "small" : "large";
      button.dataset.perRow = next;

      const iconWrapper = button.querySelector(
        ".collection-top__layout-toggler-icon"
      );
      if (iconWrapper) {
        iconWrapper.innerHTML =
          next === "large"
            ? window.icons?.cellsLarge || ""
            : window.icons?.cellsSmall || "";
      }

      const containers = document.querySelectorAll("[data-products-in-row]");
      const updatePromises = Array.from(containers).map((el) =>
        containerUpdate(el, next)
      );

      if (pageHeader) {
        if (headerRevealTimeout) clearTimeout(headerRevealTimeout);
        pageHeader.preventReveal = true;
      }

      if (currentAbortController) currentAbortController.abort();
      currentAbortController = new AbortController();

      fetch(window.Shopify.routes.root + "cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attributes: {
            "cells-view": next,
          },
        }),
        signal: currentAbortController.signal,
      })
        .then((response) => {
          if (response.ok) {
            console.info(`Catalog card size "${next}" saved successfully.`);
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Request error:", error);
          }
        })
        .finally(() => {
          if (pageHeader) {
            headerRevealTimeout = setTimeout(() => {
              pageHeader.preventReveal = false;
            }, 400);
          }
        });

      await Promise.all(updatePromises);
      isTransitioning = false;
    };

    button.addEventListener("click", handleToggle);
  }

  document.addEventListener("shopify:section:load", productsPerRow);
  productsPerRow();
})();
