console.log('loading content scripts : change-contents');

var objectActivated = false;
var converterFunc = (str) => (str);

function setConverter() {
  clearConverter();

  if (objectActivated) {
    console.log('setting string converter : ' + converterFunc);

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

    console.log('set string converter');
  }
}

function clearConverter() {
  Arrive.unbindAllArrive();
  $(".kkyu-item").remove();
}

// get data from storage
chrome.storage.sync.get(function(obj) {
  objectActivated = obj.activated;
  converterFunc = obj.selectedConverter.func;
  setConverter();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('storage onChanged Listener triggered');
  if (changes['activated']) {
    objectActivated = changes['activated'].newValue;
  }
  if (changes['selectedConverter']) {
    converterFunc = changes['selectedConverter'].newValue.func;
  }
  if (changes['converters']) {
    return;
  }
  setConverter(converterFunc);
});
