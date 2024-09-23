import { expect, test } from 'vitest'
import { isJson } from './index.js'

describe('测试 isJson 方法', () => {

  test('{} 是一个json数据返回true', () => {
    expect(isJson('{}')).toBeTruthy()
  })

  test('{a: 1} 不是一个json格式返回false', () => {
    expect(isJson({a: 1})).toBeFalsy()
  })

  test('null不是对象返回false', () => {
    expect(isJson(null)).toBeFalsy()
  })

  test('不传参数返回false', () => {
    expect(isJson()).toBeFalsy()
  })

})
