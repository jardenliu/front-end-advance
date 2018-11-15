# 前端单元测试 (Karma+Mocha+Chai) 入门篇

## 单元测试是什么？
> 单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证。对于单元测试中单元的含义，要根据实际情况去判定其具体含义。对前端来说，单元测试时用来对一个模块、一个函数、或者一个类进行正确性检验的测试工作。

## 单元测试的好处
1. 强制解耦
2. 先设计接口，再实现细节
3. 便于回归和功能重构

## TDD & BDD

### TDD
TDD是测试驱动开发（Test-Driven Development）的英文简称，是敏捷开发中的一项核心实践和技术，也是一种设计方法论。TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。TDD虽是敏捷方法的核心实践，但不只适用于XP（Extreme Programming），同样可以适用于其他开发方法和过程。（摘自百度百科）

### BDD
BDD是测试驱动开发（Behavior Driven Development）的英文简称，是一种敏捷软件开发的技术，区别于TDD的地方是，它鼓励软件项目中的开发者、QA和非技术人员或商业参与者之间的协作。

#### 共同点和区别
TDD是先编写测试业务代码，然后再检验业务的正确性，更倾向于单元进行输入和输出的校验。BDD区别于TDD的是，BDD先写需求功能点描述，这种描述客户，经理，开发，测试都能看懂，既是没有写过任何代码的人都能看懂，而且是基于文本的。目的说白了，就是让开发出来的系统正是客户需要的，做正确的事情。


## 断言库
断言是编程术语，表示为一些布尔表达式，程序员相信在程序中的某个特定点该表达式值为真。简言之就是“下定论"。断言库

#### 1.assert(node.js原生断言库) 
(TDD风格)assert模块提供了简单的断言测试功能，可以通过require(‘assert’)进行使用。当断言表达式不成立的时候会抛出`AssertionError`。

