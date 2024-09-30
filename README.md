## 前言

&emsp;最近拜读了颜海镜老师的新书《现代 JavaScript 库开发：原理、技术与实战》，书是 23 年刚出的时候买的，当时好多技术博主的公众号和博客在推这本书然后有送书活动，我没有抽中只能花大几十元子去网上购买了，买回来后大致翻阅了一下，第一感觉是书中有些技术还是比较老旧了，心想又是一次智商税（大几十元子还是十分心痛的如果颜老师看到的能给我报销吗？）为什么又会再次看呢，一个是之前失业了需要恶补一下知识体系，然后是面试的时候有个面试官和 HR 问我最近有没有看过什么书，刚好回答这本书，显得我很专业很爱学习（实则买来吃灰），再个是今年入职的公司所在的部门是一个以基建为主的部门，所以再次拜读了这本书。

&emsp;我相信对于绝大部分有一定工具经验的小伙伴来说，都有个开发 Javascript 库的经验，但是我在网上搜索了一下，却是鲜有完整的或成体系的文章输出，虽然书中某些工具版本比较老了，但是重要的是大佬像我们输出了如何开发一个 Javascript 库的思想。书中作者表示：“每一个开发者都拥有两个世界：一个是业务世界，另一个是开源世界。” 通过读后感受，结合平常接触的知识，做一个读书分享，也带大家一起学习如何进入开源的世界。

> 纸上得来终觉浅，绝知此事要躬行。

## 一、编写代码

### 一体化开发

&emsp;在很久很久以前，如果我们需要开发一个 JavaScript 工具库，可能没有任何构建打包工具，也没有模块化的概念，我们是如何写代码的呢？

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

如果要使用在 HTML 文件通过 script 引入即可

```html
<script src="./a.js"></script>
<script src="./b.js"></script>
```

这种编码方式有几个问题，第一是各个 js 文件可能需要按顺序引入，第二是可能方法名会产生冲突覆盖。而且其他人要使用只能拷贝下来才能用。

### 模块化开发

&emsp;为了解决一体化开发带来的问题，就相继出现了各种模块化的开发方式，比如在 ES 模块 出现前，比较流行的 UMD， 全称为 Universal Module Definition，即统一模块定义。那么我们的 JavaScript 工具代码就变成下面这样：

