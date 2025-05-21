document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');
  const toggleButton = document.getElementById('toggleMonitoring');
  const activitiesDiv = document.getElementById('activities');

  // Load initial state
  chrome.storage.local.get(['isMonitoring', 'suspiciousActivities'], (result) => {
    updateStatus(result.isMonitoring);
    updateActivities(result.suspiciousActivities || []);
  });

  // Toggle monitoring
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get(['isMonitoring'], (result) => {
      const newState = !result.isMonitoring;
      chrome.storage.local.set({ isMonitoring: newState });
      updateStatus(newState);
      
      // Send message to background script
      chrome.runtime.sendMessage({
        type: newState ? 'startMonitoring' : 'stopMonitoring'
      });
    });
  });

  // Update status display
  function updateStatus(isMonitoring) {
    statusDiv.textContent = isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive';
    statusDiv.className = `status ${isMonitoring ? 'active' : 'inactive'}`;
    toggleButton.textContent = isMonitoring ? 'Stop Monitoring' : 'Start Monitoring';
  }

  // Update activities list
  function updateActivities(activities) {
    activitiesDiv.innerHTML = '';
    activities.reverse().forEach(activity => {
      const activityDiv = document.createElement('div');
      activityDiv.className = 'activity-item';
      
      const timestamp = new Date(activity.timestamp).toLocaleString();
      activityDiv.innerHTML = `
        <div class="timestamp">${timestamp}</div>
        <div>${activity.activity}</div>
      `;
      
      activitiesDiv.appendChild(activityDiv);
    });
  }

  // Listen for updates
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isMonitoring) {
      updateStatus(changes.isMonitoring.newValue);
    }
    if (changes.suspiciousActivities) {
      updateActivities(changes.suspiciousActivities.newValue);
    }
  });
}); 