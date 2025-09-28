// Wait for the page to fully load and content to be rendered
function initializeSliders() {
  const sliders = document.querySelectorAll('.gallery-slider');
  console.log('Found sliders to initialize:', sliders.length);
  
  sliders.forEach(slider => {
    // Skip if already initialized
    if (slider.swiper) {
      console.log('Slider already initialized');
      return;
    }
    
    // Initialize Swiper
    try {
      const swiper = new Swiper(slider, {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 30,
        navigation: {
          nextEl: slider.querySelector('.swiper-button-next'),
          prevEl: slider.querySelector('.swiper-button-prev'),
        },
        on: {
          init: function() {
            console.log('Swiper initialized successfully!');
          }
        }
      });
    } catch (error) {
      console.error('Swiper initialization error:', error);
    }
  });
}

// Initialize after a short delay to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure shortcodes are rendered
    setTimeout(initializeSliders, 100);
  });
} else {
  // DOM already loaded, but wait for shortcodes
  setTimeout(initializeSliders, 100);
}

// Also try after all resources are loaded
window.addEventListener('load', function() {
  setTimeout(initializeSliders, 200);
});

// MutationObserver as fallback for dynamically added content
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Check if any new nodes contain sliders
        const hasNewSliders = Array.from(mutation.addedNodes).some(node => {
          return node.nodeType === 1 && (
            node.classList?.contains('gallery-slider') || 
            node.querySelector?.('.gallery-slider')
          );
        });
        if (hasNewSliders) {
          setTimeout(initializeSliders, 50);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
