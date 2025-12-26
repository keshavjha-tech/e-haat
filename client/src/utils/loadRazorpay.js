/**
 * Load Razorpay checkout script dynamically
 * This function loads the Razorpay script and returns a promise
 */
export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay failed to load'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Razorpay script'));
      });
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    
    document.body.appendChild(script);
  });
};

