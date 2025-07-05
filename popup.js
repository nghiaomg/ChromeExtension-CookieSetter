document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    const currentTab = tabs[0];
    document.getElementById('currentUrl').innerHTML = ` <span class="font-medium text-xl">Current URL: </span><span class="font-thin text-xs">${currentTab.url}</span>`;

    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: getCurrentCookies
    }, (results) => {
      if (results && results[0]) {
        const currentCookies = results[0].result;
        const cookieInput = document.getElementById('cookieInput');
        if (currentCookies && currentCookies.trim()) {
          cookieInput.value = currentCookies;
          cookieInput.placeholder = "Current cookies loaded. You can edit or copy them.";
        } else {
          cookieInput.placeholder = "No cookies found for this website. Enter cookies to set.";
        }
      }
    });
  });
});

function getCurrentCookies() {
  return document.cookie;
}

loadSavedCookies();

document.getElementById('setCookies').addEventListener('click', function () {
  const cookieString = document.getElementById('cookieInput').value;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    const currentTab = tabs[0];
    const url = new URL(currentTab.url);

    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: setCookiesFromString,
      args: [cookieString, url.hostname]
    }, () => {
      document.getElementById('status').textContent = 'Cookies have been set!';
      document.getElementById('status').style.color = '#4CAF50';
      setTimeout(() => {
        document.getElementById('status').style.color = '';
      }, 3000);
      saveCookies(cookieString, url.hostname);
      loadSavedCookies();
      chrome.tabs.reload(currentTab.id);
    });
  });
});

function setCookiesFromString(cookieStr, domain) {
  const cookies = cookieStr.split(';');
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    document.cookie = `${name}=${value}; domain=${domain}; path=/`;
  });
}

function saveCookies(cookieStr, domain) {
  chrome.storage.local.get(['savedCookies'], function (result) {
    let savedCookies = result.savedCookies || {};
    if (!savedCookies[domain]) {
      savedCookies[domain] = [];
    }
    
    // Check if this cookie already exists or is very similar
    if (!isDuplicateOrSimilarCookie(cookieStr, savedCookies[domain])) {
      savedCookies[domain].push(cookieStr);
      chrome.storage.local.set({
        savedCookies: savedCookies
      }, function () {
        console.log('Cookies saved for domain:', domain);
        // Show success message for saving to history
        const statusEl = document.getElementById('status');
        if (statusEl.textContent.includes('Cookies have been set!')) {
          statusEl.textContent = 'Cookies have been set and saved to history!';
        }
        loadSavedCookies();
      });
    } else {
      console.log('Cookie already exists or is too similar, not saving');
      // Show message to user that cookie was not saved due to similarity
      document.getElementById('status').textContent = 'Cookie not saved - similar cookie already exists!';
      document.getElementById('status').style.color = '#f44336';
      setTimeout(() => {
        document.getElementById('status').textContent = '';
        document.getElementById('status').style.color = '';
      }, 3000);
      // Still reload the saved cookies to refresh the UI
      loadSavedCookies();
    }
  });
}

function loadSavedCookies() {
  chrome.storage.local.get(['savedCookies'], function (result) {
    const savedCookies = result.savedCookies || {};
    const cookieList = document.getElementById('savedCookieList');
    cookieList.innerHTML = '';

    for (const [domain, cookieStrings] of Object.entries(savedCookies)) {
      const domainItem = document.createElement('li');
      domainItem.className = 'saved-domain-item';
      domainItem.innerHTML = `<strong>${domain}</strong>`;

      const cookieSubList = document.createElement('ul');
      cookieStrings.forEach((cookieStr, index) => {
        const cookieItem = document.createElement('li');
        cookieItem.className = 'saved-cookie-item';
        const shortCookies = cookieStr.length > 30 ? cookieStr.substring(0, 30) + '...' : cookieStr;
        cookieItem.innerHTML = `${domain} ${index + 1}: ${shortCookies}`;
        cookieItem.addEventListener('click', () => applyCookies(domain, cookieStr));
        cookieSubList.appendChild(cookieItem);
      });

      domainItem.appendChild(cookieSubList);
      cookieList.appendChild(domainItem);
    }
  });
}

function applyCookies(domain, cookieString) {
  chrome.tabs.create({ url: `https://${domain}` }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: setCookiesFromString,
      args: [cookieString, domain]
    }, () => {
      console.log('Cookies applied to new tab');
      chrome.tabs.reload(tab.id);
    });
  });
}

// Function to check if a cookie is duplicate or very similar to existing ones
function isDuplicateOrSimilarCookie(newCookieStr, existingCookies) {
  if (!newCookieStr || !newCookieStr.trim()) {
    return true; // Don't save empty cookies
  }
  
  const newCookieNormalized = normalizeCookieString(newCookieStr);
  
  for (const existingCookie of existingCookies) {
    const existingCookieNormalized = normalizeCookieString(existingCookie);
    
    // Check exact match
    if (newCookieNormalized === existingCookieNormalized) {
      return true;
    }
    
    // Check similarity (more than 90% similar)
    const similarity = calculateCookieSimilarity(newCookieNormalized, existingCookieNormalized);
    if (similarity > 0.9) {
      return true;
    }
  }
  
  return false;
}

// Normalize cookie string for comparison
function normalizeCookieString(cookieStr) {
  return cookieStr
    .split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.length > 0)
    .sort() // Sort to handle order differences
    .join(';')
    .toLowerCase();
}

// Calculate similarity between two cookie strings
function calculateCookieSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  
  const cookies1 = str1.split(';').filter(c => c.trim());
  const cookies2 = str2.split(';').filter(c => c.trim());
  
  // If one is much longer than the other, they're probably different
  const lengthRatio = Math.min(cookies1.length, cookies2.length) / Math.max(cookies1.length, cookies2.length);
  if (lengthRatio < 0.7) return 0;
  
  // Count matching cookies
  let matches = 0;
  for (const cookie1 of cookies1) {
    for (const cookie2 of cookies2) {
      if (cookie1 === cookie2) {
        matches++;
        break;
      }
    }
  }
  
  // Calculate similarity as percentage of matching cookies
  return matches / Math.max(cookies1.length, cookies2.length);
}

document.getElementById('clearAllCookies').addEventListener('click', function () {
  chrome.storage.local.set({ savedCookies: {} }, function () {
    console.log('All saved cookies cleared');
    loadSavedCookies();
  });
});

document.getElementById('copyCookies').addEventListener('click', function () {
  const cookieInput = document.getElementById('cookieInput');
  const copyButton = document.getElementById('copyCookies');

  if (!cookieInput.value.trim()) {
    copyButton.textContent = 'No cookies!';
    copyButton.style.backgroundColor = '#f44336';
    setTimeout(() => {
      copyButton.textContent = 'Copy';
      copyButton.style.backgroundColor = '#4CAF50';
    }, 1000);
    return;
  }

  cookieInput.select();
  cookieInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(cookieInput.value).then(() => {
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    copyButton.classList.add('copied');
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.classList.remove('copied');
    }, 1000);
  }).catch(() => {
    copyButton.textContent = 'Failed!';
    copyButton.style.backgroundColor = '#f44336';
    setTimeout(() => {
      copyButton.textContent = 'Copy';
      copyButton.style.backgroundColor = '#4CAF50';
    }, 1000);
  });
});