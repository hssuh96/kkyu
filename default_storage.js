converter1 = {
  name: '뀨!',
  func: "(str) => (str + '<span class=\"kkyu-item\"> 뀨!</span>')"
};

converter2 = {
  name: '아 오지구요~',
  func: "(str) => ('<span class=\"kkyu-item\">아 오지구요~ </span>' + str)"
};

converter3 = {
  name: 'ㅇㅈ? ㅇㅇㅈ~',
  func: "(str) => (str + '<span class=\"kkyu-item\"> ㅇㅈ? ㅇㅇㅈ~</span>')"
};

var defaultStorage = {
  activated: true,
  selectedConverter: converter1,
  converters: [
    converter1,
    converter2,
    converter3
  ]
}
