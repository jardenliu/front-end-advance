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

### 经典继承（盗用构造函数）
为了解决原型链继承中，引用类型相互影响和无法向父类构造函数传递参数的问题，衍生出了盗用构造函数的技巧。许多时候这种技巧也被称为经典继承。它会在子类中调用父类的构造函数并使用call和apply方法指定this  让子类实例化的时候先执行父类的构造函数。

```js
function Parent(name) {
  this.name = name;
  this.color = ["white", "red"];
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

const instance1 = new Child("foo", 20);
instance1.color.push("blue");

console.log(instance1.name); // foo
console.log(instance1.age); // 20
console.log(instance1.color); // [ 'white', 'red', 'blue' ]

const instance2 = new Child("bar", 36);
instance2.color.push("black");
console.log(instance2.name); // ibar
console.log(instance2.age); // 36
console.log(instance2.color); // [ 'white', 'red', 'black' ]

```
上面的例子为我们展现了如何盗用构造函数，这种技术其实相当于借用了父类的构造函数的初始化逻辑。当我们在执行子类实例化时，用`call`或 `apply`改变了`this`的指向。当父类构造函数执行时相当于在给子类实例对象添加属性。这样操作以后引用类型的属性是独立存在于各个实例对象当中的。与原型对象无关，自然没有相互影响的问题了。

### 组合继承

组合继承其实就是将原型链继承和经典继承相结合，通过互补规避各自的缺点

```js

function Parent(name) {
  this.name = name;
  this.color = ["white", "red"];
}

Parent.prototype.getColor = function () {
  return this.color;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();

const instance1 = new Child("foo", 20);
instance1.color.push("blue");

console.log(instance1.name); // foo
console.log(instance1.age); // 20
console.log(instance1.getColor()); // [ 'white', 'red', 'blue' ]

const instance2 = new Child("bar", 36);
instance2.color.push("black");
console.log(instance2.name); // ibar
console.log(instance2.age); // 36
console.log(instance2.getColor()); // [ 'white', 'red', 'black' ]

```
组合继承通过原型链继承，实现了访问原型的对象方法；又通过经典继承在实例对象上生成了color属性，从而遮蔽了Child对象上color属性，这样实例修改就不会相互影响了


### 原型式继承
如果你希望通过[[Prototype]]实现对象之间的信息共享，那么你可以了解下原型式继承。实现方法如下：
```js
function extObj(obj) {
  function Fn() {}
  Fn.prototype = obj;
  return new Fn();
}

const originObj = {
  name: "origin",
  color: ["red", "black"],
};

const newObj = extObj(originObj);
const newObj2 = extObj(originObj);

console.log(newObj.name); // origin
console.log(newObj2.name); // origin

newObj.name = "new";
newObj.color.push("blue");

console.log(newObj.name); // new
console.log(newObj2.name); // origin
console.log(newObj.color); // [ 'red', 'black', 'blue' ]
console.log(newObj2.color); // [ 'red', 'black', 'blue' ]

```
原型继承需要借助一个工具函数，这个函数会将传入的对象作为临时构造函数Fn的原型对象，然后返回临时的构造函数的实例。此时这个实例对象就和一开始传入的对象产生了关联关系。原型式的继承同样存在对象上引用类型的问题。
上述例子中工具函数是我们自己创建的，在ES5当中可以通过Object.create()实现原型继承，并且可以通过该函数的第二个参数显示指定函数对象的属性。

### 寄生式继承

寄生式继承可以看做是原型式继承的变式。他通过包覆函数来增强实例对象，为实例对象添加更多的功能。

```js
const oriObj = {
  name: "origin",
};

function createObj(obj) {
  const o = Object.create(obj);
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}

const obj = createObj(oriObj);

obj.sayName(); // origin


```

### 寄生组合继承

寄生式组合继承为了解决组合继承的效率问题（两次调用构造函数）。组合继承当中父类的构造函数始终被调用两次。请看实例：
```js
function Parent(name) {
  this.name = name;
  this.color = ["white", "red"];
}

Parent.prototype.getColor = function () {
  return this.color;
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用Parent的构造函数
  this.age = age;
}

Child.prototype = new Parent(); // 第一次调用Parent的构造函数

const instance1 = new Child("foo", 20);

```

为了解决这个问题，我们可以使用寄生式的思想来代替父类构造函数第一次调用生成实例对象的操作。我们创建一个包装函数，它会使用父类原型对象来创建一个新对象，然后将这个新对象关联到子类原型对象上，这样父类构造函数就不用调用两次了。

```js
function inheritParent(parent, child) {
  const prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

function Parent(name) {
  this.name = name;
  this.color = ["white", "red"];
}

Parent.prototype.getColor = function () {
  return this.color;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritParent(Parent, Child);

const instance1 = new Child("foo", 20);
console.log(instance1.getColor());

```
寄生式组合继承解决了父类构造函数多次被调用的问题，可以算是现阶段继承的最佳模式。

