## 前言

&emsp;最近拜读了颜海镜老师的新书《现代 JavaScript 库开发：原理、技术与实战》，书是 23 年刚出的时候买的，当时好多技术博主的公众号和博客在推这本书然后有送书活动，我没有抽中只能花大几十元子去网上购买了，买回来后大致翻阅了一下，第一感觉是书中有些技术还是比较老旧了，心想又是一次智商税（大几十元子还是十分心痛的如果颜老师看到的能给我报销吗？）为什么又会再次看呢，一个是之前失业了需要恶补一下知识体系，然后是面试的时候有个面试官和 HR 问我最近有没有看过什么书，刚好回答这本书，显得我很专业很爱学习（实则买来吃灰），再个是今年入职的公司所在的部门是一个以基建为主的部门，所以再次拜读了这本书。

&emsp;我相信对于绝大部分有一定工具经验的小伙伴来说，都有个开发 Javascript 库的经验，但是我在网上搜索了一下，却是鲜有完整的或成体系的文章输出，虽然书中某些工具版本比较老了，但是重要的是大佬像我们输出了如何开发一个 Javascript 库的思想。书中作者表示：“每一个开发者都拥有两个世界：一个是业务世界，另一个是开源世界。” 通过读后感受，结合平常接触的知识，做一个读书分享，也带大家一起学习如何进入开源的世界。

## 一、编写代码

### 一体化开发

&emsp;在很久很久以前，如果我们需要开发一个 JavaScript 工具库，可能没有任何构建打包工具，也没有模块化的概念，我们是如何写代码的呢？

```js
// 判断是否是json
function isJson(value) {
  try {
    const obj = JSON.parse(value);
    if (obj && typeof obj === "object") {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
```

如果要使用在 HTML 文件通过 script 引入即可

```html
<script src="./a.js"></script>
<script src="./b.js"></script>
```

这种编码方式有几个问题，第一是各个 js 文件可能需要按顺序引入，第二是可能方法名会产生冲突覆盖。而且其他人要使用只能拷贝下来才能用。

### 模块化开发

&emsp;为了解决一体化开发带来的问题，就相继出现了各种模块化的开发方式，比如在 ES 模块 出现前，比较流行的 UMD， 全称为 Universal Module Definition，即统一模块定义。那么我们的 JavaScript 工具代码就变成下面这样：

```js
(function (global, factory) {
  // 根据当前的环境采取不同的导出方式
  if (typeof define === "function" && define.amd) {
    // ADM
    define(factory);
  } else if (typeof exports === "object") {
    // CommomJS
    module.exports = factory();
  } else {
    // 非模块化环境
    global.LBUtils = factory();
  }
})(this, function () {
  // 判断是否是json
  const isJson = (value) => {
    try {
      const obj = JSON.parse(value);
      console.log(">>", obj);
      if (obj && typeof obj === "object") {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };
  return {
    isJson,
  };
});
```

通过这种方式，我们编写的代码就可以在不同的环境使用。

## 二、打包构建

&emsp;前面我们美滋滋把代码写完了，虽然可以在很多场景下用了，但是可能还会存在一些问题，第一位同学直接在 Vue 或者 React 工程通过 ES Module 导入发现也用不了。第二位同学好不容易在项目里可以用了，发现换个浏览器就报错了，发现箭头函数不能用，这还用个勾八的库，不如粘贴复制来的快。第三位同学想要开发一个自己的库，还需要把 UMD 格式代码完整复制过来，但他只想安静的写工具方法，第四位同学发现，我只想引入其中某个方法，但是你却只能把所有方法都导入进来，而第五六七位同学可能还有其它问题。

&emsp;上述问题都是由于构建方式导致的，工具库是为了能给其他人用的，你就必须解决上面出现的这些问题，甚至更多的问题，因为身为库的开发者，这样的 `issue` 是我们必须要解决的，所以我们需要工具构建我们的库，要解决上述问题就要了解 **模块化、NPM、打包工具、编译**等一些相关内容。

### 模块化

##### 模块化定义

&emsp;模块化是一种编程范式，旨在通过将代码分割成独立、可重用的模块来提高代码的可维护性和可扩展性。在 JavaScript 中，模块化可以通过多种方式实现，包括 CommonJS、AMD（Asynchronous Module Definition）、UMD（Universal Module Definition）和 ES 模块（ESM）。

##### 模块化好处

- **可维护性：** 模块化使得软件更容易维护和更新，因为每个模块都是独立的，可以单独修改和测试。

- **可重用性：** 模块化允许开发者在不同的项目中重用已有的模块，减少重复工作。

- **可扩展性：** 随着系统需求的增长，可以添加新的模块来扩展系统的功能，而不影响现有模块。

总之通过模块化，你可以更有效地组织和管理代码，提高开发效率和代码质量。

##### 模块化规范

