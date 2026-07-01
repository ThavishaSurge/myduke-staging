(function () {
  function initFaq(sectionEl) {
    var items = Array.prototype.slice.call(sectionEl.querySelectorAll('.myduke-faq__item'));

    function openItem(item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      var panel   = item.querySelector('.myduke-faq__panel');
      item.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (panel)   panel.classList.add('is-open');
    }

    function closeItem(item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      var panel   = item.querySelector('.myduke-faq__panel');
      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (panel)   panel.classList.remove('is-open');
    }

   items.forEach(function (item) {
      var trigger = item.querySelector('.myduke-faq__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        
        if (!isOpen) {
          openItem(item);

          //gtm
          if (typeof window.GTMHelper !== 'undefined') {
            var questionEl = item.querySelector('.myduke-faq__question');
            var faqName = questionEl ? questionEl.textContent.trim() : '';

            window.GTMHelper.pushEvent("faq_click", {
              faq_name: faqName
            });
          }
        }
      });
    });

    // Initialize tab functionality
    var tabButtons = sectionEl.querySelectorAll('.myduke-faq__tab-button');
    var tabContents = sectionEl.querySelectorAll('.myduke-faq__tab-content');

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

          var targetContent = sectionEl.querySelector('.myduke-faq__tab-content[data-tab-id="' + targetTab + '"]');
          if (targetContent) {
            targetContent.classList.add('is-active');
          }

          // Close all open FAQ items when switching tabs
          var allItems = sectionEl.querySelectorAll('.myduke-faq__item');
          allItems.forEach(closeItem);

          // Open the first FAQ item in the newly active tab
          if (targetContent) {
            var firstItem = targetContent.querySelector('.myduke-faq__item');
            if (firstItem) {
              openItem(firstItem);
            }
          }
        });
      });
    }
  }

  function initAll() {
    document.querySelectorAll('.myduke-faq[data-section-id]').forEach(initFaq);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
