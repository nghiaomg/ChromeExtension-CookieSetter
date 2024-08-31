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
          target: {
              tabId: currentTab.id
          },
          func: setCookiesFromString,
          args: [cookieString, url.hostname]
      }, () => {
          document.getElementById('status').textContent = 'Cookies have been set!';
          saveCookies(cookieString, url.hostname);
          loadSavedCookies();
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
          savedCookies[domain] = cookieStr;
          chrome.storage.local.set({
              savedCookies: savedCookies
          }, function() {
              console.log('Cookies saved for domain:', domain);
          });
      }
  });
}

function loadSavedCookies() {
  chrome.storage.local.get(['savedCookies'], function(result) {
    const savedCookies = result.savedCookies || {};
    const cookieList = document.getElementById('savedCookieList');
    cookieList.innerHTML = '';

    for (const [domain, cookies] of Object.entries(savedCookies)) {
      const listItem = document.createElement('li');
      listItem.className = 'saved-cookie-item';
      const shortCookies = cookies.length > 30 ? cookies.substring(0, 30) + '...' : cookies;
      listItem.innerHTML = `<strong>${domain}</strong>: ${shortCookies}`;
      listItem.addEventListener('click', () => applyCookies(domain, cookies));
      cookieList.appendChild(listItem);
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