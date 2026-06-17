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
    // Select by class instead of ID for better reliability across Shopify themes
    var contactForm = sectionEl.querySelector('.myduke-faq-page__form');
    
    if (!contactForm) {
      return; 
    }

    contactForm.addEventListener('submit', function(event) {
      // 1. Immediately stop the page reload
      event.preventDefault();
      
      // 2. Setup button loading state
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = '';
      
      if (submitBtn) {
        originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="button__content"><span class="button__label">Sending...</span></div>';
        submitBtn.disabled = true;
      }

      // 3. Package the form data
      var formData = new FormData(contactForm);

      // 4. Send background request using standard Promises (avoids async/await compiler errors)
      fetch(contactForm.action || window.location.pathname, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/html'
        }
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(html) {
        // 5. Parse the returned page 
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        // 6. Extract the updated form with the success/error messages
        var newForm = doc.querySelector('.myduke-faq-page__form');

        if (newForm) {
          contactForm.innerHTML = newForm.innerHTML;
        } else {
          // Fallback if parsing fails
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }
        }
      })
      .catch(function(error) {
        console.error('Error submitting form:', error);
        // Revert button on network error
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    });
  }

  // --- Initialize Everything ---
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