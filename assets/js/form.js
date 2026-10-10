/**
 * BrightSmile Dental Studio — Demo Appointment Form Handler
 * DEMO ONLY — No data is transmitted or stored.
 */

(function () {
  'use strict';

  var form = document.getElementById('appointment-form-el');
  var formContainer = document.getElementById('form-container');
  var successMessage = document.getElementById('form-success');
  var resetBtn = document.getElementById('form-reset-btn');

  if (!form) return;

  // Validation rules
  var validators = {
    'first-name': {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s'-]+$/,
      messages: {
        required: 'Please enter your first name.',
        minLength: 'Name must be at least 2 characters.',
        pattern: 'Please enter a valid name.'
      }
    },
    'email': {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      messages: {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
      }
    },
    'contact-method': {
      required: true,
      messages: {
        required: 'Please select a preferred contact method.'
      }
    },
    'service-category': {
      required: true,
      messages: {
        required: 'Please select a service category.'
      }
    }
  };

  function validateField(fieldId) {
    var field = document.getElementById(fieldId);
    if (!field) return true;

    var rules = validators[fieldId];
    if (!rules) return true;

    var value = field.value.trim();
    var formGroup = field.closest('.form-group');
    var errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
    var errorMessage = '';

    // Required check
    if (rules.required && !value) {
      errorMessage = rules.messages.required;
    }
    // Min length check
    else if (rules.minLength && value.length < rules.minLength && value.length > 0) {
      errorMessage = rules.messages.minLength;
    }
    // Pattern check
    else if (rules.pattern && value && !rules.pattern.test(value)) {
      errorMessage = rules.messages.pattern;
    }

    if (errorMessage) {
      if (formGroup) formGroup.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
      }
      field.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      if (formGroup) formGroup.classList.remove('has-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      field.setAttribute('aria-invalid', 'false');
      return true;
    }
  }

  // Validate on blur
  Object.keys(validators).forEach(function (fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function () {
        validateField(fieldId);
      });
      // Clear error on input
      field.addEventListener('input', function () {
        var formGroup = field.closest('.form-group');
        if (formGroup && formGroup.classList.contains('has-error')) {
          validateField(fieldId);
        }
      });
    }
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = true;
    Object.keys(validators).forEach(function (fieldId) {
      if (!validateField(fieldId)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Focus first error field
      var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();

      // Announce to screen readers
      announceMessage('Please correct the errors in the form before submitting.');
      return;
    }

    // DEMO: No data is transmitted. Clear the form values immediately.
    form.reset();

    // Show success message
    if (formContainer) formContainer.style.display = 'none';
    if (successMessage) {
      successMessage.classList.add('visible');
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Announce to screen readers
      announceMessage('Demo form submitted successfully. No data was sent or stored.');
    }
  });

  // Reset / try again
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (successMessage) successMessage.classList.remove('visible');
      if (formContainer) formContainer.style.display = 'block';
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Clear all error states
      form.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('has-error');
      });
      form.querySelectorAll('.form-error').forEach(function (err) {
        err.style.display = 'none';
        err.textContent = '';
      });
    });
  }

  // Screen reader announcements
  function announceMessage(msg) {
    var liveRegion = document.getElementById('form-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'form-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    // Small delay so the screen reader re-reads
    setTimeout(function () {
      liveRegion.textContent = msg;
    }, 100);
  }

})();
