# 继承
> 继承是面向对象编程当中搞一个非常重要的概念，在JavaScript 中我们可以通过原型链来模拟这种特性，今天我们就来认识一下 ES6 之前是如何实现继承这一功能的。

### 原型链继承
***原型链继承：***将子类的原型对象改写为父类的实例对象，在通过父类实例对象上面的[[Prototype]]属性与父类的原型对象产生关联，从而达到让子类的实例对象能够使用父类圆形上面的属性和方法的目的。

```js
function Parent() {
  this.name = "Parent";
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  this.name2 = "Child";
}

Child.prototype = new Parent();

Child.prototype.getName2 = function () {
  return this.name2;
};

const child = new Child();

console.log(child.getName()); // Parent
console.log(child.getName2()); // Child

```

上面的例子就是原型链继承的实现方法，子类的实例可以访问父类的属性和方法。但是这种继承方法有一个非常大的问题，就是所有子类的[[Prototype]]都会与这个父类的实例对象产生关联。当然这个父类的实例对象存在引用类型的属性时，又刚好是某个子类实例通过方法修改了这个引用属性，那这种修改会影响到所有的实例。请看实例：

```js
function Parent() {
  this.color = ["red", "white"];
}

function Child() {}

Child.prototype = new Parent();

const instance1 = new Child();
const instance2 = new Child();

instance1.color.push("black");
instance2.color.push("orange");

console.log(instance1.color); // [ 'red', 'white', 'black', 'orange' ]
console.log(instance2.color); // [ 'red', 'white', 'black', 'orange' ]

```

`instance1`和`instance2`共享原型对象的`colors`属性，这种相互影响的情况是程序设计当中应该尽量避免的。原型链继承的另一个问题是，子类在实例化时无法给父类构造函数传递参数。