// Check if current page is a contest
function isContestPage() {
  return window.location.href.includes('/contest/') || 
         window.location.href.includes('/assessment/');
}

// Monitor clipboard operations
document.addEventListener('copy', () => {
  if (isContestPage()) {
    chrome.runtime.sendMessage({ type: 'clipboardOperation' });
  }
});

document.addEventListener('paste', () => {
  if (isContestPage()) {
    chrome.runtime.sendMessage({ type: 'clipboardOperation' });
  }
});

// Monitor submissions
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch.apply(this, args);
  
  if (args[0].includes('/submit/') && isContestPage()) {
    chrome.runtime.sendMessage({ type: 'submission' });
  }
  
  return response;
};

// Monitor typing patterns
let lastKeyPressTime = null;
let keyPressIntervals = [];

document.addEventListener('keydown', (event) => {
  if (isContestPage()) {
    const currentTime = Date.now();
    if (lastKeyPressTime) {
      const interval = currentTime - lastKeyPressTime;
      keyPressIntervals.push(interval);
      
      // Check for suspicious typing patterns
      if (keyPressIntervals.length > 10) {
        const avgInterval = keyPressIntervals.reduce((a, b) => a + b) / keyPressIntervals.length;
        if (avgInterval < 50) { // Suspiciously fast typing
          chrome.runtime.sendMessage({ 
            type: 'suspiciousActivity',
            activity: 'Unusually fast typing detected'
          });
        }
        keyPressIntervals.shift();
      }
    }
    lastKeyPressTime = currentTime;
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkContest') {
    sendResponse({ inContest: isContestPage() });
  }
});

// Monitor for suspicious activities
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'suspiciousActivity') {
    // Create notification on the page
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #ff4444;
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    notification.textContent = `⚠️ ${request.activity.activity}`;
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}); 