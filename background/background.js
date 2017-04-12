// initializing storage
chrome.storage.sync.get(function(obj) {
  if (Object.getOwnPropertyNames(obj).length === 0) {
    console.log('initializing storage');
    chrome.storage.sync.set(defaultStorage);
  }
});
