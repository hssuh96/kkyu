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
        this.selectedConverter = $.extend(true, {}, converter);
        chrome.storage.sync.set({selectedConverter: this.selectedConverter});
      },
      deleteItem: function(index) {
        this.converters.splice(index, 1);
        chrome.storage.sync.set({converters: this.converters});
      },
      onActivateButtonClick: function() {
        this.activated = !this.activated;
        chrome.storage.sync.set({activated: this.activated});
      },
      onMove: function(evt, originalEvent) {
        chrome.storage.sync.set({converters: this.converters});
      },
      addConverter: function(converter) {
        console.log('add item: ' + converter.func);
        this.converters.push($.extend(true, {}, converter));
        chrome.storage.sync.set({converters: this.converters});
      }
    }
  });
})
