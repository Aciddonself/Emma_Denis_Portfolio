/**
 * EMMANUEL DENIS TABAN - PORTFOLIO JAVASCRIPT
 * Includes: Theme Toggle, Mobile Menu, Active Scroll Highlighting, Counters,
 * Spotlight Cards, Scroll Reveal, WhatsApp Widget, EmailJS Form,
 * Reviews & Testimonials
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initThemeToggle();
  initMobileMenu();
  initActiveScrollSpy();
  initCounters();
  initSpotlightCards();
  initScrollReveal();
  initWhatsAppWidget();
  initContactForm();
  initReviewForm();
  updateFooterYear();
});

/* ==========================================================================
   1. THEME TOGGLE (LIGHT / DARK)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  // The inline script in <head> already runs and sets the correct data-theme attribute.
  // We just need to ensure the UI button represents the correct state.
  const updateToggleKnob = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeToggleBtn.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    
    // Update active icon classes
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (isLight) {
        sunIcon.classList.add('active-icon');
        moonIcon.classList.remove('active-icon');
      } else {
        moonIcon.classList.add('active-icon');
        sunIcon.classList.remove('active-icon');
      }
    }
  };

  updateToggleKnob();

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleKnob();
  });

  // Handle keyboard events (Enter or Space) on the custom toggle button
  themeToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      themeToggleBtn.click();
    }
  });
}

/* ==========================================================================
   2. MOBILE NAV HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!hamburger || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close mobile menu on clicking any link
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY - HIGHLIGHT ACTIVE NAVIGATION LINK
   ========================================================================== */
function initActiveScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const spyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies middle 10% of screen
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach(section => spyObserver.observe(section));
}

/* ==========================================================================
   4. ACHIEVEMENT COUNTERS ANIMATION (COUNT UP ON SCROLL)
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length === 0) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * target);
      
      element.textContent = `${currentValue}+`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = `${target}+`;
      }
    };

    requestAnimationFrame(animate);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        countUp(element);
        observer.unobserve(element); // Count only once
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================================================
   5. MOUSEMOVE SPOTLIGHT EFFECT (LIQUID GLASS HOVER CARDS)
   ========================================================================== */
function initSpotlightCards() {
  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.glass-hover-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Triggers slightly before element is 10% in view
    threshold: 0.05
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   8. WHATSAPP FLOATING CHAT WIDGET & POPUP
   ========================================================================== */
function initWhatsAppWidget() {
  const triggerBtn = document.getElementById('whatsapp-trigger-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-popup-close');
  const startChatBtn = document.getElementById('whatsapp-start-chat');

  if (!triggerBtn || !popup) return;

  const openPopup = () => {
    popup.classList.add('active');
    triggerBtn.setAttribute('aria-expanded', 'true');
    // Set focus inside the popup for accessibility
    setTimeout(() => startChatBtn?.focus(), 100);
  };

  const closePopup = () => {
    popup.classList.remove('active');
    triggerBtn.setAttribute('aria-expanded', 'false');
    triggerBtn.focus();
  };

  // Toggle popup on button click
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popup.classList.contains('active')) {
      closePopup();
    } else {
      openPopup();
    }
  });

  // Close popup with close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });
  }

  // Prevent click propagation inside popup from closing it
  popup.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close popup on clicking anywhere else on page
  document.addEventListener('click', () => {
    if (popup.classList.contains('active')) {
      closePopup();
    }
  });

  // Close popup with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });

  // Keyboard support for whatsapp trigger button
  triggerBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerBtn.click();
    }
  });
}

/* ==========================================================================
   9. EMAILJS CONTACT FORM SUBMISSION (WITH VALIDATION, AUTO-REPLY & LOADING STATE)
   ========================================================================== */

// EmailJS configuration (EmailJS Dashboard -> Account -> Public Key, Email Services, Templates)
const EMAILJS_PUBLIC_KEY = 'bq3RWHCsvoGw8dRjc';
const EMAILJS_SERVICE_ID = 'service_q6ai36k';
const EMAILJS_TEMPLATE_ID = 'template_rcz2xq';

// AUTO-REPLY TEMPLATE (sent to the visitor who submits the contact form)
// Create it in your EmailJS Dashboard -> Email Templates -> Create New Template:
//   Template name : Portfolio Auto-Reply
//   To            : {{user_email}}
//   Subject       : Thanks for reaching out to Emmanuel Denis Taban
//   Content       : Hi {{name}}, thanks for getting in touch! I've received your message and I'll reply within 24 hours. Need me sooner? Message me on WhatsApp: +256 753 149 567. Talk soon, Emmanuel.
// After creating it, paste its Template ID below in place of template_autoreply_XXXXXXX.
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_autoreply_XXXXXXX';

