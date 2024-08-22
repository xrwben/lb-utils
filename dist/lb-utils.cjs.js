'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 金额转换成千分位格式展示
const formatThousandStyle = (val = 0) => {
    let split_amount = (val + '').split('.'),
    // 将传入金额转换为字符串并以小数点作为分割
    formats = [split_amount[0]].map((item) => {
        // 对整数部分进行千分位格式化
        let reg = /\d{1,3}(?=(\d{3})+$)/g;
        return item.replace(reg, '$&,');
    }); 
    // 拼接小数部分
    return formats + (split_amount[1] != undefined ? '.' + split_amount[1] : '');
};

// 判断是否是json
const isJson = (value) => {
	try {
	  const obj = JSON.parse(value);
	  console.log('>>', obj);
	  if (obj && typeof obj === 'object') {
	    return true
	  }
	  return false
	} catch (err) {
	  return false
	}
};

// 生成 uuid，未登录用户唯一标识，用在h5端，生成的uuid的长度，默认32位，总长度36位[选填]，生成的uuid的数字的进制数，默认10进制[选填]
const getUuid = (len, radix) => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); // chars 固定，不支持修改，表示生成的唯一标识所含的字符
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('')
};

exports.formatThousandStyle = formatThousandStyle;
exports.getUuid = getUuid;
exports.isJson = isJson;
