(function () {
  // --- FAQ Accordion Logic ---
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

  // --- Contact Form AJAX Logic ---
  function initContactForm(sectionEl) {
    var contactForm = sectionEl.querySelector('#MyDukeFaqContactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = '';
      
      if (submitBtn) {
        originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="button__content"><span class="button__label">Sending...</span></div>';
        submitBtn.disabled = true;
      }

      try {
        var formData = new FormData(contactForm);
        var response = await fetch(window.location.pathname, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'text/html'
          }
        });

        var html = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        var newForm = doc.querySelector('#MyDukeFaqContactForm');

        if (newForm) {
          contactForm.innerHTML = newForm.innerHTML;
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // Revert button state if a network error occurs
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  function initAll() {
    document.querySelectorAll('.myduke-faq-page[data-section-id]').forEach(function(sectionEl) {
      initFaqPage(sectionEl);
      initContactForm(sectionEl);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();