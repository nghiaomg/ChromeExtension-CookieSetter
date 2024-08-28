document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      document.getElementById('currentUrl').innerHTML = ` <span class="font-medium text-xl">Current URL: </span><span class="font-thin text-xs">${currentTab.url}</span>`;
    });
  });
  
  document.getElementById('setCookies').addEventListener('click', function() {
    const cookieString = document.getElementById('cookieInput').value;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      const url = new URL(currentTab.url);
      
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: setCookiesFromString,
        args: [cookieString, url.hostname]
      }, () => {
        document.getElementById('status').textContent = 'Cookies have been set!';
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