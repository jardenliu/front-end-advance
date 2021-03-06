# 前端监控与上报

## 前言
&#8195;&#8195;对于前端项目来说，一旦上线之后，就像一个黑盒子一样，我们完全不知道用户在我们的项目里边做了什么，跳转到哪里，是不是报错了。一旦生产环境的用户出现问题，而我们又难以复现问题的时候，才能体会到什么叫绝望。由此可见，我们需要对我们的前端产品进行全方位的把控，让它成为一个百盒子。让我们能更好的收集用户的行为趋势、产品的实际体验、异常出没的位置等等。

&#8195;&#8195;前端监控的出现，能极大提高我们解决问题的能力，更有利于优化产品的整体质量与水平，常见的前端监控有以下三种：
- 行为监控
- 性能监控
- 异常监控

## 行为监控
&#8195;&#8195;常见的行为监控有PV（Page View）,UV（Unique visitor）,VV（Visit View）,IP（Internet Protocol）、还有对一些根据实际业务需求相关的行为进行的监控。大多数的行为监控都是通过后端监控以及前端埋点捕获上报。在这里就不深入探讨了。


## 性能监控
&#8195;&#8195;一个页面性能差的话会大大影响用户体验。用户打开页面等待的太久，可能会直接关掉页面，甚至就不再使用了，这种情况在移动端更加明显，移动端用户对页面响应延迟容忍度很低。

&#8195;&#8195;虽然页面性能很重要，但是在实际使用中，页面性能差的情况并不少见。首先，在产品的迭代演进过程中，页面性能可能会被忽略，性能随着版本迭代而有所衰减；其次，性能优化是一项复杂而挑战的事情，需要明确的优化方向和具体的优化手段才能快速落地取效。

&#8195;&#8195;所以我们需要一个性能监控系统，持续监控和预警页面性能的状况，并且在发现瓶颈的时候指导优化工作。

### 阶段1：打点时代
大概的做法就是：手动打点，分别在页头和首屏dom节点处new Date()打点，计算差值，作为首屏时间，再加上setTimeout(new Date(), 0)标记首屏可交互时间

### 阶段2：Navigation Timing API
&#8195;&#8195;为了帮助开发者更好地衡量和改进前端页面性能，W3C性能小组引入了 Navigation Timing API ，实现了自动、精准的页面性能打点；开发者可以通过 window.performance 属性获取。
- `performance.timing` 接口（定义了从 `navigationStart` 至 `loadEventEnd` 的 21 个只读属性）
- `performance.navigation`（定义了当前文档的导航信息，比如是重载还是向前向后等
  
&#8195;&#8195;下图是W3C第一版的 Navigation Timing 的处理模型。从当前浏览器窗口卸载旧页面开始，到新页面加载完成，整个过程一共被切分为 9 个小块：提示卸载旧文档、重定向/卸载、应用缓存、DNS 解析、TCP 握手、HTTP 请求处理、HTTP 响应处理、DOM 处理、文档装载完成。每个小块的首尾、中间做事件分界，取 Unix 时间戳，两两事件之间计算时间差，从而获取中间过程的耗时（精确到毫秒级别）。

