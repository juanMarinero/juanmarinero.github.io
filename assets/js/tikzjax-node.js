for (let i = 0; i < 5; i++) {
  console.log('%ctikzjax-node.js loaded', 'font-weight: bold;');
}
// Configuration
const TIKZJAX_FIX_CONFIG = {
  TIMEOUT_MS: 3000,  // 3 second timeout to ensure TikZJax is done
  CONTAINER_SELECTORS: ['.tikzjax-node'] // All possible container classes
  // CONTAINER_SELECTORS: ['.tikzjax', '.tikzjax-node'] // All possible container classes
};

// Main processing function
function processTikzNodes() {
  // Process all TikZ containers
  const containers = document.querySelectorAll(TIKZJAX_FIX_CONFIG.CONTAINER_SELECTORS.join(','));
  
  containers.forEach(container => {
    const svgs = container.querySelectorAll('svg');
    
    svgs.forEach(svg => {
      // Find all paths that have M and Z commands
      const paths = Array.from(svg.querySelectorAll('path')).filter(path => {
        const d = path.getAttribute('d') || '';
        return d.includes('M') && d.includes('Z');
      });
      
      // Process each star path
      paths.forEach(path => {
        // Remove fill="none" if present
        if (path.getAttribute('fill') === 'none') {
          path.removeAttribute('fill');
        }
        
        // Also check parent groups
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
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Wait for TikZJax to finish rendering
  setTimeout(processTikzNodes, TIKZJAX_FIX_CONFIG.TIMEOUT_MS);
});
