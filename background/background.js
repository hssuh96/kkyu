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

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.previousVersion < '0.1.0') {
    alert('뀨! 확장 프로그램이 업데이트되었습니다. 이전 버전과의 충돌로 정상적으로 작동되지 않을 수 있으니 오류 발생 시 삭제 후 다시 설치해주시기 바랍니다.');
  }
})
