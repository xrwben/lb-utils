function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

// 金额转换成千分位格式展示
var formatThousandStyle = function formatThousandStyle() {
  var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var split_amount = (val + '').split('.'),
    // 将传入金额转换为字符串并以小数点作为分割
    formats = [split_amount[0]].map(function (item) {
      // 对整数部分进行千分位格式化
      var reg = /\d{1,3}(?=(\d{3})+$)/g;
      return item.replace(reg, '$&,');
    });
  // 拼接小数部分
  return formats + (split_amount[1] != undefined ? '.' + split_amount[1] : '');
};

// 判断是否是json
var isJson = function isJson(value) {
  try {
    var obj = JSON.parse(value);
    console.log('>>', obj);
    if (obj && _typeof(obj) === 'object') {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
var testFn = function testFn() {
  var obj = {
    name: 'daben',
    sex: '男'
  };
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }
  return _objectSpread2(_objectSpread2(_objectSpread2({}, rest), obj), {}, {
    money: rest
  });
};

// 生成 uuid，未登录用户唯一标识，用在h5端，生成的uuid的长度，默认32位，总长度36位[选填]，生成的uuid的数字的进制数，默认10进制[选填]
var getUuid = function getUuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); // chars 固定，不支持修改，表示生成的唯一标识所含的字符
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

export { formatThousandStyle, getUuid, isJson, testFn };
