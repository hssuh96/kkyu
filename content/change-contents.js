console.log('loading content scripts : change-contents');

var converter = -1;

function setConverter() {
  clearConverter();

  if (converter !== -1) {
    console.log('setting string converter : ' + converter.func);

    eval('var func = ' + converter.func);

    document.arrive(".UFICommentBody", {existing: true}, function() { // comments
      this.innerHTML = func(this.innerHTML);
    });

    document.arrive(".userContent p", {existing: true}, function() { // user's posts
      this.innerHTML = func(this.innerHTML);
    });

    document.arrive(".mtm p", {existing: true}, function() { // shared posts
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
  converter = JSON.parse(JSON.stringify(obj.selectedConverter));
  console.log(converter);
  setConverter();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('storage onChanged Listener triggered');
  if (changes['selectedConverter']) {
    converter = JSON.parse(JSON.stringify(changes['selectedConverter'].newValue));
    console.log(converter);
    setConverter();
  }
});
