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

  function initAll() {
    document.querySelectorAll('.myduke-faq-page[data-section-id]').forEach(initFaqPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // --- 2. Contact Form AJAX Logic (Capturing Phase) ---
  
  // The 'true' argument forces our listener to catch the event BEFORE Shopify's native scripts.
  document.addEventListener('submit', function(event) {
    var contactForm = event.target;
    
    // Check if the form being submitted is our FAQ contact form
    if (contactForm && (contactForm.id === 'MyDukeFaqContactForm' || contactForm.classList.contains('myduke-faq-page__form'))) {
      
      // 1. Prevent the standard reload
      event.preventDefault();
      
      // 2. Kill the event completely so Shopify's reCAPTCHA script cannot hijack it
      event.stopImmediatePropagation();
      
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalBtnText = '';
      
      // 3. Set loading state
      if (submitBtn) {
        originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="button__content"><span class="button__label">Sending...</span></div>';
        submitBtn.disabled = true;
      }

      var formData = new FormData(contactForm);

      // 4. Send background request
      fetch(contactForm.action || '/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        // Allow Shopify's Captcha redirect if absolutely necessary
        if (response.url && response.url.indexOf('/challenge') !== -1) {
          window.location.href = response.url;
          return null;
        }
        return response.text();
      })
      .then(function(html) {
        if (!html) return; 
        
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        
        var newForm = doc.querySelector('#MyDukeFaqContactForm') || doc.querySelector('.myduke-faq-page__form');

        if (newForm) {
          // 5. Inject the new HTML
          contactForm.innerHTML = newForm.innerHTML;
          
          // 6. Smooth scroll the success message into the center of the viewport
          setTimeout(function() {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);

        } else {
           if (submitBtn) {
             submitBtn.innerHTML = originalBtnText;
             submitBtn.disabled = false;
           }
        }
      })
      .catch(function(error) {
        console.error('AJAX Form Error:', error);
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    }
  }, true); 
})();