```js
;(function (global, factory) {
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
})(this, function () {
    // 判断是否是json
    const isJson = value => {
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

## 二、打包构建

&emsp;前面我们美滋滋把代码写完了，虽然可以在很多场景下用了，但是可能还会存在一些问题，第一位同学直接在 Vue 或者 React 工程通过 ES Module 导入发现也用不了。第二位同学好不容易在项目里可以用了，发现换个浏览器就报错了，发现箭头函数不能用，这还用个勾八的库，不如粘贴复制来的快。第三位同学想要开发一个自己的库，还需要把 UMD 格式代码完整复制过来，但他只想安静的写工具方法，第四位同学发现，我只想引入其中某个方法，但是你却只能把所有方法都导入进来，而第五六七位同学可能还有其它问题。

&emsp;上述问题都是由于构建方式导致的，工具库是为了能给其他人用的，你就必须解决上面出现的这些问题，甚至更多的问题，因为身为库的开发者，这样的 `issue` 是我们必须要解决的，所以我们需要工具构建我们的库，要解决上述问题就要了解 **模块化、NPM、打包工具、编译**等一些相关内容。

### 模块化

##### 模块化定义

&emsp;模块化是一种编程范式，旨在通过将代码分割成独立、可重用的模块来提高代码的可维护性和可扩展性。在 JavaScript 中，模块化可以通过多种方式实现，包括 CommonJS、AMD（Asynchronous Module Definition）、UMD（Universal Module Definition）和 ES 模块（ESM）。

##### 模块化好处

-   **可维护性：** 模块化使得软件更容易维护和更新，因为每个模块都是独立的，可以单独修改和测试。

-   **可重用性：** 模块化允许开发者在不同的项目中重用已有的模块，减少重复工作。

-   **可扩展性：** 随着系统需求的增长，可以添加新的模块来扩展系统的功能，而不影响现有模块。

总之通过模块化，你可以更有效地组织和管理代码，提高开发效率和代码质量。

##### 模块化规范

-   **IIFE：** 立即调用函数表达式

-   **AMD：** 异步模块加载机制

-   **CMD：** 通用模块定义

-   **UMD：** 统一模块定义

-   **CommonJS：** Node.js 采用该规范

-   **ES 模块：** JavaScript 内置模块系统

下面我们主要说一下`UMD`、`CommonJS`、`ES模块`，为什么只讨论这三个，毕竟 AMD、CMD 大概率已经是过去式了，估计好多人虽然听过但是几乎没有使用过，所以不需要大篇幅展开。

##### UMD

**定义：** UMD 全程为 Universal Module Definition，即统一模块定义。旨在同时支持 CommonJS 和 AMD 环境，也支持全局变量。

**代码结构：**

```js
;(function (global, factory) {
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
})(this, function () {
    // 这里写逻辑代码
})
```

##### CommonJS

**定义：** CommonJS 是 Node.js 早期采用的模块系统，使用 require 和 module.exports 语法。

注意：Node.js 目前不仅支持使用 CommonJS 来实现模块，还支持最新的 ES 模块。

**代码结构：**

```js
// 导出模块 math.js
function sum(a, b) {
    return a + b
}
const PI = 3.14159
module.exports = { sum, PI }

// 导入模块 main.js
const { sum, PI } = require('./math.js')
console.log(sum(1, 2)) // 输出: 3
console.log(PI) // 输出: 3.14159
```

##### ES 模块（ESM）

**定义：**

&emsp;ES 模块是 ECMAScript 6 (ES6) 引入的标准模块系统，使用 import 和 export 语法。在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

&emsp;ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

**代码结构：**

```js
// 导出模块 math.js
export function sum(a, b) {
    return a + b
}
export const PI = 3.14159

// 导入模块main.js
import { sum, PI } from './math.js'
console.log(sum(1, 2)) // 输出: 3
console.log(PI) // 输出: 3.14159
```

模块化的前世今生可参考这片文章[传送门](https://zhuanlan.zhihu.com/p/561694739)或网上搜索更多信息了解，这里我们稍作了解是为了打包构建做基础。

### npm、yarn、pnpm

&emsp;npm、yarn 和 pnpm 都是 JavaScript 生态系统中常用的包管理工具，它们用于管理项目依赖、运行脚本和发布包。

#### npm

npm（Node Package Manager）是 Node.js 的默认包管理工具，随 Node.js 一起安装，也是世界上最大的软件注册中心。

**命令**

-   `npm config list -l` 列出所有 npm 的默认配置，包括 registry

-   `npm config get registry` 获取当前配置的 registry

-   `npm config set registry https://地址` 设置 npm 源，这是永久的

-   `npm install pkg --registry=https://xxxx地址` 安装包的时候临时指定某个源，一般是安装自己公司的内部包的时候用，或者项目里面通过`.npmrc`来配置源

-   `npm login` 登录

-   `npm publish` 发布项目

