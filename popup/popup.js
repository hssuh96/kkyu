var storageValue = {};

// load data from storage
var promiseLoadStorage = new Promise(function(resolve, reject) {
  chrome.storage.sync.get(function(obj) {
    if (Object.getOwnPropertyNames(obj).length === 0) {
      console.log('initializing storage');
      chrome.storage.sync.set(defaultStorage);
      storageValue = $.extend(true, {}, defaultStorage);
    }
    else {
      storageValue = $.extend(true, {}, obj);
    }
    resolve("successfully loaded storage value");
  });
})

promiseLoadStorage.then(function(value) {
  var vm = new Vue({
    el: '#app',
    data: {
      options: {
      },
      activated: storageValue.activated,
      selectedConverterIndex: storageValue.selectedConverterIndex,
      converters: storageValue.converters
    },
    computed: {
      activateButtonText: function() {
        return (this.activated) ? "사용 중지" : "사용";
      }
    },
    methods: {
      onItemClick: function(index) {
        this.selectedConverterIndex = index;
        chrome.storage.sync.set({selectedConverterIndex: index});
      },
      onActivateButtonClick: function() {
        this.activated = !this.activated;
        chrome.storage.sync.set({activated: this.activated});
      }
    },
    watch: {
      converters: function(newConverters) {
        chrome.storage.sync.set({converters: newConverters});
        // TODO : 위치 바뀐 element에 현재 converter가 포함되어 있다면
      }
    }
  });
})
