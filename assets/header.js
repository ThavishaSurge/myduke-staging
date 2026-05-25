(function () {
  const onBlurListMenu = (header) => {
    const listMenuItems = header.querySelectorAll(
      ".list-menu--inline > .list-menu-item"
    );

    const onBlurInnerElements = () => {
      listMenuItems.forEach((item) => {
        item.querySelectorAll("a, details, summary").forEach((el) => {
          el.blur();
        });
        item.blur();
      });
    };

    listMenuItems.forEach((listMenuItem) => {
      listMenuItem.addEventListener("mouseleave", onBlurInnerElements);
    });
  };

  const initHeaderOverlay = (header) => {
    const main = document.getElementById("MainContent");
    const sections = main.querySelectorAll(".shopify-section");
    const isOverlayMode = Boolean(
      header.querySelector(".header--overlay-mode")
    );
    const breadcrumbs = document.querySelector(
      ".base-breadcrumbs #breadcrumbs"
    );

    const removeColorScheme = (element) => {
      if (!element) return;
      let classNames = element.getAttribute("class");
      classNames = classNames.replace(/color-background-\d+/g, "");
      element.setAttribute("class", classNames);
    };

    if (sections.length > 0 && isOverlayMode) {
      const isTargetSection = [
        "media-banner-section",
        "slideshow-section",
        "featured-products-section",
        "collection-grid-section",
      ].some((className) => sections[0].classList.contains(className));
      const sectionFirstChild = sections[0].querySelector(
        "[data-color-scheme]"
      );
      const headerGroupSections = document.querySelectorAll(
        ".shopify-section-group-header-group"
      );

      if (isTargetSection && sectionFirstChild) {
        if (headerGroupSections[headerGroupSections.length - 1] === header) {
          sections[0].classList.remove("not-margin");
          header.classList.remove("not-mode");
          if (breadcrumbs) {
            removeColorScheme(breadcrumbs);
            const colorScheme = sectionFirstChild.dataset.colorScheme;
            if (colorScheme) breadcrumbs.classList.add(`color-${colorScheme}`);
          }
        } else {
          sections[0].classList.add("not-margin");
          header.classList.add("not-mode");
          if (breadcrumbs) removeColorScheme(breadcrumbs);
        }
      } else {
        header.classList.add("not-mode");
        if (breadcrumbs) removeColorScheme(breadcrumbs);
      }
    } else {
      header.classList.add("not-mode");
      if (breadcrumbs) removeColorScheme(breadcrumbs);
    }
  };

  const initMegaSubmenu = (header) => {
    const megaSubmenuLinks = header.querySelectorAll(".list-menu--megasubmenu");
    if (!megaSubmenuLinks || !megaSubmenuLinks.length) return;

    megaSubmenuLinks.forEach((link) => {
      const tabs = link.querySelectorAll(".mega-submenu__tab");
      const submenus = link.querySelectorAll(".mega-submenu__submenu");

      const onToggle = (event) => {
        const tab = event.target;
        if (!tab || !tab.classList.contains("mega-submenu__tab")) return;
        const tabId = tab.dataset.tabId;
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
        tab.classList.add("active");
        submenus.forEach((submenu) => {
          submenu.classList.remove("active");
          if (submenu.dataset.tabId === tabId) {
            submenu.classList.add("active");
          }
        });
      };

      tabs.forEach((tab) => {
        tab.addEventListener("click", onToggle);
        tab.addEventListener("mouseenter", onToggle);
      });
    });
  };

  const initMegaObserver = (header) => {
    const megaMenuLinks = header.querySelectorAll(
      ".list-menu--megamenu, .list-menu--megasubmenu"
    );
    if (!megaMenuLinks || !megaMenuLinks.length) return;

    const headerEl = header.querySelector(".header.header--has-menu");
    if (!headerEl) return;

    const calcMegaMenuPosition = () => {
      const headerRect = headerEl.getBoundingClientRect();

      megaMenuLinks.forEach((link) => {
        const megaMenuEl =
          link.querySelector(".header__mega-menu") ||
          link.querySelector(".header__mega-submenu");

        if (!megaMenuEl) return;

        const linkMenuRect = link.getBoundingClientRect();

        const extraHeight = Math.abs(linkMenuRect.bottom - headerRect.bottom);
        const extraHeightFix = Math.ceil(extraHeight * 100) / 100;
        const extraLeft = (linkMenuRect.left - 20).toFixed(2);
        const extraWidth = (linkMenuRect.width + 30).toFixed(2);
        megaMenuEl.style.setProperty("--extra-height", `${extraHeightFix}px`);
        megaMenuEl.style.setProperty("--extra-left", `${extraLeft}px`);
        megaMenuEl.style.setProperty("--extra-width", `${extraWidth}px`);

        let maxCollectionHeight = 0;
        megaMenuEl.querySelectorAll(".collection-card").forEach((el) => {
          const collectionHeight = el.scrollHeight + 24;
          maxCollectionHeight = Math.max(maxCollectionHeight, collectionHeight);
        });
        if (maxCollectionHeight > 264) {
          megaMenuEl.style.maxHeight = `${maxCollectionHeight}px`;
        }
      });
    };

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        calcMegaMenuPosition();
      });
    });

    observer.observe(header);
  };

  const initSubmenuPosition = (header) => {
    const nestedSubmenus = header.querySelectorAll(
      ".header__submenu .header__submenu"
    );

    const nestedChecks = [];

    nestedSubmenus.forEach((submenu) => {
      const parentItem = submenu.closest("li");
      if (!parentItem) return;

      const checkPosition = () => {
        submenu.classList.remove("header__submenu--flip");

        const rect = submenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.right > viewportWidth) {
          submenu.classList.add("header__submenu--flip");
        }
      };

      nestedChecks.push(checkPosition);

      parentItem.addEventListener("mouseenter", checkPosition);
      parentItem.addEventListener("focusin", checkPosition);
    });

    const megaSubmenus = header.querySelectorAll(".mega-submenu");
    const megaChecks = [];

    megaSubmenus.forEach((submenu) => {
      const parentItem = submenu.closest(".list-menu--megasubmenu");
      if (!parentItem) return;

      const calcMaxWrapperWidth = () => {
        const wrapper = submenu.querySelector(".mega-submenu__wrapper");
        const wrapperInner = submenu.querySelector(
          ".mega-submenu__wrapper-inner"
        );
        const tabs = submenu.querySelector(".mega-submenu__tabs");
        const submenus = submenu.querySelectorAll(".mega-submenu__submenu");
        if (!wrapper || !wrapperInner || !submenus.length) return;

        wrapper.style.removeProperty("min-width");

        let maxSubmenuWidth = 0;
        submenus.forEach((el) => {
          el.style.display = "grid";
          const width = el.scrollWidth;
          if (width > maxSubmenuWidth) maxSubmenuWidth = width;
          el.style.removeProperty("display");
        });

        const tabsWidth = tabs ? tabs.offsetWidth : 0;
        const wrapperStyles = getComputedStyle(wrapper);
        const innerStyles = getComputedStyle(wrapperInner);
        const paddingLeft = parseFloat(wrapperStyles.paddingLeft) || 0;
        const paddingRight = parseFloat(wrapperStyles.paddingRight) || 0;
        const gap = parseFloat(innerStyles.gap) || 0;

        const totalWidth =
          tabsWidth + gap + maxSubmenuWidth + paddingLeft + paddingRight;
        wrapper.style.minWidth = `${totalWidth}px`;
      };

      const checkPosition = () => {
        submenu.classList.remove("mega-submenu--flip");
        submenu.style.removeProperty("--extra-right");

        const rect = submenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.right > viewportWidth) {
          submenu.classList.add("mega-submenu--flip");
          calcMaxWrapperWidth();

          const parentRect = parentItem.getBoundingClientRect();
          const submenuRect = submenu.getBoundingClientRect();
          const extraRight = (
            submenuRect.right -
            parentRect.right -
            20
          ).toFixed(2);
          submenu.style.setProperty("--extra-right", `${extraRight}px`);
        }
      };

      megaChecks.push(checkPosition);

      parentItem.addEventListener("mouseenter", checkPosition);
      parentItem.addEventListener("focusin", checkPosition);
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        nestedChecks.forEach((fn) => fn());
        megaChecks.forEach((fn) => fn());
      }, 100);
    });
  };

  const initAccountDropdown = (header) => {
    const accountDetails = header.querySelector(".header__account-details");
    if (!accountDetails) return;

    const summary = accountDetails.querySelector("summary");
    const dropdown = accountDetails.querySelector(".header__account-dropdown");

    const closeDropdown = () => {
      accountDetails.removeAttribute("open");
      document.body.classList.remove("overflow-hidden");
      removeTrapFocus(summary);
    };

    const handleToggle = () => {
      if (accountDetails.hasAttribute("open")) {
        document.dispatchEvent(new CustomEvent("closeHeaderSearch"));
        document.body.classList.add("overflow-hidden");
        if (dropdown) {
          trapFocus(dropdown, dropdown);
        }
      } else {
        document.body.classList.remove("overflow-hidden");
        removeTrapFocus(summary);
      }
    };

    const handleClickOutside = (event) => {
      if (
        accountDetails.hasAttribute("open") &&
        !accountDetails.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    const handleDetailsClick = (event) => {
      if (!accountDetails.hasAttribute("open")) return;

      if (
        event.target === accountDetails &&
        !summary.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        event.preventDefault();
        closeDropdown();
      }
    };

    const handleKeyDown = (event) => {
      if (accountDetails.hasAttribute("open") && event.key === "Escape") {
        closeDropdown();
        summary.focus();
      }
    };

    accountDetails.addEventListener("toggle", handleToggle);
    accountDetails.addEventListener("click", handleDetailsClick);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
  };

  const initTransparentStickyAdapt = (sectionHeader, headerInner) => {
    if (window.__transparentStickyAdaptCleanup) {
      window.__transparentStickyAdaptCleanup();
      window.__transparentStickyAdaptCleanup = null;
    }

    const adaptHost = sectionHeader.querySelector(
      "[data-transparent-sticky-adapt]"
    );

    if (
      !sectionHeader ||
      !headerInner ||
      !sectionHeader.contains(headerInner) ||
      !adaptHost ||
      !adaptHost.contains(headerInner)
    ) {
      return;
    }

    let raf = 0;
    const threshold = 0.45;
    const solidClass = "header-wrapper--tsk-solid";

    const parseRgb = (color) => {
      if (!color) return null;
      const s = String(color).trim();
      if (!s || s === "transparent") return null;
      const m = s.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
      );
      if (m) {
        const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
        return { r: +m[1], g: +m[2], b: +m[3], a };
      }
      const hx = s.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
      if (hx) {
        let h = hx[1];
        if (h.length === 3) {
          h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        const n = parseInt(h, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
      }
      return null;
    };

    const relLuminance = (r, g, b) => {
      const ch = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    };

    const bgLuminanceFromElement = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const parsed = parseRgb(bg);
        if (parsed && parsed.a > 0.08) {
          return relLuminance(parsed.r, parsed.g, parsed.b);
        }
        node = node.parentElement;
      }
      return 1;
    };

    const luminanceUnderPoint = (clientX, clientY) => {
      const stack = document.elementsFromPoint(clientX, clientY);
      for (let i = 0; i < stack.length; i++) {
        const el = stack[i];
        if (sectionHeader.contains(el)) continue;
        return bgLuminanceFromElement(el);
      }
      return 1;
    };

    const setSolidOn = () => adaptHost.classList.add(solidClass);
    const trySolidOff = () => {
      requestAnimationFrame(() => {
        if (!adaptHost.matches(":focus-within")) {
          adaptHost.classList.remove(solidClass);
        }
      });
    };

    adaptHost.addEventListener("pointerenter", setSolidOn);
    adaptHost.addEventListener("pointerleave", trySolidOff);
    adaptHost.addEventListener("focusin", setSolidOn);
    adaptHost.addEventListener("focusout", trySolidOff);

    const sample = () => {
      const rect = sectionHeader.getBoundingClientRect();
      if (!rect.height) return;
      const y = Math.min(
        window.innerHeight - 2,
        Math.max(2, rect.top + rect.height * 0.5)
      );
      const xs = [
        rect.left + rect.width * 0.18,
        rect.left + rect.width * 0.5,
        rect.left + rect.width * 0.82,
      ];
      let sum = 0;
      let n = 0;
      for (const rawX of xs) {
        const x = Math.min(window.innerWidth - 1, Math.max(1, rawX));
        sum += luminanceUnderPoint(x, y);
        n += 1;
      }
      const avg = n ? sum / n : 1;
      const isDark = avg < threshold;
      headerInner.classList.toggle("header--tsk-below-dark", isDark);
      headerInner.classList.toggle("header--tsk-below-light", !isDark);
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sample();
      });
    };

    const onSectionMutation = () => onScrollOrResize();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("shopify:section:load", onSectionMutation);
    document.addEventListener("shopify:section:unload", onSectionMutation);
    document.addEventListener("shopify:section:reorder", onSectionMutation);

    const ro = new ResizeObserver(() => onScrollOrResize());
    ro.observe(sectionHeader);

    sample();

    window.__transparentStickyAdaptCleanup = () => {
      adaptHost.removeEventListener("pointerenter", setSolidOn);
      adaptHost.removeEventListener("pointerleave", trySolidOff);
      adaptHost.removeEventListener("focusin", setSolidOn);
      adaptHost.removeEventListener("focusout", trySolidOff);
      adaptHost.classList.remove(solidClass);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("shopify:section:load", onSectionMutation);
      document.removeEventListener("shopify:section:unload", onSectionMutation);
      document.removeEventListener("shopify:section:reorder", onSectionMutation);
      ro.disconnect();
      headerInner.classList.remove(
        "header--tsk-below-dark",
        "header--tsk-below-light"
      );
    };
  };

  const initHeader = () => {
    const header = document.querySelector(".shopify-section-header");
    if (!header) {
      if (window.__transparentStickyAdaptCleanup) {
        window.__transparentStickyAdaptCleanup();
        window.__transparentStickyAdaptCleanup = null;
      }
      return;
    }

    const adaptHost = header.querySelector("[data-transparent-sticky-adapt]");
    const adaptHeader =
      adaptHost &&
      adaptHost.querySelector(".header.header--transparent-sticky");
    if (adaptHost && adaptHeader) {
      initTransparentStickyAdapt(header, adaptHeader);
    } else if (window.__transparentStickyAdaptCleanup) {
      window.__transparentStickyAdaptCleanup();
      window.__transparentStickyAdaptCleanup = null;
    }

    onBlurListMenu(header);
    initHeaderOverlay(header);
    initMegaObserver(header);
    initMegaSubmenu(header);
    initSubmenuPosition(header);
    initAccountDropdown(header);
  };

  initHeader();

  document.addEventListener("shopify:section:load", initHeader);
  document.addEventListener("shopify:section:unload", initHeader);
  document.addEventListener("shopify:section:reorder", initHeader);
})();

