// initializing storage
chrome.storage.sync.get(function(obj) {
  if (Object.getOwnPropertyNames(obj).length === 0) {
    console.log('initializing storage');
    chrome.storage.sync.set(defaultStorage);
  }
});

chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  console.log('onDOMContentLoaded fired');
  console.log(details);

  if (details.url.indexOf('ajax') === -1 && details.url.indexOf('php') === -1) {
    console.log('onDOMContentLoaded fired and condition matched');
    console.log(details);
    chrome.tabs.executeScript(details.tabId, {file: "libs/jquery-3.1.1.min.js"}, function() {
      chrome.tabs.executeScript(details.tabId, {file: "libs/arrive.min.js"}, function() {
        chrome.tabs.executeScript(details.tabId, {file: "content/change-contents.js"});
      });
    });
  }
}, {
  url: [
    {hostContains: 'www.facebook.com'}
  ]
});
