if (!customElements.get("quick-view-modal")) {
  customElements.define(
    "quick-view-modal",
    class QuickViewModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickViewInfo-"]');
        if (!this.modalContent) return;
      }

      hide(preventFocus = false) {
        this.modalContent.innerHTML = "";

        if (preventFocus) this.openedBy = null;

        super.hide();

        document.body.dispatchEvent(new CustomEvent("quick-view-closed"));
      }

      show(opener) {
        if (!opener || !opener?.dataset?.productUrl) return;

        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");
        const btnSpinner = opener.querySelector(".loading-overlay__spinner");
        if (btnSpinner) btnSpinner.classList.remove("hidden");

        fetch(opener.dataset.productUrl)
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            this.productElement = responseHTML.querySelector(
              '[id^="MainProduct-"]'
            );
            if (!this.productElement) return;

            this.prepareProductHTML();
            this.setModalHTML(opener);
            this.initSlider();
            this.initShopifyElements();
            super.show(opener);
            this.setFocusElement(opener);
          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");
            if (btnSpinner) btnSpinner.classList.add("hidden");
          });
      }

      prepareProductHTML() {
        this.preventDuplicatedIDs();
        this.removeDOMElements();
      }

      removeDOMElements() {
        const selectors = [
          ".product-popup",
          ".product__description",
          ".product__share",
          ".product__breadcrumbs",
          ".product__tags",
          ".product__tax",
          ".product__installment",
          ".product-sticky-add-bar",
          "product-modal",
          ".pickup-availability",
          ".avaliability-notification",
          "avaliability-notification-drawer",
          ".complementary-products",
          ".product__divider",
          ".product__media-toggle",
          ".product__media-mobile-icon",
          ".product__media-cursor",
          ".product__media-info",
          "[data-avaliability-notification-script]",
          ".custom-liquid",
          ".product-accordion",
          ".product-app",
          ".product-icon-with-text",
          ".popups-group",
        ];
        const removingElements = this.productElement.querySelectorAll(
          selectors.join(", ")
        );
        removingElements.forEach((el) => el.remove());
      }

      preventDuplicatedIDs() {
        const sectionId = this.productElement.dataset.section;
        this.productElement.innerHTML =
          this.productElement.innerHTML.replaceAll(
            sectionId,
            `quickview-${sectionId}`
          );
        this.productElement
          .querySelectorAll("variant-selects, variant-radios")
          .forEach((variantSelect) => {
            variantSelect.dataset.originalSection = sectionId;
          });
      }

      setModalHTML(opener) {
        this.modalContent.innerHTML = this.productElement.innerHTML;

        this.reinjectScriptTags();
        this.createFullDetailsButton(opener);
        this.preventScrollBody();
        this.preventVariantURLSwitching();
        this.clearMediaClasses();
        this.reorderBlocks();
        const mediaContainer = this.modalContent.querySelector(
          ".product__media-list"
        );
        if (mediaContainer) {
          const mediaItems = mediaContainer.querySelectorAll(
            ".product__media-item"
          );
          if (mediaItems.length <= 1) {
            this.modalContent
              .querySelectorAll(".product__slider-nav, .quick-view-pagination")
              .forEach((el) => el.remove());
          }
        }
        if (this.classList.contains("quick-view-modal--drawer")) {
          this.updateImageSizesDrawer();

          const buyButtons = this.modalContent.querySelector(
            ".product__buy-buttons"
          );
          const infoContainer = this.modalContent.querySelector(
            ".product__info-container"
          );

          if (buyButtons && infoContainer) {
            const updatePadding = () => {
              const height = buyButtons.offsetHeight - 24;
              infoContainer.style.paddingBottom = `${height}px`;
              infoContainer.style.setProperty(
                "padding-bottom",
                `${height}px`,
                "important"
              );
            };

            requestAnimationFrame(updatePadding);
            setTimeout(updatePadding, 500);

            const observer = new MutationObserver(() => updatePadding());
            observer.observe(buyButtons, { childList: true, subtree: true });

            setTimeout(() => observer.disconnect(), 5000);
          }
        }
      }

      reinjectScriptTags() {
        // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
        this.modalContent.querySelectorAll("script").forEach((oldScriptTag) => {
          const newScriptTag = document.createElement("script");
          Array.from(oldScriptTag.attributes).forEach((attribute) => {
            newScriptTag.setAttribute(attribute.name, attribute.value);
          });
          newScriptTag.appendChild(
            document.createTextNode(oldScriptTag.innerHTML)
          );
          oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
        });
      }

      preventVariantURLSwitching() {
        const variantPickerEl = this.modalContent.querySelector(
          "variant-radios,variant-selects"
        );
        if (variantPickerEl) {
          variantPickerEl.setAttribute("data-update-url", "false");
        }
      }

      preventScrollBody() {
        this.modalContent
          .querySelectorAll(".product-form__controls-group input[type=radio]")
          .forEach((input) => {
            input.addEventListener("focus", (e) => {
              const scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
              setTimeout(() => {
                window.scrollTo(0, scrollTop);
              }, 0);
            });
          });
      }

      initShopifyElements() {
        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }

        if (window.ProductModel) {
          window.ProductModel.loadShopifyXR();
        }
      }

      initSlider() {
        const sliderEl = this.modalContent.querySelector(
          ".product__media-list[data-quick-view-type]"
        );
        if (!sliderEl) return;

        const sliderWrapper = sliderEl.querySelector(
          ".product__media-list-container"
        );
        const slides = sliderEl.querySelectorAll(".product__media-item");
        if (!sliderWrapper || slides.length < 2) return;

        //const quickViewType = sliderEl.dataset.quickViewType;

        sliderWrapper.classList.add("swiper-wrapper");
        slides.forEach((slide) => slide.classList.add("swiper-slide"));

        const buttonPrev = sliderEl.querySelector(".swiper-button-prev");
        const buttonNext = sliderEl.querySelector(".swiper-button-next");

        new Swiper(sliderEl, {
          //slidesPerView: quickViewType === "drawer" ? "auto" : 1,
          slidesPerView: 1,
          spaceBetween: 8,
          speed: 800,
          loop: false,
          watchSlideProgress: true,
          allowTouchMove: true,
          mousewheel: {
            forceToAxis: true,
          },
          //grabCursor: quickViewType === "drawer" ? true : false,
          navigation: {
            nextEl: buttonNext,
            prevEl: buttonPrev,
            disabledClass: "swiper-button-disabled",
          },
          pagination: {
            el: this.querySelector(".quick-view-pagination"),
            clickable: true,
          },
          on: {
            //init: function () {
            //},
            //slideChange: function () {
            //},
          },
        });
      }

      createFullDetailsButton(opener) {
        const buttonsWrapper = this.modalContent.querySelector(
          ".product-form__buttons"
        );
        if (!buttonsWrapper || !opener?.dataset?.productUrl) return;

        const moreBtn = document.createElement("a");
        moreBtn.innerHTML = `<span class="button__label">${theme.quickviewMore}</span>`;
        moreBtn.setAttribute("href", opener.dataset.productUrl);
        moreBtn.setAttribute(
          "class",
          "product__full-details button button--tertiary focus-inset"
        );

        buttonsWrapper.appendChild(moreBtn);
      }

      createDescriptionElement() {
        const hiddenEl = this.querySelector("[data-qv-product-description]");
        if (!hiddenEl) return;

        const content = hiddenEl.textContent?.trim();
        if (!content) return;

        const clone = hiddenEl.cloneNode(true);
        clone.removeAttribute("data-qv-product-description");
        clone.removeAttribute("style");
        clone.removeAttribute("aria-disabled");

        return clone;
      }

      clearMediaClasses() {
        const mediaWrapper = this.modalContent.querySelector(".product__media");
        if (!mediaWrapper) return;

        const keepClasses = ["product__media", "product__media--no-media"];
        const filteredClasses = [...mediaWrapper.classList].filter((cssClass) =>
          keepClasses.includes(cssClass)
        );

        mediaWrapper.className = filteredClasses.join(" ");

        //if (this.classList.contains("quick-view-modal--drawer")) {
        //  mediaWrapper.querySelectorAll("deferred-media").forEach((el) => {
        //    el.remove();
        //  });
        //}
      }

      reorderBlocks() {
        const infoContainer = this.modalContent.querySelector(
          ".product__info-container"
        );
        const mediaContainer = this.modalContent.querySelector(
          ".product__media-list"
        );
        const mediaItems = mediaContainer.querySelectorAll(
          ".product__media-item"
        );

        if (!infoContainer) return;
        if (!mediaContainer) return;

        const sliderNav = this.modalContent.querySelector(
          ".product__slider-nav"
        );
        const sliderPagination = this.modalContent.querySelector(
          ".quick-view-pagination"
        );
        const badges = this.modalContent.querySelector(".product__badges");
        const needOrder = [
          ".product__text",
          ".product__title",
          ".product__price",
          ".product__sku",
          ".product__description",
          //".product__media", // product__media reordered only for drawer type
          //".product__slider-nav",
          ".product__inventory",
          ".product-parameters",
          ".product__buy-buttons",
        ];

        const multipleBlockSelectors = [".product__text"];

        const orderedElements = [];

        needOrder.forEach((selector) => {
          // skip .product__media for popup type
          //if (
          //  this.classList.contains("quick-view-modal--popup") &&
          //  selector === ".product__media"
          //) {
          //  return;
          //}

          // special handling for .product__description
          if (selector === ".product__description") {
            const description = this.createDescriptionElement();
            if (description) orderedElements.push(description);
            return;
          }

          // for multiple elements (block limit != 1)
          if (multipleBlockSelectors.includes(selector)) {
            const elements = this.modalContent.querySelectorAll(selector);
            elements.forEach((el) => orderedElements.push(el));
            return;
          }

          // for single element
          const element = this.modalContent.querySelector(selector);
          if (element) orderedElements.push(element);
        });

        orderedElements.forEach((el) => {
          infoContainer.appendChild(el);
        });

        if (mediaItems.length > 1) {
          if (sliderNav) mediaContainer.appendChild(sliderNav);
          if (sliderPagination) mediaContainer.appendChild(sliderPagination);
        }
        if (badges) {
          mediaContainer.appendChild(badges);
        }
      }

      updateImageSizesDrawer() {
        const mediaImages = this.modalContent.querySelectorAll(
          ".product__media-img img"
        );
        if (!mediaImages.length) return;

        let mediaImageSizes = "282px"; // image width 94px * 3 DPR
        mediaImages.forEach((img) =>
          img.setAttribute("sizes", mediaImageSizes)
        );
      }

      setFocusElement(opener) {
        const productCard = opener.closest("product-card");
        const productCardLink = productCard?.querySelector(
          ".product-card__link-overlay"
        );
        if (productCardLink) this.openedBy = productCardLink;
      }
    }
  );
}
