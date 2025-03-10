// Trebound Booking Widget Embed Script
(function() {
  // Create container for the widget
  const container = document.createElement('div');
  container.id = 'trebound-booking-widget';
  document.body.appendChild(container);

  // Get script attributes
  const script = document.currentScript;
  const buttonStyle = script.getAttribute('data-button-style') || 'default';
  const buttonText = script.getAttribute('data-button-text') || 'Book Appointment';
  const primaryColor = script.getAttribute('data-primary-color') || '#8B5C9E';

  // Load required styles
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'https://your-domain.com/widget-styles.css';
  document.head.appendChild(styles);

  // Initialize the widget
  window.TreboundBooking = {
    init: function(options = {}) {
      const widgetUrl = `https://your-domain.com/widget?${new URLSearchParams({
        buttonStyle: options.buttonStyle || buttonStyle,
        buttonText: options.buttonText || buttonText,
        primaryColor: options.primaryColor || primaryColor
      })}`;

      const iframe = document.createElement('iframe');
      iframe.src = widgetUrl;
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '0';
      iframe.style.overflow = 'hidden';
      container.appendChild(iframe);

      // Handle iframe resizing
      window.addEventListener('message', (event) => {
        if (event.origin === 'https://your-domain.com') {
          const { type, height } = event.data;
          if (type === 'treboundResize') {
            iframe.style.height = `${height}px`;
          }
        }
      });
    }
  };

  // Auto-initialize if not explicitly disabled
  if (script.getAttribute('data-auto-init') !== 'false') {
    window.TreboundBooking.init();
  }
})(); 