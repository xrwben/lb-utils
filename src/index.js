// export { formatThousandStyle } from './number.js'
// 判断是否是json
export const isJson = (value) => {
	try {
	  const obj = JSON.parse(value)
	  // console.log('>>', obj)
	  if (obj && typeof obj === 'object') {
	    return true
	  }
	  return false
	} catch (err) {
	  return false
	}
}

// export const testFn = (...rest) => {
//     const obj = {
//         name: 'daben',
//         sex: '男'
//     }
//     return {
//         ...rest,
//         ...obj,
//         money: rest
//     }
// }

// 生成 uuid，未登录用户唯一标识，用在h5端，生成的uuid的长度，默认32位，总长度36位[选填]，生成的uuid的数字的进制数，默认10进制[选填]
// export const getUuid = (len, radix) => {
//     let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('') // chars 固定，不支持修改，表示生成的唯一标识所含的字符
//     let uuid = [], i
//     radix = radix || chars.length

//     if (len) {
//         // Compact form
//         for (i = 0; i < len; i++) {
//             uuid[i] = chars[0 | Math.random() * radix]
//         }
//     } else {
//         // rfc4122, version 4 form
//         let r

//         // rfc4122 requires these characters
//         uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
//         uuid[14] = '4'

//         // Fill in random data.  At i==19 set the high bits of clock sequence as
//         // per rfc4122, sec. 4.1.5
//         for (i = 0; i < 36; i++) {
//             if (!uuid[i]) {
//                 r = 0 | Math.random() * 16
//                 uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
//             }
//         }
//     }

//     return uuid.join('')
// }