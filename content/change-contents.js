console.log('loading content scripts : change-contents');

function setConverter(converterFunc) {
  console.log('setting string converter');

  clearConverter();

  eval('var func = ' + converterFunc);

  document.arrive(".UFICommentBody", {existing: true}, function() {
    this.innerHTML = func(this.innerHTML);
  });

  document.arrive(".userContent p", {existing: true}, function() {
    this.innerHTML = func(this.innerHTML);
  });

  document.arrive(".mtm p", {existing: true}, function() {
    this.innerHTML = func(this.innerHTML);
  });
}

function clearConverter() {
  Arrive.unbindAllArrive();
  $(".kkyu-item").remove();
}


var converterFunc = (str) => (str);

chrome.storage.sync.get(function(obj) {
  converterFunc = obj.converters[obj.selectedConverterIndex].func;
  if (obj.activated) {
    setConverter(converterFunc);
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes['activated']) {
    if (changes['activated'].newValue) {
      setConverter(converterFunc);
    }
    else {
      clearConverter();
    }
  }
  else if (changes['selectedConverterIndex']) {
    chrome.storage.sync.get(function(obj) {
      converterFunc = obj.converters[obj.selectedConverterIndex].func;
      setConverter(converterFunc);
    });
  }
});
