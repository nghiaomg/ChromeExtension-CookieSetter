document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, function(tabs) {
      const currentTab = tabs[0];
      document.getElementById('currentUrl').innerHTML = ` <span class="font-medium text-xl">Current URL: </span><span class="font-thin text-xs">${currentTab.url}</span>`;
  });
});
loadSavedCookies();

document.getElementById('setCookies').addEventListener('click', function() {
  const cookieString = document.getElementById('cookieInput').value;

  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, function(tabs) {
      const currentTab = tabs[0];
      const url = new URL(currentTab.url);

      chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: setCookiesFromString,
          args: [cookieString, url.hostname]
      }, () => {
          document.getElementById('status').textContent = 'Cookies have been set!';
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
  chrome.storage.local.get(['savedCookies'], function(result) {
    let savedCookies = result.savedCookies || {};
    if (!savedCookies[domain]) {
      savedCookies[domain] = [];
    }
    savedCookies[domain].push(cookieStr);
    chrome.storage.local.set({
      savedCookies: savedCookies
    }, function() {
      console.log('Cookies saved for domain:', domain);
      loadSavedCookies();
    });
  });
}

function loadSavedCookies() {
  chrome.storage.local.get(['savedCookies'], function(result) {
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
  chrome.tabs.create({url: `https://${domain}`}, (tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: setCookiesFromString,
      args: [cookieString, domain]
    }, () => {
      console.log('Cookies applied to new tab');
      chrome.tabs.reload(tab.id);
    });
  });
}

function setCookiesFromString(cookieStr, domain) {
  const cookies = cookieStr.split(';');
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    document.cookie = `${name}=${value}; domain=${domain}; path=/`;
  });
}

document.getElementById('clearAllCookies').addEventListener('click', function() {
  chrome.storage.local.set({savedCookies: {}}, function() {
      console.log('All saved cookies cleared');
      loadSavedCookies();
  });
});