export const prerender = true;

// Create a function to monkey patch the fetch method
function monkeyPatchFetch() {
  // Store the original fetch function
  const originalFetch = window.fetch;

  // Define a new fetch function with the desired behavior
  window.fetch = function(url, options) {
    // Check if the URL has a trailing slash and query parameters
    if (!url.includes('?') && !url.endsWith('/')) {
      url += '/';
    }

    // Call the original fetch function with the modified URL
    return originalFetch.call(window, url, options);
  };

}

// Call the monkeyPatchFetch function to apply the monkey patch
monkeyPatchFetch();