![图1](https://raw.githubusercontent.com/jardenliu/front-end-advance/master/monitor/image/performance1.jpg)

下图是精度更高，功能更强大，层次更分明的 Level 2模型，独立划分出来的 Resource Timing，使得我们可以获取具体资源的详细耗时信息

![图2](https://raw.githubusercontent.com/jardenliu/front-end-advance/master/monitor/image/performance2.png)

#### 指标解读
| 指标                       | 描述                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| navigationStart            | 准备加载页面的起始时间                                                       |
| unloadEventStart           | 如果前一个文档和当前文档同源,返回前一个文档开始unload的时间                  |
| unloadEventEnd             | 如果前一个文档和当前文档同源,返回前一个文档开始unload结束的时间              |
| redirectStart              | 如果有重定向,这里是重定向开始的时间.                                         |
| redirectEnd                | 如果有重定向,这里是重定向结束的时间.                                         |
| fetchStart                 | 开始检查缓存或开始获取资源的时间                                             |
| domainLookUpStart          | 准备加载页面的起始时间                                                       |
| domainLookUpEnd            | DNS查询开始时间                                                              |
| connectStart               | Http(TCP)开始/重新建立连接的时间，如果是持久连接，与fetchStart相同           |
| connectEnd                 | Http(TCP)开始/重新建立连接的时间，完成握手，如果是持久连接，与fetchStart相同 |
| secureConnectionStart      | 如果是https请求.返回ssl握手的时间                                            |
| requestStart               | 开始请求文档时间(包括从服务器,本地缓存请求)                                  |
| responseStart              | 接收到第一个字节的时间                                                       |
| responseEnd                | 接收到最后一个字节的时间.                                                    |
| domLoading                 | ‘document readyState’ 设置为 loading的时间                                   |
| domInteractive             | 文档解析结束的时间                                                           |
| domContentLoadedEventStart | DOMContentLoaded事件开始的时间                                               |
| domContentLoadedEventEnd   | DOMContentLoaded事件结束的时间                                               |
| domComplete                | ‘document readyState’ 设置为 complete 的时间                                 |
| loadEventStart             | 触发onload事件的时间                                                         |
| loadEventEnd               | onload事件结束的时间                                                         |
| domLoading                 | 准备加载页面的起始时间                                                       |

#### 采集页面性能的关键指标
&#8195;&#8195;使用上面的指标，我们可以计算许多重要的指标，如首字节的时间，页面加载时间，dns查找以及连接是否安全。我们把 Navigation Timing API 提供的指标做下归类，按照从上到下的时间流，右边的时刻标记了每个指标从哪里开始计算到哪里截止，比如，跳转时间 redirect 由 redirectEnd - redirectStart 计算得到，其他的类推。

![图3](https://raw.githubusercontent.com/jardenliu/front-end-advance/master/monitor/image/performance3.bmp)

```javasscript
let times = {};
let t = window.performance.timing;

//重定向时间
times.redirectTime = t.redirectEnd - t.redirectStart;
console.log('重定向时间:', times.redirectTime)

//dns查询耗时
times.dnsTime = t.domainLookupEnd - t.domainLookupStart;

//TTFB 读取页面第一个字节的时间
times.ttfbTime = t.responseStart - t.navigationStart;

//DNS 缓存时间
times.appcacheTime = t.domainLookupStart - t.fetchStart;

//卸载页面的时间
times.unloadTime = t.unloadEventEnd - t.unloadEventStart;

//tcp连接耗时
times.tcpTime = t.connectEnd - t.connectStart;

//request请求耗时
times.reqTime = t.responseEnd - t.responseStart;

//解析dom树耗时
times.analysisTime = t.domComplete - t.domInteractive;

//白屏时间 
times.blankTime = (t.domInteractive || t.domLoading) - t.fetchStart;

//首屏时间
times.domReadyTime = t.domContentLoadedEventEnd - t.fetchStart;

```

### 阶段三：SPA时代
&#8195;&#8195;Navigation Timing API可以监控大部分前端页面的性能。但随着SPA模式的盛行，类似vue，reactjs等框架的普及，页面内容渲染的时机被改变了,W3C标准无法完全满足原来的监控意义。

&#8195;&#8195;目前W3C关于首屏统计已经进入了提议阶段，以Chrome为首的浏览器正在打造更能代表用户使用体验的FP()、FCP、FMP指标，并且逐步开放API。

- FP（First Paint）：首次绘制，标记浏览器渲染任何在视觉上不同于导航前屏幕内容的时间点, 仅有一个 div 根节点。
- FCP（First Contentful Paint）：首次内容绘制，标记的是浏览器渲染第一针内容 DOM 的时间点，该内容可能是文本、图像、SVG 或者 \<canvas\> 等元素, 包含页面的基本框架，但没有数据内容。
- FMP（First Meaning Paint）: 首次有效绘制，标记主角元素渲染完成的时间点，主角元素可以是视频网站的视频控件，内容网站的页面框架也可以是资源网站的头图等。

常见的进行`相对准确`的计算 FMP，所谓相对准确，是相对于实际项目而言。

1. 主动上报：开发者在相应页面的「Meaning」位置上报时间
2. 权重计算：根据页面元素，计算权重最高的元素渲染时间(计算指标以实际项目为准，常见的有`占位大小`，`可见性`等)
3. 趋势计算：在 render 期间，根据 dom 的变化趋势推算 FMP 值

## 异常监控
&#8195;&#8195;前端错误是第一指标，任何一个js错误都有可能导致阻塞，影响我们页面的正常运转。任何一个js异常的发生都会导致当前代码块不能正常执行。

&#8195;&#8195;异常抛出的内容，是我们定位问题的关键。接下来我们介绍一下，常见的几种收集错误的方式.

### 全局捕获
&#8195;&#8195;可以通过全局监听异常来捕获，通过window.onerror或者addEventListener，看以下例子：
```javascript
/**
 * @param  errorMessage 异常信息
 * @param  scriptURI 异常脚本文件路径
 * @param  lineNo 异常行号
 * @param  columnNo 异常列号
 * @param  error 异常堆栈信息
 */
window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
  console.log('errorMessage: ' + errorMessage); 
  console.log('scriptURI: ' + scriptURI); 
  console.log('lineNo: ' + lineNo);
  console.log('columnNo: ' + columnNo); 
  console.log('error: ' + error); 

};

window.addEventListener('error', (errorMessage) => {
    console.log("errorMessage", errorMessage);
})

throw new Error('这是一个错误');
```

### try...catch...
&#8195;&#8195;使用`try... catch`虽然能够较好地进行异常捕获，不至于使得页面由于一处错误挂掉，但`try ... catch`捕获方式显得过于臃肿，大多代码使用`try ... catch`包裹，影响代码可读性。

### 跨域脚本捕获异常
&#8195;&#8195;通常情况下，我们会把静态资源，如JavaScript脚本放到专门的静态资源服务器，亦或者CDN，看以下例子：
```html

    <script>
             window.onerror = function (errorMessage, scriptURI, lineNo, columnNo, error) {
            console.log('errorMessage: ' + errorMessage);
            console.log('scriptURI: ' + scriptURI);
            console.log('lineNo: ' + lineNo);
            console.log('columnNo: ' + columnNo);
            console.log('error: ' + error);

        };
    </script>
    <script src="http://cdndomain/cross-domain-error.js">
    </script>
</html>
```
结果显示，跨域之后`window.onerror`根本捕获不到正确的异常信息，而是统一返回一个`Script error`

解决方案1：对script标签增加一个`crossorigin=”anonymous”`，并且服务器添加`Access-Control-Allow-Origin`。

解决方案2：通过 Patch 原生方法来尽可能的捕获到错误，这也是很多监控脚本默认提供的能力。比如说我们可以通过如下代码来 Patch 原生的 setTimeout 方法：

```js
const prevSetTimeout = window.setTimeout;

window.setTimeout = function(callback, timeout) {
  const self = this;
  return prevSetTimeout(function() {
    try {
      callback.call(this);
    } catch (e) {
      // 捕获到详细的错误，在这里处理日志上报等了逻辑
      // ...
      throw e;
    }
  }, timeout);
} 


```
同理，我们还可以 Patch 更多的原生方法，比如 Array.prototype.forEach、setInterval、requestAnimationFrame等等。诚然这种方法能帮我们尽可能捕获到更多异常，但是因为 Patch 了 JavaScript 原生的方法，总是感觉会存在很多的不确定性。


### 框架层解决方案（vue）
&#8195;&#8195;使用Vue.config.errorHandler这样的Vue全局配置，可以在Vue指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和Vue 实例。

```js
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
}
```
> 从 2.2.0 起，这个钩子也会捕获组件生命周期钩子里的错误。同样的，当这个钩子是 undefined 时，被捕获的错误会通过 console.error 输出而避免应用崩溃。

> 从 2.4.0 起，这个钩子也会捕获 Vue 自定义事件处理函数内部的错误了。

> 从 2.6.0 起，这个钩子也会捕获 v-on DOM 监听器内部抛出的错误。另外，如果任何被覆盖的钩子或处理函数返回一个 Promise 链 (例如 async 函数)，则来自其 Promise 链的错误也会被处理。

## 信息上报

### 上报形式
&#8195;&#8195;按照上报的频率（重要紧急度）可将上报分为四种：
1. 即时上报:
   收集到日志后，立即触发上报函数。仅用于A类异常。而且由于受到网络不确定因素影响，A类日志上报需要有一个确认机制，只有确认服务端已经成功接收到该上报信息之后，才算完成。否则需要有一个循环机制，确保上报成功。
2. 批量上报:
   将收集到的日志存储在本地，当收集到一定数量之后再打包一次性上报，或者按照一定的频率（时间间隔）打包上传。这相当于把多次合并为一次上报，以降低对服务器的压力。
3. 区块上报:
   将一次异常的场景打包为一个区块后进行上报。它和批量上报不同，批量上报保证了日志的完整性，全面性，但会有无用信息。而区块上报则是针对异常本身的，确保单个异常相关的日志被全部上报。
4. 用户主动提交:
   在界面上提供一个按钮，用户主动反馈bug。这有利于加强与用户的互动。

&#8195;&#8195;错误收集时，常需要存储错误日志，持久化方案可选项也比较多了，主要有：Cookie、localStorage、sessionStorage、IndexedDB、webSQL 、FileSystem 等等。那么该如何选择呢？我们通过一个表来进行对比：


| 存储方式 | cookie    | localStorage | sessionStorage | IndexedDB  | webSQL | FileSystem |
| -------- | --------- | ------------ | -------------- | ---------- | ------ | ---------- |
| 类型     | key-value | key-value    | NoSQL          | SQL        |
| 数据格式 | string    | string       | string         | object     |
| 容量     | 4k        | 5M           | 5M             | 500M       | 60M    |
| 进程     | 同步      | 同步         | 同步           | 异步       | 异步   |
| 检索     |           | key          | key            | key, index | field  |
| 性能     |           | 读快写慢     |                | 读慢写快   |

&#8195;&#8195;综合之后，IndexedDB是最好的选择，它具有容量大、异步的优势，异步的特性保证它不会对界面的渲染产生阻塞。而且IndexedDB是分库的，每个库又分store，还能按照索引进行查询，具有完整的数据库管理思维，比localStorage更适合做结构化数据管理。但是它有一个缺点，就是api非常复杂，不像localStorage那么简单直接。


### 常用的上报方式

1. 使用的img标签
- 请求图片并不涉及到跨域的问题；
```javascript
  var url = 'xxx';
  new Image().src = url;
```
2. Ajax上报日志
```javascript
 window.addEventListener('unload', logData, false);

  function logData() {
      navigator.sendBeacon("/log", analyticsData);
  }
```


3. navigator.sendBeacon
```js
window.addEventListener('unload', logData, false);

function logData() {
    navigator.sendBeacon("/log", analyticsData);
}

```