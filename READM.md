## 前言

&emsp;最近拜读了颜海镜老师的新书《现代JavaScript库开发：原理、技术与实战》，书是23年刚出的时候买的，当时好多技术博主的公众号和博客在推这本书然后有送书活动，我没有抽中只能花大几十元子去网上购买了，买回来后大致翻阅了一下，第一感觉是书中有些技术还是比较老旧了，心想又是一次智商税（大几十元子还是十分心痛的如果颜老师看到的能给我报销吗？）为什么又会再次看呢，一个是之前失业了需要恶补一下知识体系，然后是面试的时候有个面试官和HR问我最近有没有看过什么书，刚好回答这本书，显得我很专业很爱学习（实则买来吃灰），再个是今年入职的公司所在的部门是一个以基建为主的部门，所以再次拜读了这本书。

&emsp;我相信对于绝大部分有一定工具经验的小伙伴来说，都有个开发Javascript库的经验，但是我在网上搜索了一下，却是鲜有完整的或成体系的文章输出，虽然书中某些工具版本比较老了，但是重要的是大佬像我们输出了如何开发一个Javascript库的思想。书中作者表示：“每一个开发者都拥有两个世界：一个是业务世界，另一个是开源世界。” 通过读后感受，结合平常接触的知识，接下来也带大家一起学习如何进入开源的世界。


## 编写代码


### 一体化开发

&emsp;在很久很久以前，如果我们需要开发一个JavaScript工具库，可能没有任何构建打包工具，也没有模块化的概念，我们是如何写代码的呢？

```js
// 判断是否是json
function isJson(value) {
	try {
	  const obj = JSON.parse(value)
	  if (obj && typeof obj === 'object') {
	    return true
	  }
	  return false
	} catch (err) {
	  return false
	}
}
```

如果要使用在HTML文件通过script引入即可

```html
<script src="./a.js"></script> 
```

这种编码方式有几个问题，第一是各个js文件可能需要按顺序引入，第二是可能方法名会产生冲突覆盖。而且其他人要使用只能拷贝下来才能用。


### 模块化开发

&emsp;为了解决一体化开发带来的问题，就相继出现了各种模块化的开发方式，比如在 ES模块 出现前，比较流行的UMD， 全称为 Universal Module Definition，即统一模块定义。那么我们的JavaScript工具代码就变成下面这样：

```js
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
```

通过这种方式，我们编写的代码就可以在不同的环境使用。


## 打包构建

### 模块化

### 打包工具

### NPM


## 测试

## 开源


## 维护

## 更好的设计
