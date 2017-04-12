var storageValue = {};

// load data from storage
var promiseLoadStorage = new Promise(function(resolve, reject) {
  chrome.storage.sync.get(function(obj) {
    if (Object.getOwnPropertyNames(obj).length === 0) {
      console.log('initializing storage');
      chrome.storage.sync.set(defaultStorage);
      storageValue = {
        activated: defaultStorage.activated,
        currentConverterIndex: defaultStorage.currentConverterId,
        converters: defaultStorage.converters.slice()
      };
    }
    else {
      storageValue = {
        activated: obj.activated,
        currentConverterIndex: obj.currentConverterId,
        converters: obj.converters.slice()
      };
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
      currentConverterId: storageValue.currentConverterId,
      converters: storageValue.converters
    },
    computed: {
      activateButtonText: function() {
        return (this.activated) ? "사용 중지" : "사용";
      }
    },
    methods: {
      onItemClick: function(index) {
        this.currentConverterId = index;
        chrome.storage.sync.set({currentConverterId: index});
      },
      onActivateButtonClick: function() {
        this.activated = !this.activated;
        chrome.storage.sync.set({activated: this.activated});
      }
    },
    watch: {
      converters: function(newConverters) {
        chrome.storage.sync.set({converters: newConverters});
      }
    }
  });
})
