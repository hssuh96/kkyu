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
    methods: {
      onItemClick: function(index) {
        console.log(index);
      }
    },
    watch: {
      converters: function(newConverters) {
        console.log(chrome.storage.sync.set({converters: newConverters}));
      }
    }
  });
})
