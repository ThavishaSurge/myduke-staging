(function () {
  function initFaqPage(sectionEl) {
    var items = Array.prototype.slice.call(sectionEl.querySelectorAll('.myduke-faq-page__item'));

    function openItem(item) {
      var trigger = item.querySelector('.myduke-faq-page__trigger');
      var panel   = item.querySelector('.myduke-faq-page__panel');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (panel)   panel.classList.add('is-open');
    }

    function closeItem(item) {
      var trigger = item.querySelector('.myduke-faq-page__trigger');
      var panel   = item.querySelector('.myduke-faq-page__panel');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel)   panel.classList.remove('is-open');
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.myduke-faq-page__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        if (!isOpen) openItem(item);
      });
    });

    // Initialize tab functionality
    var tabButtons = sectionEl.querySelectorAll('.myduke-faq-page__tab-button');
    var tabContents = sectionEl.querySelectorAll('.myduke-faq-page__tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
      tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var targetTab = button.getAttribute('data-tab-target');

          // Remove active state from all buttons and contents
          tabButtons.forEach(function (btn) {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-selected', 'false');
          });
          tabContents.forEach(function (content) {
            content.classList.remove('is-active');
          });

          // Add active state to clicked button and corresponding content
          button.classList.add('is-active');
          button.setAttribute('aria-selected', 'true');

          var targetContent = sectionEl.querySelector('.myduke-faq-page__tab-content[data-tab-id="' + targetTab + '"]');
          if (targetContent) {
            targetContent.classList.add('is-active');
          }

          // Close all open FAQ items when switching tabs
          var allItems = sectionEl.querySelectorAll('.myduke-faq-page__item');
          allItems.forEach(closeItem);
        });
      });
    }
  }

  function initAll() {
    document.querySelectorAll('.myduke-faq-page[data-section-id]').forEach(initFaqPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();