if (!customElements.get("burger-menu")) {
  customElements.define(
    "burger-menu",
    class BurgerMenu extends HTMLElement {
      constructor() {
        super();
        this.header = document.querySelector(".header-wrapper");
        this.burgerMenu = this.querySelector(".burger-menu");
        this.modalContent = this.burgerMenu?.querySelector(".modal__content");
        this.openButton = this.querySelector(".burger-menu__toggle");
        this.closeButton = this.querySelector(".modal-close-button");
        this.overlayEl = this.querySelector(".modal__overlay");

        this.open = this.onOpen.bind(this);
        this.close = this.onClose.bind(this);
        this.handleKeyDown = this.onHandleKeyDown.bind(this);
        this.handleTabKey = this.onHandleTabKey.bind(this);
      }

      connectedCallback() {
        this.openButton?.addEventListener("click", this.open);
        this.closeButton?.addEventListener("click", this.close);
        this.overlayEl?.addEventListener("click", this.close);
        this.header?.addEventListener("keydown", this.handleKeyDown);
        this.querySelectorAll(".modal-close-button").forEach((btn) => {
          btn.addEventListener("click", this.close);
        });
      }

      disconnectedCallback() {
        this.openButton?.removeEventListener("click", this.open);
        this.closeButton?.removeEventListener("click", this.close);
        this.overlayEl?.removeEventListener("click", this.close);
        this.header?.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keydown", this.handleTabKey);
        this.querySelectorAll(".modal-close-button").forEach((btn) => {
          btn.removeEventListener("click", this.close);
        });
      }

      focusWithoutScroll(element) {
        if (!element) return;
        try {
          element.focus({ preventScroll: true });
        } catch (error) {
          element.focus();
        }
      }

      onOpen() {
        document.dispatchEvent(new CustomEvent("closeHeaderSearch"));
        if (this.header) this.header.preventHide = true;
        this.setAttribute("open", true);
        this.burgerMenu.classList.add("modal--open");
        document.body.classList.add("overflow-hidden-desktop-menu");
        if (this.modalContent && this.closeButton) {
          trapFocus(this.modalContent, this.closeButton);
          this.focusWithoutScroll(this.closeButton);
          document.addEventListener("keydown", this.handleTabKey);
        }
      }

      onClose() {
        document.body.classList.remove("overflow-hidden-desktop-menu");
        document.body.classList.remove("overflow-hidden");
        this.removeAttribute("open");
        this.burgerMenu.classList.remove("modal--open");

        document.removeEventListener("keydown", this.handleTabKey);

        removeTrapFocus(this.openButton);
        this.querySelectorAll("menu-drawer").forEach((submenu) => {
          if (submenu && typeof submenu.closeMenuDrawer === "function") {
            submenu.closeMenuDrawer(this.openButton);
          }
        });
        if (this.header) this.header.preventHide = false;
      }

      onHandleKeyDown(event) {
        if (this.getAttribute("open")) {
          if (event.key === "Escape") {
            this.close();
          }
        }
      }

      onHandleTabKey(event) {
        if (!this.getAttribute("open") || event.code.toUpperCase() !== "TAB") {
          return;
        }

        if (!this.modalContent) return;

        const activeSubmenu = this.modalContent.querySelector(
          "details.menu-opening"
        );
        const burgerMenuContent = this.modalContent.querySelector(
          ".burger-menu__content"
        );

        const allElements = getFocusableElements(this.modalContent);
        const elements = allElements.filter((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") {
            return false;
          }

          if (activeSubmenu) {
            return activeSubmenu.contains(el);
          }

          if (el === this.closeButton) {
            return true;
          }

          if (burgerMenuContent && burgerMenuContent.contains(el)) {
            return true;
          }

          return false;
        });
        const first = elements[0];
        const last = elements[elements.length - 1];

        if (!first || !last) {
          event.preventDefault();
          return;
        }

        const activeElement = document.activeElement;
        const isInActiveSubmenu =
          activeSubmenu && activeSubmenu.contains(activeElement);
        const isInMainMenu =
          !activeSubmenu && this.modalContent.contains(activeElement);

        if (!isInActiveSubmenu && !isInMainMenu) {
          event.preventDefault();
          if (event.shiftKey) {
            last.focus();
          } else {
            first.focus();
          }
          return;
        }

        if (activeElement === last && !event.shiftKey) {
          event.preventDefault();
          first.focus();
        } else if (activeElement === first && event.shiftKey) {
          event.preventDefault();
          last.focus();
        }
      }
    }
  );
}

