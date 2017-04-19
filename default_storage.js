converter1 = {
  name: '뀨!',
  func: "(str) => (str + '<span class=\"kkyu-item\"> 뀨!</span>')",
  prefix: '',
  suffix: '뀨!'
};

converter2 = {
  name: '급식체',
  func: "(str) => ('<span class=\"kkyu-item\">아 오지구요~ </span>'+str+'<span class=\"kkyu-item\"> ㅇㅈ? ㅇㅇㅈ~</span>')",
  prefix: '아 오지구요~',
  suffix: 'ㅇㅈ? ㅇㅇㅈ~'
};

converter3 = {
  name: '휴먼창정체',
  func: "(str) => ('<span class=\"kkyu-item\">쒸벌,,,,탱,,,ㅎㅎ </span>'+str+'<span class=\"kkyu-item\"> ~~~~~~^^</span>')",
  prefix: '쒸벌,,,,탱,,,ㅎㅎ',
  suffix: '~~~~~~^^'
};

var defaultStorage = {
  selectedConverter: converter1,
  converters: [
    converter1,
    converter2,
    converter3
  ]
}