一些常用的基础命令就不一一列举了，毕竟天天使用，主要跟发布相关，这里是[npm CLI 传送门](https://docs.npmjs.com/cli/v10/commands/npm)

**配置文件**

1、`package.json`

定义：`package.json` 是 Node.js 项目和 npm 包的配置文件，它包含了项目的基本信息、依赖关系、脚本命令等重要信息。

相关字段：

-   `name` 包的名称，必须是小写字母，可以包含连字符和下划线，我们工具包名称为 lb-utils 。

-   `version` 项目版本号，遵循 SemVer（语义化版本）规范。

-   `main` 用于指定 CommonJS 模块的入口

-   `module` 用于指定包的 ES 模块入口（Node 却并未采纳，打包工具却普遍支持了该字段）

-   `browser` 用于指定浏览器使用的入口文件，例如 umd 模块

-   `exports` 在 Node.js 12+中被支持作为"main"的替代方案（在"exports"中定义的所有路径必须是以./开头的相对文件 URL）

-   `files` 指定哪些文件被推到 npm 服务器

还有一些其它配置字段我们会在后面用到的时候陆陆续续讲解。

注意：通常 browser > module > main, 具体用法可参考这篇[文章](https://juejin.cn/post/6844903862977953806)

`package.json` 配置完全解读可进入[传送门](https://juejin.cn/post/7145001740696289317)，官方文档进入[package.json 传送门](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

图

2、`.npmrc`

定义：指定 npm 运行时的配置内容

优先级： 项目内 > 用户 > 全局 > 内置配置

具体配置内容可以查看官方文档，进入[.npmrc 传送门](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)

**nrm**

NPM 源管理工具，快速切换不同的源，[传送门](https://github.com/Pana/nrm)

常用命令：

-   `npm install -g nrm` 使用 npm 全局安装 nrm 工具

-   `nrm ls` 列出可选的源，如果有使用的前面则会带`*`号，会覆盖 npm 的设置

-   `nrm add 名字 http://地址` 添加一个源

-   `nrm use xxx` 使用 xxx 源，`nrm use cnpm`表示使用 cnpm 源

##### yarn

yarn（Yet Another Resource Negotiator）是由 Facebook 开发的包管理工具，旨在解决 npm 早期版本的一些性能和安全问题。

图![alt text](<yarn_vs_npm .png>)

这里我就不做过多赘述，因为孔子不用，墨子不用，老子也不爱用这个玩意儿，想要了解更多进入[传送门](https://yarnpkg.com/getting-started/usage)

##### pnpm

pnpm（Performant npm）是一个快速、节省磁盘空间的包管理工具，它通过硬链接和符号链接来管理依赖，从而减少重复的包安装。

pnpm vs npm

图

**强烈推荐**

就是 pnpm 是默认支持 monorepo 多项目管理的，在日渐复杂的前端多项目开发中尤其适用，也就说我们不再需要 lerna 来管理多包项目，pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持， 你可以创建一个 workspace 以将多个项目合并到一个仓库中。

了解更多请进入[传送门](https://www.pnpm.cn)

##### npm/yarn/pnpm 对比

图

### 构建工具

&emsp;构建工具是指用于自动化构建前端代码的工具，其主要功能包括编译、压缩、合并、转码等。

&emsp;说到构建工具，我记得刚步入社会那会，有个外包项目到甲方公司驻场，第一次使用 vue 遇到一些问题，需要修改一些 webpack 配置才行，我一头雾水，然后请教甲方公司的人，那个大佬（真大佬还加了微信，后来好像去北大读博，目前好像在某个政府机构工作）给我说打包工具一定要了解，后面就学着开始从零配置 webpack 构建一个应用，再到后来了解到越来越多打包工具 gulp，rollup 等等，再到现在比较流行的 vite 等。

&emsp;最近看到某博主写的前端构建工具大盘点文章，看到这么多构建我真有点绷不住了，进入[传送门](https://mp.weixin.qq.com/s/AquQMMvgW2quw_rzlYRHRg)

图

除了上图所列，还有许多其它工具，每个都说自己性能多好多牛逼，但是五星上将麦克阿瑟说过，构建 js 库他只推荐 rollup。所以我们也使用 `rollup` 来构建我们的工具库：

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

&emsp;理想的情况下是我们美滋滋的写 ES6+的代码，使用者能够在各种环境下运行，但是理想很丰满，现实很骨感，当使用者越来越多可能出现的问题就越多，这时就需要编译我们的代码 使其能兼容不同浏览器或环境。

##### Bable 是什么

Babel 是一个 JavaScript 编译器，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

##### Babel 能为你做的事情

-   语法转换

-   源码转换

-   通过 Polyfill 方式在目标环境中添加缺失的功能

##### 为什么需要

-   提高浏览器兼容性

-   享受新的语法特性

-   提高开发效率

-   扩展生态系统

##### 如何使用

这里我们可以查看[官方文档](https://www.babeljs.cn/setup#installation)，主要是安装 Bable 相关插件和增加一些配置文件，分三步配置：

安装相关依赖 > 构建工具配置 > 创建 bable 配置文件开启预设

```
npm install --save-dev @rollup/plugin-babel @babel/core @babel/preset-env
```

```js
// rollup.config.js
import babel from '@rollup/plugin-babel'

export default {
    plugins: [babel({ babelHelpers: 'bundled' })]
}
```

```js
// bable.config.json 需要配置这个文件开启预设，否则上面配置还不能生效
{
  "presets": ["@babel/preset-env"]
}
```

rollup 配置 Babel 查看这里[传送门](https://rollupjs.org/tools/#babel)，其它构建工具中如何使用可参考这里[传送门](https://www.babeljs.cn/setup#installation)

## 三、测试

&emsp;为什么需要测试？你说为什么，假如一个 js 库或者组件没有测试过你敢用吗？你平时写业务需求不测试敢上线吗？五星上将麦克阿瑟曾说过，没有单元测试的库都是耍流氓。业务代码由于一次性和时间成本可以不做单元测试，但开源库由于需要反复迭代，对质量要求又极高，所以单元测试是必不可少的。

-   确保代码质量和可靠性

-   提高代码可维护性

-   快速定位问题

### 测试分类

-   单元测试

-   组件测试

-   端到端（E2E）测试

### 测试场景

-   开发纯函数库，建议写更多的单元测试 + 少量的集成测试

-   开发组件库，建议写更多的单元测试、为每个组件编写快照测试、写少量的集成测试 + 端到端测试

-   开发业务系统，建议写更多的集成测试、为工具类库、算法写单元测试、写少量的端到端测试

-   开发公共平台项目，建议写更多的集成测试和完整的端到端测试

### 测试框架

&emsp;测试框架很多，一些流行的前端自动化测试框架包括 Jest、Mocha、Chai、Protractor 和 Cypress 等，我们可以根据不同的场景选择不同的框架，这里我们是一个纯 js 函数库，我们可以选择最流行的 jest，也可以选择比较新的 vitest 等，而 Vitest 完全的集成了老牌 jest 的功能，具体对比可以看传送门：[Vitest 与 X 有何不同](https://cn.vitest.dev/guide/comparisons.html)

具体如何使用参考官方的网站，下面是我们需要编写的测试用例代码：

图片测试-1

图中覆盖率表格说明：

-   行覆盖率（Lines）：显示代码中有多少行被执行了
-   函数覆盖率（Functions）：显示代码中有多少函数被调用了
-   分支覆盖率（Branches）：显示代码中有多少条件分支被执行了
-   语句覆盖率（Statements）：显示代码中有多少语句被执行了
-   未覆盖的行号（uncovered line）：显示代码中哪几行未覆盖执行

### 设计测试用例

&emsp;用什么测试框架并不重要，重要的是如何编写测试用例，上面我们虽然写了 index.js 文件中 isJson 行数的单元测试，但是通过覆盖率报告发现还是有一些代码没有测试到，所以如何设计测试用例就变得很关键，那么我们改如何去设计呢？书中大佬给出了一种方案，那就是根据参数去设计，包括**正确的测试用例**、**错误的测试用例**、**边界值测试用例**，这里我们只有一个参数，所以我们测试用例需要覆盖三种情况。

下面是改造后的测试用例代码：

图测试-2

从上图测试覆盖率报告可以看到，基本上所有代码执行都覆盖到了。

&emsp;关于如何设计测试用例是一门学问，这里举例的场景比较单一，集成化测试、端到端的测试用例设计将更加复杂，大家可以去看看一些开源库是如何编写的，比如 React、Vue 等这些著名的框架测试用例设计想是十分值得我们去学习的。

## 四、开源

&emsp;当我们代码写完，测试也通过了，那么我们就可以把我们的代码开源给其他人使用了。如何给别人用，那当然是发布了，也就是开源。通常包括两部分：

-   把源码推到全球最大同性交友网站 `GitHub`，让其它开发者可以查阅和参与

-   把构建后的代码发布到 `npm`，让其他人可以下载使用

&emsp;我们平常在 Github 上访问一些比较流行的库时可能有些细心的人会发现源码中有许多跟代码不直接相关的文档，比如`LICENSE`、`CONTRIBUTING.md`、`CHANGELOG.md`、`SECURITY.md`、`README.md`等，不管是开源还是使用，如果不注意的话很可能就对带来意外的问题，严重甚至破财，下面我们就说一说开源大概需要注意哪些事项。

### 协议

&emsp;最近开源社区发生了一件知名开源作者删库跑路事件，一位知名的开源项目作者突然在 GitHub 上删除了其开发的下载工具 Aria 的所有源码，这位作者选择删除代码的原因，却让人感到痛心：他表示由于项目被不法分子利用，不得不采取这一极端措施。所以规范好开源协议还是十分重要的，如果一个不小心进去了都不知道什么情况。

&emsp;开源协议（Open Source License）是用于定义开源软件的使用、修改和分发的法律条款。不同的开源协议有不同的要求和限制，选择合适的开源协议对于项目的成功和社区的发展至关重要。作为一个开发者，如果你打算开源自己的代码，千万不要忘记，选择一种开源许可证（license）。

&emsp;当我们每次通过 `npm init` 命令初始化一个工程的 package.json 文件时，会有 `license` 配置项让我们配置，默认是 ISC，如果你仔细看了一些开源的代码，会发现都会有不同的值，大多数比如 vue、react、eslint 仓库中 package.json 文件 license 配置的值就是 `MIT`协议，而 weex、typescript 选择的是 `Apache-2.0`协议。

&emsp;什么是开源许可证？可以参考阮一峰大神的文章，传送门[开源许可证教程](http://www.ruanyifeng.com/blog/2017/10/open-source-license-tutorial.html)，目前世界上的开源许可证，大概有上百种，例如 GPL、BSD、MIT、Mozilla、Apache 和 LGPL 等，那么我们要如何为代码选择开源许可证，这是一个问题？不过问题不大，有大佬帮我们总结出来了，如图：

![free_software_licenses.png](https://upload-images.jianshu.io/upload_images/23495033-24c151b45a33afbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![wKgaomRWILaAX-pCAABiqRiTBu4065.jpg](https://upload-images.jianshu.io/upload_images/23495033-60d3e01ffaa6aa65.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们开源一个 js 工具库该如何选择呢，遇事不决选 MIT ，那么 package.json 中填写了协议配置就行了吗？非也非也，你只有协议，但是没有协议内容不就是一个空口承诺，所以我们需要在我们的仓库中添加一个名为`LICENSE`的文件，这个文件中就是我们协议的具体说明内容。

```
The MIT License (MIT)

Copyright (c) 2024-present XXX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

类似与上面这种格式，还可以添加多个，但是我有问题疑问，如果用中文行吗？

### 文档

&emsp;除了协议外，一个标准的库还应该包括各种各样的文档。

-   README
-   待办清代
-   变更日志
-   贡献者列表
-   贡献者盟约行为守则
-   package.json

&emsp;`README.md`是最常见的，也是一个库最先看到的文档内容，一定程度直接影响库的使用者的选择，一个合格的 README 通常包括库的介绍、使用指南、贡献者指南、协议说明等，如果库功能不多可能 API 文档也会直接写在 README 文件中，当然除了这些还可以包含一些其它与库相关的说明，现在库还会在文档增加一些[Tag 徽章](https://shields.io/badges/static-badge)，由于各库的功能不一致目前 README 也没有统一的标准。

![NPM Version](https://img.shields.io/npm/v/vue) ![NPM Downloads](https://img.shields.io/npm/dm/vue)

![build status](https://github.com/vuejs/core/actions/workflows/ci.yml/badge.svg?branch=main)

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

&emsp;`TODO.md`文件不是很常见，其作用主要是列出已经完成的功能和会在未来添加的新功能，通常也会直接写在 README 文件中。

```
# todo.md文件
- [X] 完成了是否是json判断函数（isJson）
- [ ] 支持深度拷贝
- [ ] 支持UUID生成
```

&emsp;`CHANGELOG.md`用来记录每次发版的变更内容，一是可以让开发者记录变更备忘，二是让使用者了解每个版本的特性和功能，避免风险。变更日志一般会记录版本号、变更时间、变更内容。

```
# changelog.md文件

## 0.0.2

2024-09-20

### Bug Fixes

- 修复isJson方法空参判断bug


## 0.0.1

2024-09-18

### Features

- 新增isJson方法
```

### 发布

&emsp;当我们代码开发完成，测试通过，文档也写好了，那么我们就可以准备把我们的库发布到 GitHub 和 npm 上了。

#### 源码发布到 GitHub

&emsp;注册登录好 GitHub 账号后，然后创建一个仓库，随后使用 Git 把代码推送到仓库，需要注意的是构建后的代码、node_module、测试报告等是不需要推送上去的，我们通过 `.gitignore` 文件过滤掉。

#### 构建后的代码发布到 npm

&emsp;如果别人想要使用我们的库，通过 GitHub 只能手动下载下来，而 npm 是全球最大的包托管平台，将库发布到 npm 后只需要一个命令就可下载下来，所以我们需要把构建好的文件发布到 npm。前面构建部分我们已经简单介绍了 npm 及常用指令，我们发布代码到 npm 同样需要注册登录账号，注册完成后就可以使用命令行登录发布了。

```bash
# 第一步：登录账号，输入账号密码邮箱登信息
npm login

# 第二步：推到托管平台
npm publish --access public
```

&emsp;就这样简单两步就完成了，但是在发布到 npm 前还有一些需要注意的地方，比如 npm 的源地址是公司的还是官方平台，比如确认哪些文件需要发布到 npm，如果一股脑全部推上去会影响包的大小和下载速度，还有 package.json 中的一些信息也需要完善，通过 npm 包可以直接找到源码仓库等。

&emsp;`README.md`、`CHANGELOG.md`、`package.json`文件是默认需要发布的，而`.gitignore`中间列出来的文件是会忽略的，我们可以通过.gitignore 来过滤不需要推送到 npm 包托管平台的文件，但是更常用的做法是通过 package.json 中的 `files`属性来配，而且优先级更高。

```bash
{
	# 发布的文件白名单
  "files": [
    "dist"
  ],
  # 发布的命令行参数
  "publishConfig": {
    "repository": "https://registry.npmjs.org",
    "access": "public"
  },
  # 仓库地址
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xrwben/lb-utils.git"
  },
  # 源码主页地址
  "homepage": "https://github.com/xrwben/lb-utils#readme",
}
```

&emsp;还有一个注意的点就是版本号，npm 是通过版本号来管理不同的版本，每次发布版本也要不同，后面规范部分再详细介绍。

### 统计

&emsp;当我们发布了我们的库后，想要了解库的使用情况、问题、受关注度等，就可以通过 GitHub 和 npm 平台统计出来，比较直观的就是 GitHub 上的 star 数量了，然后 Insights 面板也有更详细的统计等，npm 平台上有下载使用数据等可统计，需要注意的是可能通过其它镜像源下载的统计不出来。

&emsp;如果想要数据准确也可以自定义统计数据，通过 npm 提供的 postinstall 钩子来上报数据，用户安装就会触发钩子上报统计，但没必要。

## 维护

&emsp;到现在为止，我们已经发布了一个可以让别人使用的的 javascript 库，但是开源库发布成功，并不代表就万事大吉了，库的开源并不是一个一劳永逸的事情，它需要我们持续的迭代和维护，因为使用者总会遇到各种各样奇怪的问题和需求，为了不段满足用户可能需要不断迭代，但是个人的精力也是有限的，开源纯粹是热爱和为爱发电，所以一个优秀的开源库必定是大家共同参与建设，所谓无规矩不成方圆，大家遵守一份规范必定事半功倍。

### 规范

#### 编辑器规范

&emsp;我们可以通过 EditorConfig 来规范，EditorConfig 帮助多个开发人员在不同的编辑器和 IDE 中维护一致的编码风格，[EditorConfig 文档传送门](https://editorconfig.org/)，所以我们可以在我们的根目录创建一个`.editorconfig`文件，内如如下：

```bash
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space

[*.{js,json}]
indent_size = 4

[*.{yml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

上述具体配置项不做过多解释，看官方文档和配置名称就大概知道什么意思了。注意的是有些编辑器是默认支持 EditorConfig 比如 WebStorm，有些需要安装插件才支持，比如 VS Code、Sublime Text 等。

#### 代码规范

&emsp;默认情况下，prettier会忽略版本控制系统目录（“.git”、“.sl”、“.svn”和“.hg”）和node_modules中的文件（除非指定了--with-node-modules CLI选项）。Prettier还将遵循“.gitignore”文件中指定的规则，如果它存在于运行它的同一目录中。

```bash
npx prettier --write .

npx prettier --check .
```

npx retty-quick --staged

#### 版本规范

#### Git Commit 规范

&emsp;

![commit.png](https://upload-images.jianshu.io/upload_images/23495033-d4a001968439c752.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 持续集成

### 分支处理

## 更好的设计

更好的函数设计

### 代码健壮性

参数防御
副作用处理
异常捕获

兼容性

TypeScript 编码

安全性

## 参考

-   https://segmentfault.com/a/1190000016610626

-   https://zhuanlan.zhihu.com/p/561694739

-   https://es6.ruanyifeng.com/#docs/module

-   https://docs.npmjs.com/about-npm

-   https://nodejs.org/api/packages.html

-   https://www.js-bridge.com/post/79e90464-0131-499c-86d8-32cf56344aa3

-   https://yarnpkg.com/getting-started/usage

-   https://mp.weixin.qq.com/s/AquQMMvgW2quw_rzlYRHRg

-   https://www.babeljs.cn/docs/

-   https://juejin.cn/post/7233765235555188791

-   https://juejin.cn/post/7303789262989017099

-   https://cn.vuejs.org/guide/scaling-up/testing

-   https://github.com/goldbergyoni/javascript-testing-best-practices/blob/master/readme-zh-CN.md#%E7%AC%AC%E4%B8%89%E7%AB%A0-%E5%89%8D%E7%AB%AF%E6%B5%8B%E8%AF%95

-   http://www.ruanyifeng.com/blog/2017/10/open-source-license-tutorial.html

-   http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html

-   https://www.runoob.com/w3cnote/open-source-license.html?spm=a2c6h.13046898.publish-article.3.223b6ffaMgp7h1

-   https://zhuanlan.zhihu.com/p/697744701

-   https://shields.io/badges/npm-downloads

-   https://editorconfig.org/

-   https://www.prettier.cn/docs/install.html

-   https://typicode.github.io/husky/get-started.html

-   https://github.com/lint-staged/lint-staged

-   https://commitlint.js.org/guides/getting-started.html
