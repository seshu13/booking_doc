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
      height: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.5);
    }
    .trebound-widget-frame.active {
      opacity: 1;
      pointer-events: all;
      height: 100%;
    }
    .trebound-widget-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .trebound-widget-button.default {
      background-color: var(--primary-color, #8B5C9E);
      color: white;
      border: none;
    }
    .trebound-widget-button.default:hover {
      background-color: var(--primary-color-dark, #7B4C8E);
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
  `;
  document.head.appendChild(style);

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'trebound-widget-frame';
  iframe.src = `${config.domain}/widget`;
  document.body.appendChild(iframe);

  // Handle messages from iframe
  window.addEventListener('message', function(event) {
    if (event.data.type === 'treboundResize') {
      // Handle iframe resize if needed
    }
  });

  // Create button
  function createButton(options = {}) {
    const mergedConfig = { ...config, ...options };
    const button = document.createElement('button');
    button.className = `trebound-widget-button ${mergedConfig.buttonStyle}`;
    button.textContent = mergedConfig.buttonText;
    button.style.setProperty('--primary-color', mergedConfig.primaryColor);
    button.style.setProperty('--primary-color-dark', adjustColor(mergedConfig.primaryColor, -20));
    
    button.addEventListener('click', function() {
      iframe.classList.add('active');
    });

    return button;
  }

  // Helper function to darken/lighten color
  function adjustColor(color, amount) {
    return color.replace(/^#/, '').replace(/.{2}/g, x => 
      ('0' + Math.min(255, Math.max(0, parseInt(x, 16) + amount)).toString(16)).slice(-2)
    ).replace(/^/, '#');
  }

  // Close widget when clicking outside
  iframe.addEventListener('click', function(e) {
    if (e.target === iframe) {
      iframe.classList.remove('active');
    }
  });

  // Expose to global scope
  window.TreboundWidget = {
    init: function(options = {}) {
      const button = createButton(options);
      return button;
    }
  };
})(); 