(function () {
  // --- 1. FAQ Accordion Logic ---
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
  }

  // --- 2. Handle Post-Submission Scroll ---
  function handleFormScroll() {
    var contactForm = document.querySelector('.myduke-faq-page__form');
    if (!contactForm) return;

    // Check if there is a success or error message inside our specific form
    var formResult = contactForm.querySelector('.form-status');
    
    // Also check if the URL hash contains the form ID (Shopify's default redirection behavior)
    var hasFormHash = window.location.hash.indexOf('ContactForm') !== -1;

    if (formResult || hasFormHash) {
      
      var scrollcontainer = document.getElementById('myduke-faq-page-container');

      setTimeout(function() {
        scrollcontainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }

  // --- Initialize Everything ---
  function initAll() {
    document.querySelectorAll('.myduke-faq-page[data-section-id]').forEach(initFaqPage);
    handleFormScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();