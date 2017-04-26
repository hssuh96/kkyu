// code for making prefix, suffix html-safe
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}


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


Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
    el.select()
  }
})


promiseLoadStorage.then(function(value) {
  var vm = new Vue({
    el: '#app',
    data: {
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
      options: function() {
        return {
          animation: 0,
          forceFallback: true,
          ghostClass: 'ghost',
          disabled: (this.editingIndex !== -1)
        };
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

        var funcPrefix = (this.editingPrefix) ? '\'<span class="kkyu-item">' + escapeHtml(this.editingPrefix) + ' </span>\'+' : '';
        var funcSuffix = (this.editingSuffix) ? '+\'<span class="kkyu-item"> ' + escapeHtml(this.editingSuffix) + '</span>\'' : '';
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
      },
      mouseDownOutsideEditingBoxListener: function(event) {
        console.log('mouseDownOutsideEditingBoxListener called');
        if (!($(".editing-button")[0] == event.target || $(".editing-button")[0].contains(event.target) ||
        $(".editing-box")[0] == event.target || $(".editing-box")[0].contains(event.target))) {
          this.cancelEdit();
        }
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
      },
      editingIndex: function(val, oldVal) {
        if (oldVal !== -1) {
          document.body.removeEventListener('mousedown', this.mouseDownOutsideEditingBoxListener);
        }
        if (val !== -1) {
          document.body.addEventListener('mousedown', this.mouseDownOutsideEditingBoxListener);
        }
      }
    }
  });
})