// A credential is only usable when it has been replaced from its placeholder
const isConfigured = (value) => {
  return typeof value === 'string' && value.length > 0 && value.indexOf('XXXXXXX') === -1;
};

// Initialize the EmailJS SDK with the public key
function initEmailJS() {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS SDK not loaded. Contact form email delivery is disabled.');
    return false;
  }

  if (!isConfigured(EMAILJS_PUBLIC_KEY) || !isConfigured(EMAILJS_SERVICE_ID) || !isConfigured(EMAILJS_TEMPLATE_ID)) {
    console.warn('EmailJS credentials are not fully configured in js/main.js.');
    return false;
  }

  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    return true;
  } catch (err) {
    console.error('EmailJS initialization failed:', err);
    return false;
  }
}

function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const formMessage = document.getElementById('form-message-box');

  if (!form || !submitBtn) return;

  const emailJSAvailable = initEmailJS();
  const autoReplyConfigured = isConfigured(EMAILJS_AUTOREPLY_TEMPLATE_ID);

  // Clear previous inline errors
  const clearErrors = () => {
    const errorElements = form.querySelectorAll('.inline-error');
    errorElements.forEach(el => el.remove());

    const fields = form.querySelectorAll('.form-control');
    fields.forEach(field => {
      field.style.borderColor = '';
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });
  };

  // Display inline error message under input
  const showError = (fieldId, msg) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.style.borderColor = '#f87171'; // Red border accent

    const errorDiv = document.createElement('div');
    errorDiv.className = 'inline-error';
    errorDiv.style.color = '#f87171';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.fontWeight = '600';
    errorDiv.style.marginTop = '0.35rem';
    errorDiv.id = fieldId + '-error';
    errorDiv.textContent = msg;

    field.parentNode.appendChild(errorDiv);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorDiv.id);
  };

  // Display a form-level status message (success or error)
  const showMessage = (isSuccess, html) => {
    if (!formMessage) return;
    formMessage.classList.add(isSuccess ? 'success' : 'error');
    formMessage.innerHTML = html;
    formMessage.style.display = 'block';
  };

  const showSubmissionFailure = (error, details) => {
    if (!formMessage) return;

    const status = Number(error && error.status) || Number(details && details.status);
    const serviceMessage = (error && error.text) || (details && details.text) || (error && error.message);
    const subject = document.getElementById('form-subject').value.trim();
    const body = [
      'Name: ' + document.getElementById('form-name').value.trim(),
      'Email: ' + document.getElementById('form-email').value.trim(),
      'Subject: ' + subject,
      '',
      document.getElementById('form-message').value.trim()
    ].join('\n');
    const message = document.createElement('span');
    message.textContent = 'Your message could not be sent. It is still in the form. ';

    const emailLink = document.createElement('a');
    emailLink.className = 'underline';
    emailLink.href = 'mailto:emmadenistaban@gmail.com?subject=' +
      encodeURIComponent(subject || 'Portfolio enquiry') + '&body=' + encodeURIComponent(body);
    emailLink.textContent = 'Open it in your email app';

    formMessage.replaceChildren(message, emailLink);

    if (status) {
      const statusMessage = document.createElement('p');
      statusMessage.textContent = status === 403
        ? 'EmailJS rejected this page (HTTP 403). Check the public key and authorize the published site domain in EmailJS Allowed Origins.'
        : 'Email service response: HTTP ' + status + (serviceMessage ? ' — ' + serviceMessage : '');
      formMessage.append(document.createElement('br'), statusMessage);
    } else if (serviceMessage) {
      const statusMessage = document.createElement('p');
      statusMessage.textContent = 'Details: ' + serviceMessage;
      formMessage.append(document.createElement('br'), statusMessage);
    }

    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    if (formMessage) {
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
    }

    // Honeypot: silently ignore bot submissions
    const botField = form.querySelector('input[name="bot-field"]');
    if (botField && botField.value) {
      return;
    }

    // EmailJS not ready (SDK missing or credentials incomplete)
    if (!emailJSAvailable) {
      showMessage(false, 'Email delivery is not configured yet. Please email me directly at <a href="mailto:emmadenistaban@gmail.com" class="underline">emmadenistaban@gmail.com</a> or chat on <a href="https://wa.me/256753149567" target="_blank" rel="noopener noreferrer" class="underline">WhatsApp</a>.');
      return;
    }

    let isValid = true;

    // Custom Validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name) {
      showError('form-name', 'Name is required.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('form-email', 'Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('form-email', 'Please provide a valid email address.');
      isValid = false;
    }

    if (!subject) {
      showError('form-subject', 'Subject is required.');
      isValid = false;
    }

    if (!message) {
      showError('form-message', 'Message is required.');
      isValid = false;
    }

    if (!isValid) {
      // Focus the first invalid element
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Set Loading state on Submit Button
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    // Template parameters - variable names must match those in the EmailJS templates
    const templateParams = {
      name: name,
      email: email,
      user_name: name,
      user_email: email,
      subject: subject,
      message: message
    };

    // 1) Send the message to Emmanuel (template_rcz2xq)
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        // EmailJS resolves with { status, text } even for HTTP errors (400/402/403)
        if (!response || response.status < 200 || response.status >= 300) {
          const error = new Error('EmailJS delivery failed');
          error.status = response && response.status;
          error.text = response && response.text;
          throw error;
        }

        // Primary message delivered -> clear the form
        form.reset();

        // 2) Auto-reply to the visitor (non-blocking: a failure here must not
        //    affect the success state of the primary submission)
        if (autoReplyConfigured) {
          return emailjs
            .send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, {
              name: name,
              user_name: name,
              user_email: email,
              subject: subject,
              message: message
            })
            .catch((autoReplyError) => {
              console.warn('Auto-reply could not be sent:', autoReplyError);
            });
        }

        return null;
      })
      .then(() => {
        // Reset loading state
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        showMessage(true, "Thanks! Your message has been sent. I'll reply soon.");
      })
      .catch((error) => {
        // Reset loading state
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        console.error('EmailJS send error:', error);

        showSubmissionFailure(error);
      });
  });
}

