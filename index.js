(function(global, factory) {
	// 根据当前的环境采取不同的导出方式
	if (typeof define === 'function' && define.amd) {
		// ADM
		define(factory)
	} else if (typeof exports === 'object') {
		// CommomJS
		module.exports = factory()
	} else {
		// 非模块化环境
		global.LBUtils = factory()
	}
})(this, function() {
	// 判断是否是json
  const isJson = (value) => {
    try {
      const obj = JSON.parse(value)
      console.log('>>', obj)
      if (obj && typeof obj === 'object') {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

	return {
    isJson
	}
})