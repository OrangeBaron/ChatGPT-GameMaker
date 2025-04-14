function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setLocalItem(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, function() {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function getLocalItem(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

function removeLocalItem(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, function() {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function parseConfig(mdContent) {
  const configObj = {};
  const regex = /##\s*(.+?)\n```([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(mdContent)) !== null) {
    const key = match[1].trim();
    const content = match[2].trim();
    configObj[key] = content;
  }
  return configObj;
}