/* ==========================================================================
   9B. TESTIMONIALS / REVIEWS (ON-PAGE DISPLAY + EMAIL NOTIFICATION)
   ========================================================================== */

const REVIEWS_STORAGE_KEY = 'portfolio_reviews';

const SAMPLE_REVIEWS = [];

function loadReviews() {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not load stored reviews:', err);
  }
  return SAMPLE_REVIEWS.slice();
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.warn('Could not save review:', err);
  }
}

// Escape user-generated content before injecting it into the page
const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  const reviews = loadReviews();
  grid.innerHTML = '';

  reviews.forEach((review) => {
    const card = document.createElement('article');
    card.className = 'glass-panel glass-hover-card testimonial-card';

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += '<svg viewBox="0 0 24 24" fill="currentColor" class="' + (i <= review.rating ? 'star-filled' : 'star-empty') + '" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>';
    }

    const initials = review.name.split(' ').map((part) => part.charAt(0)).join('').slice(0, 2).toUpperCase();

    card.innerHTML =
      '<div class="testimonial-stars">' + starsHtml + '</div>' +
      '<p class="testimonial-text">&ldquo;' + escapeHtml(review.text) + '&rdquo;</p>' +
      '<div class="testimonial-author">' +
        '<span class="testimonial-avatar" aria-hidden="true">' + escapeHtml(initials) + '</span>' +
        '<span class="testimonial-author-info">' +
          '<span class="testimonial-name">' + escapeHtml(review.name) + '</span>' +
          (review.meta ? '<span class="testimonial-meta">' + escapeHtml(review.meta) + '</span>' : '') +
        '</span>' +
      '</div>';

    grid.appendChild(card);
  });
}