if (!customElements.get("header-search")) {
  customElements.define(
    "header-search",
    class HeaderSearch extends HTMLElement {
      constructor() {
        super();
        this.header = document.querySelector(".header-wrapper");
        this.searchLink = this.querySelector(".header__button--search");
        this.modalContainer = this.querySelector(".header__search-modal");
        this.modalContent = this.querySelector(".modal__content");
        this.closeButton =
          this.querySelector(".modal-close-button") ||
          this.querySelector(".mobile-submenu__back");
        this.overlayEl = this.querySelector(".modal__overlay");
        this.location = this.dataset.location;

        this.searchInput = this.querySelector("#Search-In-Modal");
        this.mutationObserver = null;

        this.open = this.onOpen.bind(this);
        this.close = this.onClose.bind(this);
        this.handleKeyDown = this.onHandleKeyDown.bind(this);
        this.handleTabKey = this.onHandleTabKey.bind(this);
        this.updateTrapFocus = this.onUpdateTrapFocus.bind(this);
      }

      connectedCallback() {
        this.searchLink?.addEventListener("click", this.open);
        this.closeButton?.addEventListener("click", this.close);
        this.overlayEl?.addEventListener("click", this.close);
        this.header?.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("closeHeaderSearch", this.close);

        this.setTimeout = null;
      }

      disconnectedCallback() {
        this.searchLink?.removeEventListener("click", this.open);
        this.closeButton?.removeEventListener("click", this.close);
        this.overlayEl?.removeEventListener("click", this.close);
        this.header?.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keydown", this.handleTabKey);
        document.removeEventListener("closeHeaderSearch", this.close);
        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
          this.mutationObserver = null;
        }
      }

      focusWithoutScroll(element) {
        if (!element) return;
        try {
          element.focus({ preventScroll: true });
        } catch (error) {
          element.focus();
        }
      }

      onOpen(event) {
        event.preventDefault();
        this.setTimeout && window.clearTimeout(this.setTimeout);
        if (this.header) this.header.preventHide = true;
        this.setAttribute("open", true);
        this.modalContainer.classList.add("modal--open");

        const focusEl =
          this.querySelector(".search__button--reset") ||
          this.querySelector(".search__button--submit");

        if (this.modalContent && focusEl) {
          trapFocus(this.modalContent, focusEl);
          document.addEventListener("keydown", this.handleTabKey);

          if (!this.mutationObserver) {
            this.mutationObserver = new MutationObserver(() => {
              this.updateTrapFocus();
            });
            this.mutationObserver.observe(this.modalContent, {
              childList: true,
              subtree: true,
            });
          }
        }

        // transition duration in modal 300ms
        if (this.searchInput && navigator.userAgent.indexOf("iPhone") === -1) {
          this.setTimeout = setTimeout(() => this.searchInput.focus(), 500);
        }

        if (this.location === "desktop-header") {
          document.body.classList.add("overflow-hidden-laptop");
          this.header?.classList.add("header--search-open");
        }
      }

      onClose() {
        this.setTimeout && window.clearTimeout(this.setTimeout);
        this.removeAttribute("open");
        this.modalContainer.classList.remove("modal--open");

        document.removeEventListener("keydown", this.handleTabKey);

        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
          this.mutationObserver = null;
        }

        if (this.location === "desktop-header") {
          document.body.classList.remove("overflow-hidden-laptop");
          this.header?.classList.remove("header--search-open");
        }

        removeTrapFocus();
        this.focusWithoutScroll(this.searchLink);

        if (this.header) this.header.preventHide = false;
        const parentMenu = this.closest("header-drawer");
        if (!parentMenu) this.focusWithoutScroll(this.searchLink);
        if (parentMenu) {
          removeTrapFocus();
          this.focusWithoutScroll(parentMenu.closeBtn);
        }
      }

      onHandleKeyDown(event) {
        if (this.getAttribute("open")) {
          if (event.key === "Escape") {
            this.close();
          }
        }
      }

      onUpdateTrapFocus() {
        if (!this.getAttribute("open") || !this.modalContent) return;

        const focusEl = document.activeElement;
        if (this.modalContent.contains(focusEl)) {
          trapFocus(this.modalContent, focusEl);
        }
      }

      onHandleTabKey(event) {
        if (!this.getAttribute("open") || event.code.toUpperCase() !== "TAB") {
          return;
        }

        if (!this.modalContent) return;

        const allElements = getFocusableElements(this.modalContent);
        const elements = allElements.filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        });
        const first = elements[0];
        const last = elements[elements.length - 1];

        if (!first || !last) {
          event.preventDefault();
          return;
        }

        const activeElement = document.activeElement;

        if (!this.modalContent.contains(activeElement)) {
          event.preventDefault();
          if (event.shiftKey) {
            last.focus();
          } else {
            first.focus();
          }
          return;
        }

        if (activeElement === last && !event.shiftKey) {
          event.preventDefault();
          first.focus();
        } else if (activeElement === first && event.shiftKey) {
          event.preventDefault();
          last.focus();
        }
      }
    }
  );
}
