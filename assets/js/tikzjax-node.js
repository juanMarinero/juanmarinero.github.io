for (let i = 0; i < 5; i++) {
  console.log('%ctikzjax-node.js loaded', 'font-weight: bold;');
}
// Configuration
const TIKZJAX_FIX_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 500,
  TIMEOUT_MS: 4000,
  CONTAINER_SELECTORS: ['.tikzjax-node']
};

function processTikzNodes(retryCount = 0) {
  try {
    const containers = document.querySelectorAll(TIKZJAX_FIX_CONFIG.CONTAINER_SELECTORS.join(','));
    
    // If no containers found and we have retries left
    if (containers.length === 0 && retryCount < TIKZJAX_FIX_CONFIG.MAX_RETRIES) {
      setTimeout(() => processTikzNodes(retryCount + 1), TIKZJAX_FIX_CONFIG.RETRY_DELAY);
      return;
    }

    containers.forEach(container => {
      const svgs = container.querySelectorAll('svg');
      
      svgs.forEach(svg => {
        const paths = Array.from(svg.querySelectorAll('path')).filter(path => {
          const d = path.getAttribute('d') || '';
          return d.includes('M') && d.includes('Z');
        });
        
        paths.forEach(path => {
          if (path.getAttribute('fill') === 'none') {
            path.removeAttribute('fill');
          }
          
          let current = path.parentElement;
          while (current && current !== svg) {
            if (current.getAttribute('fill') === 'none') {
              current.removeAttribute('fill');
            }
            current = current.parentElement;
          }
        });
      });
    });
  } catch (error) {
    console.error('TikZJax processing error:', error);
    if (retryCount < TIKZJAX_FIX_CONFIG.MAX_RETRIES) {
      setTimeout(() => processTikzNodes(retryCount + 1), TIKZJAX_FIX_CONFIG.RETRY_DELAY);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(processTikzNodes, TIKZJAX_FIX_CONFIG.TIMEOUT_MS);
});
