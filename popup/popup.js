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
      console.log('load data from storage');
      console.log(obj);
      storageValue = $.extend(true, {}, obj);
    }
    resolve("successfully loaded storage value");
  });
})

promiseLoadStorage.then(function(value) {
  Vue.component('add-converter', {
    template: '#add-converter-template',
    data: function() {
      return {
        errorMessage: '',
        converterName: '',
        converterPrefix: '',
        converterSuffix: ''
      }
    },
    methods: {
      onAddButtonClick: function() {
        if (this.converterName.length === 0) {
          this.errorMessage = "버튼에 들어갈 이름을 입력해주세요";
          return;
        }
        else if (this.converterName.length > 10) {
          this.errorMessage = "버튼에 들어갈 이름은 10자 이내로 입력해주세요";
          return;
        }
        prefix = (this.converterPrefix) ? '\'<span class="kkyu-item">' + this.converterPrefix + ' </span>\'' : '\'\'';
        suffix = (this.converterSuffix) ? '\'<span class="kkyu-item"> ' + this.converterSuffix + '</span>\'' : '\'\'';
        func = '(str) => (' + prefix + '+str+' + suffix + ')';
        converter = {
          name: this.converterName,
          func: func
        };
        this.$emit('addconverter', converter);

        this.errorMessage = '';
        this.converterName = '';
        this.converterPrefix = '';
        this.converterSuffix = '';
      }
    }
  })

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
        return (this.activated) ? "사용 중지" : "다시 사용";
      }
    },
    methods: {
      onItemClick: function(converter) {
        this.selectedConverter = JSON.parse(JSON.stringify(converter));
      },
      deleteItem: function(index) {
        let newConverters = JSON.parse(JSON.stringify(this.converters));
        newConverters.splice(index, 1);
        this.converters = newConverters;
      },
      onActivateButtonClick: function() {
        this.activated = !this.activated;
      },
      addConverter: function(converter) {
        let newConverters = JSON.parse(JSON.stringify(this.converters));
        newConverters.push(JSON.parse(JSON.stringify(converter)));
        this.converters = newConverters;
      }
    },
    watch: {
      activated: function(newActivated) {
        console.log('activated changed. syncing with storage');
        chrome.storage.sync.set({activated: newActivated});
      },
      selectedConverter: function(newSelectedConverter) {
        console.log('selectedConverter changed. syncing with storage');
        chrome.storage.sync.set({selectedConverter: newSelectedConverter});
      },
      converters: function(newConverters) {
        console.log('converters changed. syncing with storage');
        chrome.storage.sync.set({converters: newConverters});
      }
    }
  });
})
