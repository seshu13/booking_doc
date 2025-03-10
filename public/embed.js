// Trebound Booking Widget Embed Script
(function() {
  // Configuration object to store widget settings
  const config = {
    buttonStyle: 'default',
    buttonText: 'Book Appointment',
    primaryColor: '#8B5C9E',
    domain: window.TREBOUND_DOMAIN || 'http://localhost:3000' // Allow domain override
  };

  // Create and inject styles
  const style = document.createElement('style');
  style.textContent = `
    .trebound-widget-frame {
      border: none;
      width: 100%;
      max-width: 800px;
      height: 90vh;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000000;
      border-radius: 12px;
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
      background: white;
      overflow: hidden; /* Prevent content overflow */
    }
    .trebound-widget-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 999999;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }
    .trebound-widget-overlay.active {
      opacity: 1;
      pointer-events: all;
    }
    .trebound-widget-frame.active {
      opacity: 1;
      pointer-events: all;
    }
    .trebound-widget-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
      touch-action: manipulation; /* Optimize touch interactions */
    }
    .trebound-widget-button.default {
      background-color: var(--primary-color, #8B5C9E);
      color: white;
      border: none;
    }
    .trebound-widget-button.default:hover {
      background-color: var(--primary-color-dark, #7B4C8E);
    }
    .trebound-widget-button.default:active {
      transform: scale(0.98); /* Add slight press effect */
    }
    .trebound-widget-button.outline {
      background-color: transparent;
      color: var(--primary-color, #8B5C9E);
      border: 2px solid var(--primary-color, #8B5C9E);
    }
    .trebound-widget-button.outline:hover {
      background-color: var(--primary-color, #8B5C9E);
      color: white;
    }
    .trebound-widget-button.minimal {
      background-color: transparent;
      color: var(--primary-color, #8B5C9E);
      border: none;
    }
    .trebound-widget-button.minimal:hover {
      text-decoration: underline;
    }
    @media (max-width: 840px) {
      .trebound-widget-frame {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
        top: 0;
        left: 0;
        transform: none;
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform: translateY(100%);
      }
      .trebound-widget-frame.active {
        transform: translateY(0);
      }
      .trebound-widget-button {
        padding: 14px 24px; /* Slightly larger touch target on mobile */
      }
    }
    /* Handle notched displays */
    @supports (padding: env(safe-area-inset-bottom)) {
      @media (max-width: 840px) {
        .trebound-widget-frame {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    }
  `;
  document.head.appendChild(style);

  let iframe = null;
  let overlay = null;

  // Create iframe and overlay when needed
  function createWidgetElements() {
    if (!iframe) {
      // Create overlay
      overlay = document.createElement('div');
      overlay.className = 'trebound-widget-overlay';
      document.body.appendChild(overlay);

      // Create iframe
      iframe = document.createElement('iframe');
      iframe.className = 'trebound-widget-frame';
      iframe.src = `${config.domain}/widget/booking`; // Direct to booking page
      iframe.setAttribute('allow', 'payment'); // Allow payment APIs
      document.body.appendChild(iframe);

      // Close widget when clicking overlay
      overlay.addEventListener('click', hideWidget);

      // Handle messages from iframe
      window.addEventListener('message', function(event) {
        if (event.data.type === 'treboundClose') {
          hideWidget();
        }
      });

      // Handle escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          hideWidget();
        }
      });
    }
    return { iframe, overlay };
  }

  // Show widget
  function showWidget() {
    const elements = createWidgetElements();
    elements.overlay.classList.add('active');
    elements.iframe.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Hide widget
  function hideWidget() {
    if (iframe && overlay) {
      overlay.classList.remove('active');
      iframe.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // Create button
  function createButton(options = {}) {
    const mergedConfig = { ...config, ...options };
    const button = document.createElement('button');
    button.className = `trebound-widget-button ${mergedConfig.buttonStyle}`;
    button.textContent = mergedConfig.buttonText;
    button.style.setProperty('--primary-color', mergedConfig.primaryColor);
    button.style.setProperty('--primary-color-dark', adjustColor(mergedConfig.primaryColor, -20));
    
    button.addEventListener('click', function() {
      showWidget();
    });

    return button;
  }

  // Helper function to darken/lighten color
  function adjustColor(color, amount) {
    return color.replace(/^#/, '').replace(/.{2}/g, x => 
      ('0' + Math.min(255, Math.max(0, parseInt(x, 16) + amount)).toString(16)).slice(-2)
    ).replace(/^/, '#');
  }

  // Expose to global scope
  window.TreboundWidget = {
    init: function(options = {}) {
      const button = createButton(options);
      return button;
    }
  };
})(); 