- **IIFE：** 立即调用函数表达式

- **AMD：** 异步模块加载机制

- **CMD：** 通用模块定义

- **UMD：** 统一模块定义

- **CommonJS：** Node.js 采用该规范

- **ES 模块：** JavaScript 内置模块系统

下面我们主要说一下`UMD`、`CommonJS`、`ES模块`，为什么只讨论这三个，毕竟 AMD、CMD 大概率已经是过去式了，估计好多人虽然听过但是几乎没有使用过，所以不需要大篇幅展开。

##### UMD

**定义：** UMD 全程为 Universal Module Definition，即统一模块定义。旨在同时支持 CommonJS 和 AMD 环境，也支持全局变量。

**代码结构：**

```js
(function (global, factory) {
  // 根据当前的环境采取不同的导出方式
  if (typeof define === "function" && define.amd) {
    // ADM
    define(factory);
  } else if (typeof exports === "object") {
    // CommomJS
    module.exports = factory();
  } else {
    // 非模块化环境
    global.LBUtils = factory();
  }
})(this, function () {
  // 这里写逻辑代码
});
```

##### CommonJS

**定义：** CommonJS 是 Node.js 早期采用的模块系统，使用 require 和 module.exports 语法。

注意：Node.js 目前不仅支持使用 CommonJS 来实现模块，还支持最新的 ES 模块。

**代码结构：**

```js
// 导出模块 math.js
function sum(a, b) {
  return a + b;
}
const PI = 3.14159;
module.exports = { sum, PI };

// 导入模块 main.js
const { sum, PI } = require("./math.js");
console.log(sum(1, 2)); // 输出: 3
console.log(PI); // 输出: 3.14159
```

##### ES 模块（ESM）

**定义：**

&emsp;ES 模块是 ECMAScript 6 (ES6) 引入的标准模块系统，使用 import 和 export 语法。在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

&emsp;ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

**代码结构：**

```js
// 导出模块 math.js
export function sum(a, b) {
  return a + b;
}
export const PI = 3.14159;

// 导入模块main.js
import { sum, PI } from "./math.js";
console.log(sum(1, 2)); // 输出: 3
console.log(PI); // 输出: 3.14159
```