常用的是Api如下：
```js
  // assert()是assert.ok()的简写方式，两者用法一样。
  // 如果value的值为true，那么什么也不会发生。如果value为false，将抛出一个信息为message的错误。
  assert(value[,message]) && assert.ok(value[, message])
  
  // 判断实际值(actual)与期望徝(expected)是否相等(==)，如果不相等，则抛出一个message的错误。
  assert.equal(actual, expected[, message])     
  // 与assert.equal 刚好相反
  assert.notEqual(actual, expected[, message])
  
 //  deep意味着子对象的可枚举属性也会被计算进去。如果本身属性及子对象属性都相等时通过。否则会抛出错误。
  assert.deepEqual(actual, expected[, message])
  // 与assert.deepEqual 刚好相反
  assert.notDeepEqual(actual, expected[, message])
 
 // 用法与assert.deepEqual()一样，判断条件为是否完全相等(===)。
  assert.strictEqual(actual, expected[, message])
  // 与assert.notStrictEqual 刚好相反
  assert.notStrictEqual(actual, expected[, message])
  
  // 断言block（块）会抛出一个错误，如果块未抛错误，则抛出一个message的错误
  assert.throws(block[, error][, message])
  // 与assert.throws 刚好相反
  assert.doesNotThrow(block[, error][, message])
```
官方文档链接：[Assert | Node.js](https://nodejs.org/api/assert.html)


#### 2.should.js
   should.js是一种典型的`BDD风格`的断言库，测试代码更加语义化，让断言的可读性更好。主要特点就是支持链式调用，有很多链式属性能方便编写者书写测试代码。如`.an`, `.of`, `.a`, `.and`, `.be`, `.have`, `.with`, `.is`, `.which`。

例如：
```js
var user = {
    name: 'tj',
    pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.be.an.instanceOf(Object).and.have.property('name', 'tj');
user.pets.should.be.instanceof(Array).and.have.lengthOf(4);
```
should.js也提供了丰富的断言api，布尔值判断(`.ok`、`.true`、`.false`)，类型判断(`.Object`, `.Number`, `.Array`, `.Boolean`, `.Function`, `.String`, `.Error`)、值比较(`.eql`、`.exactly`、`.above`,`.below`)、字符串判断(`.startWith`、`.endWith`、)等等。此处不一一列举。详见文档[should.js文档](https://shouldjs.github.io/)

should.js同时具有很好的拓展性，可以自定义链、自定义断言等。
例：
```js
  const Assertion = should.Assertion
  Assertion.addChain('notAny',function(){
    this.anyOne = false
  })
  
  Assertion.add('rich',function(){
    this.params = {opreator:'to be a rich man'}
    this.obj.should.have.propety('money').which.is.a.Number()
    this.obj.money.should.above(1000000)
  })

```

#### chai.js
chai是一套TDD(测试驱动开发)/BDD(行为驱动开发)的断言框架,它包含有3个断言库支持BDD风格的expect/should和TDD风格的assert。chai包含的assert和should只是参照上述介绍的assert和should.js的重新实现，并不是同一个东西。

官方示例：
```js
Should
chai.should();

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.lengthOf(3);
tea.should.have.property('flavors')
  .with.lengthOf(3);
                
```

```js
Expect
var expect = chai.expect;

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.lengthOf(3);
expect(tea).to.have.property('flavors')
  .with.lengthOf(3);
                
```

```js
Assert
var assert = chai.assert;

assert.typeOf(foo, 'string');
assert.equal(foo, 'bar');
assert.lengthOf(foo, 3)
assert.property(tea, 'flavors');
assert.lengthOf(tea.flavors, 3);
                
```

chai.js除了有丰富的api意外，更具特色的是它支持`插件拓展`，可以自己编写和使用各种插件，以满足你不同的测试需要。

官方文档：[chai文档](https://www.chaijs.com/)

生成，展示测试结果(Mocha, Jasmine, Jest, Karma)
快照测试(Jest, Ava)
提供仿真(Sinon, Jasmine, enzyme, Jest, testdouble)
生成测试覆盖率报告(Istanbul, Jest, Blanket)
提供类浏览器环境(Protractor, Nightwatch, Phantom, Casper)
解释上面提到的点：
测试框架，即组织你的测试，当前流行 BDD 的测试结构。
快照测试(snapshot testing)，测试 UI 或数据结构是否和之前完全一致，通常 UI 测试不在单元测试中
仿真(mocks, spies, and stubs)：获取方法的调用信息，模拟方法，模块，甚至服务器


## 测试框架
前端的测试框架有很多，如：Mocha, Jasmine, Jest, Cucumber等等，前端框架提供了很多不同的测试功能，`仿真测试` `快照测试` `提供类浏览器环境` `生成，展示测试结果`等等

#### Mocha
Mocha是一种既可以在node.js环境运行，也可以在浏览器中运行的测试框架。它让我们可以更加专注于编写单元测试本身和结果。

mocha的特点主要有：
1. 既可以测试简单的JavaScript函数，又可以测试异步代码，因为异步是JavaScript的特性之一；
2. 可以自动运行所有测试，也可以只运行特定的测试；
3. 可以支持before、after、beforeEach和afterEach来编写初始化代码。

***编写测试****
```js
// sum.js

module.exports = function (...args) {
    var sum = 0;
    for (let n of args) {
        sum += n;
    }
    return sum;
};
```
```js
// test.js
const assert = require('assert');
const sum = require('../sum');

describe('#hello.js', () => {

    describe('#sum()', () => {
        it('sum() should return 0', () => {
            assert.strictEqual(sum(), 0);
        });

        it('sum(1) should return 1', () => {
            assert.strictEqual(sum(1), 1);
        });

        it('sum(1, 2) should return 3', () => {
            assert.strictEqual(sum(1, 2), 3);
        });

        it('sum(1, 2, 3) should return 6', () => {
            assert.strictEqual(sum(1, 2, 3), 6);
        });
    });
});

```
`describe`块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"加法函数的测试"），第二个参数是一个实际执行的函数，可以任意嵌套，以便把相关测试看成一组测试。

`it`块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1 加 1 应该等于 2"），第二个参数是一个实际执行的函数。


***生命周期***

mocha的每个测试套件(describe)都有一个生命周期，`before`、`after`、`beforeEach`、`afterEach`
```js
describe("liftcycle",()=>{
  before(){
    // 该describe运行开始时候执行
  }
  
  after(){
    // 该describe运行结束时候执行
  }
  
  beforeEach(){
    // describe的每个it运行开始时候执行
  }
  
  afterEach(){
    // describe的it运行结束时候执行
  }

})
```

***异步测试***

mocha提供了回调`done`和`返回promise`的方式来实现异步测试。也支持`async`和`await`
```js
describe('setTimeout',(){
  it('set delay 1000ms',done=>{
    
    setTimeout(()=>{
      try{
      assert.ok(1)
      }finnally{
        done()
      }
    },1000)
  
  })
})

describe('Promise',(){
  it('promise',async ()=>{
    let data  = await promise()
    assert.strictEqual(data,expectedValue)
  })
})


```


## 测试运行环境
测试运行环境，顾名思义就是为需要测试的代码提供运行的环境。这种环境不需要大量的配置，只需编写代码并从测试中立即获得结果。 从而提高你的生产力和创造力。

#### Karma
karma可用于测试所有主流Web浏览器，也可集成到CI工具，也可和其他代码编辑器(例如webstrom)一起使用。这个测试工具的一个强大特性就是，它可以监控(Watch)文件的变化，然后自行执行，通过console.log显示测试结果。

Karma有一下几个特点：
1. 可以在真实环境中测试代码。
2. 可以在本地测试，也可以在持续集成服务器上执行测试。
4. 兼容 Istanbul 自动生成覆盖率报告。
5. 兼容RequireJS
6. 支持远程控制
8. 支持调试

karma初始化
```bash
 $ karma init
```
通过`karma init`会生成一个`karma.conf.js`。

```js
module.exports = function(config) {
  config.set({

    // base path：是用于匹配其他相对路径的基础路径（如：files和exclude）
    basePath: '',

    // 框架：被用于测试使用到的框架如mocha chai等
    // 可用框架可查看: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // 加载到浏览器测试的文件，支持通配符
    files: [
      'test/**/*Spec.js'
    ],


    // 在files中不被匹配到的文件，支持通配符
    exclude: [
    ],


    // 在启动浏览器之前预加载匹配到的文件
    // 可用的预加载器: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // 测试报告采用什么展示
    // 参数如: 'dots', 'progress'
    // 可用的报告器见: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // WEB服务的端口
    port: 9876,


    // 输出是否使用颜色
    colors: true,


    // 日志等级
    // 参数如: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // 每次测试文件被修改的时候是否自动执行测试脚本
    autoWatch: true,


    // 开启哪些浏览器进行测试
    // 可用的浏览器启动器见: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // CI模式
    // 如果设置成true，测试在完成后会线程会关闭，只运行一次
    singleRun: false,

    // 并发等级
    // 允许有多少个浏览器同时进行测试，Infinity为无限制，1为1个
    concurrency: Infinity
  })
}
```

karma具有强大的拓展性
1. 允许通过不同的frameworks来进行拓展测试框架，增强测试的功能
2. 允许通过preprocessors来进行预编译各种需要测试的文件。
3. 允许通过reporters来收集不同框架产生的测试报告
4. 允许通过browsers来增加不同的测试环境

***ES6测试***
可以通过`karma-webpack`这个预编译器,使用babel来对ES6文件的编译，然后再到浏览器中进行测试工作。配置方法详见：[karma-webpack](https://github.com/webpack-contrib/karma-webpack)

##### 覆盖率
此处的覆盖率指的是`代码覆盖`，是软件测试中的一种度量，描述程式中源代码被测试的`比例`和`程度`，所得比例称为代码覆盖率。

常见的覆盖率有以下几种：
- 函式覆盖率（Function coverage）：有呼叫到程式中的每一个函式（或副程式）吗？
- 指令覆盖率（Statement coverage）：若用控制流图表示程式，有执行到控制流图中的每一个节点吗？
- 判断覆盖率（Decision coverage）：（和分支覆盖率不同）若用控制流图表示程式，有执行到控制流图中的每一个边吗？例如控制结构中所有IF指令都有执行到逻辑= 运算式成立及不成立的情形吗？
- 条件覆盖率（Condition coverage）：也称为谓词覆盖（predicate coverage），每一个逻辑运算式中的每一个条件（无法再分解的逻辑运算式）是否都有执行到成立及不成立的情形吗？条件覆盖率成立不表示判断覆盖率一定成立。
- 条件/判断覆盖率（Condition/decision coverage）：需同时满足判断覆盖率和条件覆盖率。

`istanbul` 是 JavaScript 程序的代码覆盖率工具，在karma中有在istanbul上封装的工具`karma-coverage`。

karma-coverage能够生成丰富有效的覆盖率报告，集成和配置方式详见：[karma-coverage](https://github.com/karma-runner/karma-coverage)



