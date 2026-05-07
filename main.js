const statusNode = document.getElementById('connection-status');
const yearNode = document.getElementById('year');

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const updateStatus = () => {
  if (!statusNode) return;
  statusNode.textContent = navigator.onLine ? 'Online — syncing OGX services.' : 'Offline mode active — cached OGX data loaded.';
};

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      if (statusNode) {
        statusNode.textContent = 'Service worker unavailable. Running in online mode.';
      }
    });
  });
}
