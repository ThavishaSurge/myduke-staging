(function () {
  // --- 1. Handle Post-Submission Scroll ---
  function handleFormScroll() {
    var formResult = document.querySelector('.form-status');
    var hasFormHash = window.location.hash.indexOf('ContactForm') !== -1;

    if (formResult || hasFormHash) {
      var scrollTarget = document.getElementById('myduke-form-scroller') || (formResult ? formResult.closest('form') : null);
      
      if (scrollTarget) {
        setTimeout(function() {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }

  // --- 2. Validation Helpers ---
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    var cleanNumber = phone.replace(/[^\d]/g, '');
    return cleanNumber.length === 10;
  }

  function clearErrors(form) {
    form.querySelectorAll('.custom-js-error').forEach(function(el) { el.remove(); });
    form.querySelectorAll('.field__input').forEach(function(el) { el.style.borderColor = ''; });
  }

  function showError(inputElement, message) {
    inputElement.style.borderColor = '#d9534f'; 
    var errorMsg = document.createElement('small');
    errorMsg.className = 'custom-js-error body-small';
    errorMsg.style.color = '#d9534f';
    errorMsg.style.display = 'block';
    errorMsg.style.marginTop = '4px';
    errorMsg.innerText = message;
    inputElement.parentNode.appendChild(errorMsg);
  }

  // --- 3. Handle Submit Validation, Loading State & Formatting ---
  function initGlobalForms() {
    var contactForms = document.querySelectorAll('form[action*="/contact"]');
    
    contactForms.forEach(function(form) {
      form.setAttribute('novalidate', 'novalidate');

// --- GTM Form Interaction Tracking (Per-Field) ---
      var interactedFields = {};

      form.addEventListener('focusin', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
          
          var rawName = e.target.getAttribute('name') || '';
          var nameMatch = rawName.match(/\[(.*?)\]/);
          var fieldName = nameMatch ? nameMatch[1] : (e.target.id || 'unknown_field');
          
          // Create a unique key for this specific field (e.g., "ContactForm-email")
          var fieldKey = form.id + '-' + fieldName;

          // Only push the event if we haven't tracked this specific field yet
          if (!interactedFields[fieldKey]) {
            interactedFields[fieldKey] = true; // Mark as tracked
            
            var formName = form.id === 'ContactForm' ? 'Main Contact Form' : 'FAQ Contact Form';

            if (typeof window.GTMHelper !== 'undefined') {
              window.GTMHelper.pushEvent('contact_us_form_interaction', {
                'form_name': formName,
                'field_name': fieldName
              });
            } else {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': 'contact_us_form_interaction',
                'form_name': formName,
                'field_name': fieldName
              });
            }
          }
        }
      }); 

      var phoneInput = form.querySelector('input[type="tel"]');
      
      // --- Phone Auto-Formatting ---
      if (phoneInput) {
        // Format as user types (XXXX XXX XXX)
        phoneInput.addEventListener('input', function(e) {
          var cleanNumber = this.value.replace(/[^\d]/g, '');
          var formattedNumber = '';

          if (cleanNumber.length > 0) {
            formattedNumber = cleanNumber.substring(0, 4);
            if (cleanNumber.length > 4) formattedNumber += ' ' + cleanNumber.substring(4, 7);
            if (cleanNumber.length > 7) formattedNumber += ' ' + cleanNumber.substring(7, 10);
          }
          this.value = formattedNumber;
        });

        // Restrict keystrokes to numbers and max length of 10
        phoneInput.addEventListener('keypress', function(e) {
          var cleanNumber = this.value.replace(/[^\d]/g, '');
          var maxLength = 10;
          
          if (e.which < 48 || e.which > 57) {
            e.preventDefault();
          }
          if (cleanNumber.length >= maxLength) {
            e.preventDefault();
          }
        });
      }

      // --- Form Submission Validation ---
      form.addEventListener('submit', function(event) {
        clearErrors(form);
        
        var isValid = true;
        var emailInput = form.querySelector('input[type="email"]');
        var messageInput = form.querySelector('textarea'); 

        // 1. Validate Email (Required & Format)
        if (emailInput) {
          if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email address is required.');
            isValid = false;
          } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address.');
            isValid = false;
          }
        }

        // 2. Validate Message (Required)
        if (messageInput) {
          if (messageInput.value.trim() === '') {
            showError(messageInput, 'Please enter a message.');
            isValid = false;
          }
        }

        // 3. Validate Phone (Optional, but checks length if provided)
        if (phoneInput && phoneInput.value.trim() !== '') {
          var cleanNumber = phoneInput.value.replace(/[^\d]/g, '');
          if (!validatePhone(cleanNumber)) {
            showError(phoneInput, 'Please enter exactly 10 digits.');
            isValid = false;
          }
        }

        // 4. Halt submission if any validation failed
        if (!isValid) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

        //gtm
        var formName = form.id === 'ContactForm' ? 'Main Contact Form' : 'FAQ Contact Form';

        if (typeof window.GTMHelper !== 'undefined') {
          window.GTMHelper.pushEvent('contact_us_form_submit', {
            'form_name': formName
          });
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'contact_us_form_submit',
            'form_name': formName
          });
        }

        // 5. Update UI to "Submitting..."
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          var label = submitBtn.querySelector('.button__label');
          if (label) {
            label.textContent = 'Submitting...';
          } else {
            submitBtn.textContent = 'Submitting...';
          }
          
          setTimeout(function() {
            submitBtn.disabled = true;
          }, 10);
        }
      });
    });
  }

  // --- Initialize Everything ---
  function initAll() {
    handleFormScroll();
    initGlobalForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();