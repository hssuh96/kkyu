converter1 = {
  name: '뀨!',
  func: function(str) {
    return (str + '<span class="kkyu_item"> 뀨!</span>');
  }
};
converter2 = {
  name: '아 오지구요~',
  func: function(str) {
    return ('<span class="kkyu_item">아 오지구요~ </span>' + str);
  }
};
converter3 = {
  name: 'ㅇㅈ? ㅇㅇㅈ~',
  func: function(str) {
    return (str + '<span class="kkyu_item"> ㅇㅈ? ㅇㅇㅈ~</span>');
  }
}
var defaultStorage = {
  activated: true,
  currentConverterIndex: 0,
  converters: [
    converter1,
    converter2,
    converter3
  ]
}