模块化的前世今生可参考这片文章[传送门](https://zhuanlan.zhihu.com/p/561694739)或网上搜索更多信息了解，这里我们稍作了解是为了打包构建做基础。

### npm、yarn、pnpm

&emsp;npm、yarn 和 pnpm 都是 JavaScript 生态系统中常用的包管理工具，它们用于管理项目依赖、运行脚本和发布包。

##### npm

npm（Node Package Manager）是 Node.js 的默认包管理工具，随 Node.js 一起安装，也是世界上最大的软件注册中心。

**命令**

- `npm config list -l` 列出所有 npm 的默认配置，包括 registry

- `npm config get registry` 获取当前配置的 registry

- `npm config set registry https://地址` 设置 npm 源，这是永久的

- `npm install pkg --registry=https://xxxx地址` 安装包的时候临时指定某个源，一般是安装自己公司的内部包的时候用，或者项目里面通过`.npmrc`来配置源

- `npm login` 登录

- `npm publish` 发布项目

一些常用的基础命令就不一一列举了，毕竟天天使用，主要跟发布相关，这里是[npm CLI 传送门](https://docs.npmjs.com/cli/v10/commands/npm)


**配置文件**

1、`package.json`

定义：`package.json` 是 Node.js 项目和 npm 包的配置文件，它包含了项目的基本信息、依赖关系、脚本命令等重要信息。

相关字段：

- `name` 包的名称，必须是小写字母，可以包含连字符和下划线，我们工具包名称为 lb-utils 。

- `version` 项目版本号，遵循 SemVer（语义化版本）规范。

- `main` 用于指定CommonJS模块的入口

- `module` 用于指定包的ES模块入口（Node 却并未采纳，打包工具却普遍支持了该字段）

- `browser` 用于指定浏览器使用的入口文件，例如umd模块

- `exports` 在Node.js 12+中被支持作为"main"的替代方案（在"exports"中定义的所有路径必须是以./开头的相对文件URL）

- `files` 指定哪些文件被推到npm服务器

还有一些其它配置字段我们会在后面用到的时候陆陆续续讲解。

注意：通常browser > module > main,  具体用法可参考这篇[文章](https://juejin.cn/post/6844903862977953806)

`package.json` 配置完全解读可进入[传送门](https://juejin.cn/post/7145001740696289317)，官方文档进入[package.json传送门](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)


图


2、`.npmrc`

定义：指定npm运行时的配置内容

优先级： 项目内 > 用户 > 全局 > 内置配置

具体配置内容可以查看官方文档，进入[.npmrc传送门](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)

**nrm**

NPM 源管理工具，快速切换不同的源，[传送门](https://github.com/Pana/nrm)

常用命令：

- `npm install -g nrm` 使用npm全局安装nrm工具

- `nrm ls` 列出可选的源，如果有使用的前面则会带`*`号，会覆盖npm的设置

- `nrm add 名字 http://地址` 添加一个源

- `nrm use xxx` 使用xxx源，`nrm use cnpm`表示使用cnpm源

##### yarn

yarn（Yet Another Resource Negotiator）是由 Facebook 开发的包管理工具，旨在解决 npm 早期版本的一些性能和安全问题。

图

这里我就不做过多赘述，因为孔子不用，墨子不用，老子也不爱用这个玩意儿，想要了解更多进入[传送门](https://yarnpkg.com/getting-started/usage)

##### pnpm

pnpm（Performant npm）是一个快速、节省磁盘空间的包管理工具，它通过硬链接和符号链接来管理依赖，从而减少重复的包安装。

pnpm vs npm

图

**强烈推荐**

就是 pnpm 是默认支持 monorepo 多项目管理的，在日渐复杂的前端多项目开发中尤其适用，也就说我们不再需要 lerna 来管理多包项目，pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持， 你可以创建一个 workspace 以将多个项目合并到一个仓库中。

了解更多请进入[传送门](https://www.pnpm.cn)

##### npm/yarn/pnpm对比

图

### 构建工具

&emsp;构建工具是指用于自动化构建前端代码的工具，其主要功能包括编译、压缩、合并、转码等。

&emsp;说到构建工具，我记得刚步入社会那会，有个外包项目到甲方公司驻场，第一次使用vue遇到一些问题，需要修改一些webpack配置才行，我一头雾水，然后请教甲方公司的人，那个大佬（真大佬还加了微信，后来好像去北大读博，目前好像在某个政府机构工作）给我说打包工具一定要了解，后面就学着开始从零配置webpack构建一个应用，再到后来了解到越来越多打包工具gulp，rollup等等，再到现在比较流行的vite等。

&emsp;最近看到某博主写的前端构建工具大盘点文章，看到这么多构建我真有点绷不住了，进入[传送门](https://mp.weixin.qq.com/s/AquQMMvgW2quw_rzlYRHRg)

图

除了上图所列，还有许多其它工具，每个都说自己性能多好多牛逼，但是五星上将麦克阿瑟说过，构建js库他只推荐rollup。所以我们也使用 `rollup` 来构建我们的工具库：

```js
// rollup.config.js
export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/bundle.esm.js',
			format: 'es'
		},
		{
			file: 'dist/bundle.umd.js',
			format: 'umd',
			name: 'LBUtils'
		}
	]
}
```

`rollup` 使用指南请进入[传送门](https://rollupjs.org/tutorial/)

### 编译

&emsp;理想的情况下是我们美滋滋的写ES6+的代码，使用者能够在各种环境下运行，但是理想很丰满，现实很骨感，当使用者越来越多可能出现的问题就越多，这时就需要编译我们的代码 使其能兼容不同浏览器或环境。

##### Bable 是什么

Babel 是一个 JavaScript 编译器，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

##### Babel 能为你做的事情

- 语法转换

- 源码转换

- 通过 Polyfill 方式在目标环境中添加缺失的功能

##### 为什么需要

- 提高浏览器兼容性

- 享受新的语法特性

- 提高开发效率

- 扩展生态系统

##### 如何使用

这里我们可以查看[官方文档](https://www.babeljs.cn/setup#installation)，主要是安装 Bable 相关插件和增加一些配置文件，分三步配置：

安装相关依赖 > 构建工具配置 > 创建bable配置文件开启预设
```
npm install --save-dev @rollup/plugin-babel @babel/core @babel/preset-env
```
```js
// rollup.config.js
import babel from '@rollup/plugin-babel';

export default {
	plugins: [
		babel({ babelHelpers: 'bundled' })
	]
}
```
```js
// bable.config.json 需要配置这个文件开启预设，否则上面配置还不能生效
{
  "presets": ["@babel/preset-env"]
}
```

rollup配置Babel查看这里[传送门](https://rollupjs.org/tools/#babel)，其它构建工具中如何使用可参考这里[传送门](https://www.babeljs.cn/setup#installation)

## 测试

## 开源

## 维护

## 更好的设计

## 参考

- https://segmentfault.com/a/1190000016610626

- https://zhuanlan.zhihu.com/p/561694739

- https://es6.ruanyifeng.com/#docs/module

- https://docs.npmjs.com/about-npm

- https://nodejs.org/api/packages.html

- https://www.js-bridge.com/post/79e90464-0131-499c-86d8-32cf56344aa3

- https://yarnpkg.com/getting-started/usage

- https://mp.weixin.qq.com/s/AquQMMvgW2quw_rzlYRHRg

- https://www.babeljs.cn/docs/

- https://juejin.cn/post/7233765235555188791

