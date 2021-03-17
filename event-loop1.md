# 事件循环
> 原文地址 https://juejin.cn/post/6844903598573240327

### 术语

#### 调用栈
> Call Stack

调用堆栈，它是一个用于记录函数调用的数据结构，具有先进后出的特性。当我们调用一个函数的时候，就会将其推入堆栈中，当一个函数返回的时候，就会将其推到堆栈的顶部，另外注意同步代码才会按照顺序马上进入Call Stack. "异步代码"后面会讲。

如果堆栈长时间呗占用或者堵塞就会导致我们经常说的blocking script。

看下面这段代码，我们理解Call Stack的执行过程

```js
function foo(b) {
    var a = 5
    return a * b + 10
}    

function bar(x) {
    var y = 3
    return foo(x * y)
}

console.log(bar(6)) // 100
```

![call stack](https://user-gold-cdn.xitu.io/2018/4/26/162ffe54ac3342d1?imageslim)


```txt
// 执行过程如下

1. 首先我们找到即将开始执行的main函数
2. 从console.log(bar(6))开始执行代码，它被推到调用栈的底部
3. 然后 bar()被推到console.log(bar(6))的上面
4. 之后foo()被推到bar()的上面，但是当他执行后立即返回，被推出堆栈
5. 然后是bar()弹出
6. 最后console.log()被弹出，把返回值打印在控制台
```

以下图一个错误堆栈为例会更加明了

![error](https://user-gold-cdn.xitu.io/2018/4/25/162fd239b8c480a0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

有时候我们把一个函数递归调用多次，会进入一个死循环，而对于Chrome浏览器来说，栈的大小是有限制的（16000帧），于是它会抛出一个Max Stack的错误。

![error](https://user-gold-cdn.xitu.io/2018/4/25/162fd364121e55b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 堆
> heap

堆：对象是分配在堆里面，说道堆内存就需要了解栈内存，引用类型，基本类型。

引用类型，值大小不固定。栈内存中存放地址指向堆内存中的对象。是按引用访问的.如下图所示：栈内存存放的只是该对象的访问地址。在堆内存中为这个值分配空间。由于这种值的大小不固定，因此不能把它们保存到栈内存中。但内存地址大小是固定的，因此可以讲内存地址保存在栈内存中。这样当查询引用类型的变量时，先从占中读取内存地址，然后再通过地址找到堆中的值。对于这种，我们可以把它叫做按引用访问。

![heap](https://user-gold-cdn.xitu.io/2018/4/25/162fd3ac9ad0a200?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 队列
> queue

队列: js运行时包含一个消息队列，它是要处理的消息列表（事件）和待执行的回调函数。

quene是一个先进先出的的数据结构，排在前面的时间，优先被主线程读取。主线程的读取过程基本上是自动的。只要执行栈（call stack）一清空.quene 上第一位的事件就自动进入主线程。
但是由于存在“定时器”功能，主线程首先要检查一下执行时间，某些事件只有到了规定的时间，才能进入到事件队列，读取事件，执行事件对应的回调。

基本上来说，这些事件是响应外部异步事件而排队的（例如鼠标被点击或者接收到对HTTP请求的响应，当然如果一个事件没有回调，那个事件是不会进入到quene排队的）。

这里我们觉得重点是理解什么样自的代码才会进入到quene。我个人喜欢称呼“异步代码”。我们知道JS是单线程语言，如果采用同步不支持异步的话，你可以想想加载资源时堆栈会堵塞成什么样子。所以JS支持异步回调，也许有人会问为什么异步代码不可以直接进入call stack，其实想想既然异步代码那么进入到callstack的顺序会随机插入，显然不合理。

```js
// 到时见才会推入队列

console.log(1)

setTimeout(()=>{
    console.log(2)
}, 200)

setTimeout(()=>{
    console.log(3)
}, 0)

console.log(4)

// 1 4 3 2

```

> 浏览器端异步事件：DOM时间 http请求 setTimeout等异步事件



#### 事件循环
> Event Loop

事件循环的基本工作是查看堆栈和任务队列，当队列看到堆栈为空时，当队列中的第一件event推到堆栈。在处理任何其他消息之前，会先处理当前事件的回调。
![event loop](https://user-gold-cdn.xitu.io/2018/4/26/162ffe54ac9f1835?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)