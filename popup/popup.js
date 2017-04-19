// function funcToPrefixSuffix(func) {
//   func = func.substring(9);
//
//   let indexStr = func.search(/str/);
//
//   let index1 = func.search(/<span class="kkyu-item">/);
//   let index2 = func.search(/<\/span>/);
//
//   let prefix = func.substring(index1+24, index2-1);
//
//   func = func.substring(index2 + 7);
//
//   index1 = func.search(/<span class="kkyu-item">/);
//   index2 = func.search(/<\/span>/);
//
//   let suffix = func.substring(index1+25, index2);
//
//   return [prefix, suffix];
// }

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
});


// defining vue directive
Vue.directive('mousedown-outside', {
  bind: function (el, binding, vnode) {
    this.mousedownOutsideListener = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('mousedown', this.mousedownOutsideListener)
  },
  unbind: function (el) {
    document.body.removeEventListener('mousedown', this.mousedownOutsideListener)
  },
});


// defining vue component
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
  computed: {
    sampleText: function() {
      return this.converterPrefix + ' 예시 문구입니다. ' + this.converterSuffix;
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
});

promiseLoadStorage.then(function(value) {
  var vm = new Vue({
    el: '#app',
    data: {
      options: {
        animation: 0,
        forceFallback: true,
        ghostClass: 'ghost'
      },
      selectedConverter: storageValue.selectedConverter,
      converters: storageValue.converters,
      editingIndex: -1,
      editErrorMessage: '',
      editingName: '',
      editingPrefix: '',
      editingSuffix: ''
    },
    computed: {
      activated: function() {
        return this.selectedConverter !== -1;
      },
      editingSampleText: function() {
        return this.editingPrefix + ' 예시 문구입니다. ' + this.editingSuffix;
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
      onDeactivateButtonClick: function() {
        this.selectedConverter = -1;
      },
      editItem: function(index) {
        console.log('edit item: ' + index);
        this.editingIndex = index;
        this.editErrorMessage = '';
        this.editingName = this.converters[index].name;
        this.editingPrefix = this.converters[index].prefix;
        this.editingSuffix = this.converters[index].suffix;
      },
      cancelEdit: function() {
        console.log('cancel edit');

        if (!this.converters[this.editingIndex].name) {
          this.deleteItem(this.converters.length-1);
        }

        this.editingIndex = -1; // hide editing box
        this.editErrorMessage = '';
        this.editingName = '';
        this.editingPrefix = '';
        this.editingSuffix = '';
      },
      saveItem: function() {
        if (this.editingName.length === 0) {
          this.editErrorMessage = "버튼에 들어갈 이름을 입력해주세요";
          return;
        }
        else if (this.editingName.length > 10) {
          this.editErrorMessage = "버튼에 들어갈 이름은 10자 이내로 입력해주세요";
          return;
        }

        var funcPrefix = (this.editingPrefix) ? '\'<span class="kkyu-item">' + this.editingPrefix + ' </span>\'+' : '';
        var funcSuffix = (this.editingSuffix) ? '+\'<span class="kkyu-item"> ' + this.editingSuffix + '</span>\'' : '';
        var func = '(str) => (' + funcPrefix + 'str' + funcSuffix + ')';

        let newConverters = JSON.parse(JSON.stringify(this.converters));
        newConverters[this.editingIndex] = {
          name: this.editingName,
          func: func,
          prefix: this.editingPrefix,
          suffix: this.editingSuffix
        };
        this.converters = newConverters;

        this.editErrorMessage = '';
        this.editingName = '';
        this.editingPrefix = '';
        this.editingSuffix = '';
        this.editingIndex = -1; // hide editing box
      },
      addItem: function() {
        let newConverters = JSON.parse(JSON.stringify(this.converters));
        newConverters.push({
          name: '',
          func: "(str) => (str)",
          prefix: '',
          suffix: ''
        });
        this.converters = newConverters;
        this.editingIndex = this.converters.length - 1;
      }
    },
    watch: {
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
