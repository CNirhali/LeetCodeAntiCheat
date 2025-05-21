// Store suspicious activities
let suspiciousActivities = [];
let isMonitoring = false;

// Initialize monitoring
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isMonitoring: false });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('leetcode.com')) {
    checkForContest(tab);
  }
});

// Monitor clipboard operations
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'clipboardOperation') {
    logSuspiciousActivity('Clipboard operation detected during contest');
  }
});

// Monitor multiple submissions
let lastSubmissionTime = null;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'submission') {
    const currentTime = Date.now();
    if (lastSubmissionTime && (currentTime - lastSubmissionTime) < 5000) {
      logSuspiciousActivity('Multiple submissions in short time interval');
    }
    lastSubmissionTime = currentTime;
  }
});

// Check if user is in a contest
async function checkForContest(tab) {
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'checkContest' });
    if (response.inContest) {
      startMonitoring();
    }
  } catch (error) {
    console.error('Error checking contest status:', error);
  }
}

// Start monitoring
function startMonitoring() {
  isMonitoring = true;
  chrome.storage.local.set({ isMonitoring: true });
  
  // Monitor tab switching
  chrome.tabs.onActivated.addListener(handleTabSwitch);
  
  // Monitor window focus
  chrome.windows.onFocusChanged.addListener(handleWindowFocus);
}

// Stop monitoring
function stopMonitoring() {
  isMonitoring = false;
  chrome.storage.local.set({ isMonitoring: false });
  chrome.tabs.onActivated.removeListener(handleTabSwitch);
  chrome.windows.onFocusChanged.removeListener(handleWindowFocus);
}

// Handle tab switching
function handleTabSwitch(activeInfo) {
  if (isMonitoring) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (!tab.url.includes('leetcode.com')) {
        logSuspiciousActivity('Switched to non-LeetCode tab during contest');
      }
    });
  }
}

// Handle window focus
function handleWindowFocus(windowId) {
  if (isMonitoring && windowId === chrome.windows.WINDOW_ID_NONE) {
    logSuspiciousActivity('Window focus lost during contest');
  }
}

// Log suspicious activity
function logSuspiciousActivity(activity) {
  const timestamp = new Date().toISOString();
  suspiciousActivities.push({ timestamp, activity });
  chrome.storage.local.set({ suspiciousActivities });
  
  // Notify content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'suspiciousActivity',
        activity: { timestamp, activity }
      });
    }
  });
} 