function initReviewForm() {
  const form = document.getElementById('portfolio-review-form');
  const submitBtn = document.getElementById('review-submit-btn');
  const formMessage = document.getElementById('review-message-box');
  const ratingWidget = document.getElementById('rating-widget');

  if (!form || !submitBtn || !ratingWidget) return;

  // Render existing reviews on load
  renderReviews();

  // ----- Star rating widget -----
  let rating = 0;
  const starButtons = Array.prototype.slice.call(ratingWidget.querySelectorAll('.star-btn'));

  const setVisual = (value) => {
    starButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index < value);
    });
  };

  const setRating = (value) => {
    rating = value;
    setVisual(value);
    starButtons.forEach((btn, index) => {
      btn.setAttribute('aria-checked', index < value ? 'true' : 'false');
    });
  };

  starButtons.forEach((btn, index) => {
    btn.addEventListener('mouseenter', () => setVisual(index + 1));
    btn.addEventListener('focus', () => setVisual(index + 1));
    btn.addEventListener('click', () => setRating(index + 1));
  });

  ratingWidget.addEventListener('mouseleave', () => setVisual(rating));

  // Arrow key support for the rating radiogroup
  ratingWidget.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRating(Math.min(rating + 1, 5));
      if (starButtons[rating - 1]) starButtons[rating - 1].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRating(Math.max(rating - 1, 1));
      if (starButtons[rating - 1]) starButtons[rating - 1].focus();
    }
  });

  const emailJSAvailable = initEmailJS();

  // Clear previous inline errors
  const clearErrors = () => {
    const errorElements = form.querySelectorAll('.inline-error');
    errorElements.forEach(el => el.remove());

    const fields = form.querySelectorAll('.form-control');
    fields.forEach(field => {
      field.style.borderColor = '';
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });
  };

  // Display inline error message under input
  const showError = (fieldId, msg) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.style.borderColor = '#f87171'; // Red border accent

    const errorDiv = document.createElement('div');
    errorDiv.className = 'inline-error';
    errorDiv.style.color = '#f87171';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.fontWeight = '600';
    errorDiv.style.marginTop = '0.35rem';
    errorDiv.id = fieldId + '-error';
    errorDiv.textContent = msg;

    field.parentNode.appendChild(errorDiv);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorDiv.id);
  };

  // Display an error under the star rating widget
  const showRatingError = (msg) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'inline-error';
    errorDiv.id = 'rating-error';
    errorDiv.style.color = '#f87171';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.fontWeight = '600';
    errorDiv.style.marginTop = '0.35rem';
    errorDiv.textContent = msg;
    ratingWidget.parentNode.appendChild(errorDiv);
  };

  // Display a form-level status message (success or error)
  const showMessage = (isSuccess, html) => {
    if (!formMessage) return;
    formMessage.classList.add(isSuccess ? 'success' : 'error');
    formMessage.innerHTML = html;
    formMessage.style.display = 'block';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    if (formMessage) {
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
    }

    // Honeypot: silently ignore bot submissions
    const botField = form.querySelector('input[name="review-bot-field"]');
    if (botField && botField.value) {
      return;
    }

    // EmailJS not ready (SDK missing or credentials incomplete)
    if (!emailJSAvailable) {
      showMessage(false, 'Review submission is not configured yet. Please email me directly at <a href="mailto:emmadenistaban@gmail.com" class="underline">emmadenistaban@gmail.com</a>.');
      return;
    }

    const name = document.getElementById('review-name').value.trim();
    const email = document.getElementById('review-email').value.trim();
    const text = document.getElementById('review-text').value.trim();

    let isValid = true;

    if (rating === 0) {
      showRatingError('Please select a star rating.');
      isValid = false;
    }

    if (!name) {
      showError('review-name', 'Name is required.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      showError('review-email', 'Please provide a valid email address.');
      isValid = false;
    }

    if (!text) {
      showError('review-text', 'Please write your review.');
      isValid = false;
    } else if (text.length < 10) {
      showError('review-text', 'Please write at least 10 characters.');
      isValid = false;
    }

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Set Loading state on Submit Button
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;

    // Send the review to Emmanuel as an email (reuses the contact EmailJS template)
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        user_name: name,
        user_email: email || 'not provided',
        subject: 'New Portfolio Review: ' + rating + '/5 stars',
        message: name + ' left a ' + rating + '/5 star review on your portfolio:\n\n"' + text + '"' + (email ? '\n\nReply to: ' + email : '')
      })
      .then((response) => {
        // Reset loading state
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        // EmailJS resolves with { status, text } even for HTTP errors (400/402/403)
        if (!response || response.status < 200 || response.status >= 300) {
          throw new Error('EmailJS delivery failed (status: ' + (response ? response.status : 'unknown') + ')');
        }

        // Add the review to the on-page list and persist it locally
        const reviews = loadReviews();
        reviews.unshift({ name: name, meta: 'Portfolio Visitor', rating: rating, text: text });
        saveReviews(reviews);
        renderReviews();

        // Reset form and rating widget
        form.reset();
        setRating(0);

        showMessage(true, 'Thank you! Your review has been posted and sent to Emmanuel.');
      })
      .catch((error) => {
        // Reset loading state
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;

        console.error('Review email error:', error);

        showMessage(false, 'Review could not be sent. Please email me directly at <a href="mailto:emmadenistaban@gmail.com" class="underline">emmadenistaban@gmail.com</a>.');
      });
  });
}

/* ==========================================================================
   10. FOOTER & BACK TO TOP BUTTON LOGIC
   ========================================================================== */
function updateFooterYear() {
  const yearElement = document.getElementById('footer-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Back to Top trigger functionality
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus the header area or skip link for keyboard access
    const mainNav = document.querySelector('.header-nav');
    if (mainNav) {
      mainNav.setAttribute('tabindex', '-1');
      mainNav.focus();
    }
  });
}
