# should.js

[![Join the chat at https://gitter.im/shouldjs/should.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/shouldjs/should.js)

[![Build Status](https://travis-ci.org/shouldjs/should.js.svg?branch=master)](https://travis-ci.org/shouldjs/should.js)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/shouldjs.svg)](https://saucelabs.com/u/shouldjs)

_should_ 是一个具有表现力、可读性好、与框架无关的断言库。这个库的主要目标是 __表述性__ 和 __有效性__ ，它保持了你的测试代码的整洁和错误信息的有效性。

通常情况下（当你`require('should')`的时候），_should_ 会拓展 `Object.prototype` 一个不可枚举的getter，会允许你去表述一个对象应该如何表现。必要时，可以通过`require 也会返回` _should_ 自己本身

也可以使用不带getter的`should.js`(它甚至不会尝试拓展`Object.prototype`)，只需要 `require('should/as-function')`，或者你已经使用了自动添加getter的版本，你可以调用`.noConflict`函数。

`(某个对象).should` getter的结果和`should(某个对象)`在大多数情况下是相同的。

### 升级说明

请查看 [维基页面](https://github.com/shouldjs/should.js/wiki/Breaking-changes) 来获得升级说明.

### 常见问题FAQ

你可以查看 [FAQ](https://github.com/shouldjs/should.js/wiki/FAQ).

## 示例
```javascript
var should = require('should');

var user = {
    name: 'tj'
  , pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.have.property('name', 'tj');
user.should.have.property('pets').with.lengthOf(4);

// 假设对象是通过Object.create(null)来创建的
// 这时它不会继承`Object.prototype`,所以不会有`.should` getter
// 所以你可以这样做
should(user).have.property('name', 'tj');

// 你也可以用过这种方式测试null
should(null).not.be.ok();

someAsyncTask(foo, function(err, result){
  should.not.exist(err);
  should.exist(result);
  result.bar.should.equal(foo);
});
```
## 使用

 1. 安装:

    ```bash
    $ npm install should --save-dev
    ```

 2. 调用:

    ```js
    var should = require('should');

    (5).should.be.exactly(5).and.be.a.Number();
    ```

    ```js
    var should = require('should/as-function');

    should(10).be.exactly(5).and.be.a.Number();
    ```

## 在浏览器中

当然，就算在被作者抱怨的100%支持es5的浏览器中，也同样会有错误，请查看[wiki 已知问题](https://github.com/shouldjs/should.js/wiki/Known-Bugs)来查看已知bug。

如果在浏览器器中使用 _should_ ，请将`should.js`的文件放在存储库的根目录下，或者自己构建。构建一个新版本

```bash
$ npm install
$ npm run browser
```

将脚本导出到 `window.should`:

```js
should(10).be.exactly(10)
```

你可以很轻松的使用npm和bower安装它:

```sh
npm install should -D
# 或
bower install shouldjs/should.js
```

## API 文档

用 jsdoc comments 生成的实际API文档，可以从[http://shouldjs.github.io](http://shouldjs.github.io)获得.

## 用法案例

请查看[examples](https://github.com/shouldjs/examples)

## .not

`.not` 用于 否定当前的断言.

## .any

`.any` 允许有多个参数的断言来断言任何参数（但不是全部）。这类似于原生js[array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).

# 断言
## 链式断言

每个断言都会返回一个`should.js`包装的对象。所以断言能够被串联起来。

为了方便链式断言能够更清晰的阅读，你可以在链块中使用下面的关键字属性：`.an`, `.of`, `.a`, `.and`, `.be`, `.have`, `.with`, `.is`, `.which`.使用它们提高可读性，它们实质上不起其他任何作用。

举个例子:
```js
user.should.be.an.instanceOf(Object).and.have.property('name', 'tj');
user.pets.should.be.instanceof(Array).and.have.lengthOf(4);
```
几乎所有的断言都返回相同的对象，所以可以很轻松的链接它们。但有些属性(如: `.length` and `.property`) 会移动他的属性值，所以要小心。

## 添加属于自己的断言

添加属于自己的断言很简单，你只需要调用 `should.Assertion.add`这个函数，他接受两个参数:

1. 断言函数的名字（String）
2. 断言的函数（Function）


断言的方法应该做什么，它应该只检查正面的情况。 `should`将会处理`.not` 本身。
`this`在断言函数中将会是`should.Assertion`的一个实例，还有你 **必须** 在断言检测之前，在断言函数中定义任意方式的`this.params`对象。 

`params` 对象能够包含的几个字段：

- `operator` - 描述断言的字符串
- `actual` -  实际值    你可以假设它是你自己的 this.obj, 如果你需要自己定义
- `expected` - 期望值 任意与this.obj匹配的值

你可以假设它用来生成AssertionError的信息，如：期望`obj`？或者 不等于 this.obj？ `断言描述` `期望值`?

You can assume its usage in generating AssertionError message like: expected `obj`? || this.obj not? `operator` `expected`?

在 `should` 消息来源的方法中有两种这样的用法。

第一种：（不推荐）仅仅用在其他断言的快捷方式中，例如怎么定义`.should.be.true()`：

```javascript
Assertion.add('true', function() {
    this.is.exactly(true);
});
```

这里我们可以看出这个断言函数没有定义自己的 `this.params` 还有替代调用内部相同的断言`.exactly`，这会填充`this.params` **你必须非常小心的使用它**

第二种：（推荐）我会预想到你会比较喜欢这种，而不是第一种：

```javascript
Assertion.add('true', function() {
    this.params = { operator: 'to be true', expected: true };

    should(this.obj).be.exactly(true);
});
```

在这个例子中，定义了this.params，使用了一个新的断言内容(调用了 `.should`)。在内部中，这种方式不会和第一种方式一样出现任何的不利的情况。


```javascript
Assertion.add('asset', function() {
    this.params = { operator: 'to be asset' };

    this.obj.should.have.property('id').which.is.a.Number();
    this.obj.should.have.property('path');
})

//然后
> ({ id: '10' }).should.be.an.asset();
AssertionError: expected { id: '10' } to be asset
    expected '10' to be a number

> ({ id: 10 }).should.be.an.asset();
AssertionError: expected { id: 10 } to be asset
    expected { id: 10 } to have property path
```

## 其他项目

* [`should-sinon`](https://github.com/shouldjs/sinon) - 为sinon.js添加额外的断言
* [`should-immutable`](https://github.com/shouldjs/should-immutable) - 扩展should.js的不同部分，使should.js中的immutable.js成为一等成员
* [`should-http`](https://github.com/shouldjs/http) - http响应的断言
* [`should-jq`](https://github.com/shouldjs/jq) - jq断言库
* [`karma-should`](https://github.com/seegno/karma-should) - 让karma工作更轻松
* [`should-spies`](https://github.com/shouldjs/spies) - 小而脏的零依赖 spies


## 贡献

如果你想给你的朋友看[贡献列表](https://github.com/visionmedia/should.js/graphs/contributors)

简单运行就能进行 _should_ 测试:

    $ npm test

另见 [CONTRIBUTING](./CONTRIBUTING.md).

## 我的天，它拓展了对象 (OMG IT EXTENDS OBJECT???!?!@)

对，没错。一个简单的getter _should_, 应该不会搞坏的你的代码，因为他是用的是非枚举的属性。也可以在不拓展的情况下使用它，只是要使用`require('should/as-function')`

## License

MIT. 看 LICENSE 查看详情.
