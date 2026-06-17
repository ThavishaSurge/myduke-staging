(function () {
  // --- Handle Post-Submission Scroll ---
  function handleFormScroll() {
    var formResult = document.querySelector('.form-status');
    var hasFormHash = window.location.hash.indexOf('ContactForm') !== -1;

    if (formResult || hasFormHash) {
      // Target your specific scroller ID
      var scrollTarget = document.getElementById('myduke-form-scroller');
      
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
    var re = /^[\d\s\+\-\(\)]{8,15}$/;
    return re.test(phone);
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

  // --- Handle Submit Validation & Loading State ---
  function initGlobalForms() {
    // Select all forms on the page that have an action pointing to /contact
    var contactForms = document.querySelectorAll('form[action*="/contact"]');
    
    contactForms.forEach(function(form) {
      // Turn off default browser tooltips
      form.setAttribute('novalidate', 'novalidate');

      form.addEventListener('submit', function(event) {
        clearErrors(form);
        
        var isValid = true;
        var emailInput = form.querySelector('input[type="email"]');
        var phoneInput = form.querySelector('input[type="tel"]');

        if (emailInput && !validateEmail(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        }

        if (phoneInput && phoneInput.value.trim() !== '' && !validatePhone(phoneInput.value)) {
          showError(phoneInput, 'Please enter a valid phone number.');
          isValid = false;
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