// Popup script
document.getElementById('currentUrl').textContent = 'Loading current URL...';
document.getElementById('openDashboard').addEventListener('click', openDashboard);
document.getElementById('reportPhishing').addEventListener('click', reportPhishing);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab && currentTab.url) {
    document.getElementById('currentUrl').textContent = truncateUrl(currentTab.url);
  }
});

function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:5173' });
}

function reportPhishing() {
  chrome.tabs.create({ url: 'http://localhost:5173/report' });
}

function truncateUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.href.length > 80 ? url.substring(0, 80) + '...' : url;
  } catch {
    return url;
  }
}
