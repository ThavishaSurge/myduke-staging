(function () {
  // --- Handle Post-Submission Scroll ---
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

  // --- Validation Helpers ---
  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    var cleanNumber = phone.replace(/[^\d]/g, '');
    
    // Check for 10 digits starting with 0[2,3,4,7,8]
    if (cleanNumber.length === 10 && cleanNumber.startsWith('0')) {
        return /^0[23478]\d{8}$/.test(cleanNumber);
    } 
    // Check for 9 digits starting with [2,3,4,7,8] (Assumes +61 prefix context)
    else if (cleanNumber.length === 9 && !cleanNumber.startsWith('0')) {
        return /^[23478]\d{8}$/.test(cleanNumber);
    }
    
    return false;
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

  // --- Handle Submit Validation, Loading State & Formatting ---
  function initGlobalForms() {
    var contactForms = document.querySelectorAll('form[action*="/contact"]');
    
    contactForms.forEach(function(form) {
      form.setAttribute('novalidate', 'novalidate');

      var phoneInput = form.querySelector('input[type="tel"]');
      
      // --- AU Phone Auto-Formatting ---
      if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
          var cleanNumber = this.value.replace(/[^\d]/g, '');
          var formattedNumber = '';

          if (cleanNumber.length > 0) {
            if (cleanNumber.startsWith('0')) {
              // Format: 0412 345 678 (4, 3, 3)
              formattedNumber = cleanNumber.substring(0, 4);
              if (cleanNumber.length > 4) formattedNumber += ' ' + cleanNumber.substring(4, 7);
              if (cleanNumber.length > 7) formattedNumber += ' ' + cleanNumber.substring(7, 10);
            } else {
              // Format: 412 345 678 (3, 3, 3)
              formattedNumber = cleanNumber.substring(0, 3);
              if (cleanNumber.length > 3) formattedNumber += ' ' + cleanNumber.substring(3, 6);
              if (cleanNumber.length > 6) formattedNumber += ' ' + cleanNumber.substring(6, 9);
            }
          }
          this.value = formattedNumber;
        });

        // Restrict keystrokes to numbers and max length
        phoneInput.addEventListener('keypress', function(e) {
          var cleanNumber = this.value.replace(/[^\d]/g, '');
          var maxLength = cleanNumber.startsWith('0') ? 10 : 9;
          
          // Allow only number keys (char codes 48-57)
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

        if (emailInput && !validateEmail(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        }

        if (phoneInput && phoneInput.value.trim() !== '') {
          var cleanNumber = phoneInput.value.replace(/[^\d]/g, '');
          if (!validatePhone(cleanNumber)) {
            var errorText = cleanNumber.length !== 10 && cleanNumber.startsWith('0') 
              ? 'Please enter exactly 10 digits.' 
              : 'Please enter a valid Australian number (e.g., starting with 04, 02, 03).';
            showError(phoneInput, errorText);
            isValid = false;
          }
        }

        if (!isValid) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }

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