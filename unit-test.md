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

## 覆盖率
