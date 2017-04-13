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
      selectedConverter: storageValue.selectedConverter,
      converters: storageValue.converters
    },
    computed: {
      activateButtonText: function() {
        return (this.activated) ? "사용 중지" : "사용";
      }
    },
    methods: {
      onItemClick: function(converter) {
        this.selectedConverter = $.extend(true, {}, converter);;
        chrome.storage.sync.set({selectedConverter: this.selectedConverter});
      },
      onActivateButtonClick: function() {
        this.activated = !this.activated;
        chrome.storage.sync.set({activated: this.activated});
      },
      onMove: function(evt, originalEvent) {
        chrome.storage.sync.set({converters: this.converters});
      }
    }
  });
})
