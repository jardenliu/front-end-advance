# 内存管理与垃圾回收

## 前言
JS属于高级语言，隐藏了内存管理功能。但无论开发人员是否注意，内存管理都在运行，所有编程语言最终要与操作系统打交道，在内存大小固定的硬件上工作。不幸的是，即使不考虑垃圾回收对性能的影响，2017年最新的垃圾回收算法，也无法只能回收所有极端的情况。
唯有程序员自己才知道何时进行垃圾回收，而JS由于没有暴露显示内存的管理接口，导致触发垃圾回收的代码看起来像垃圾，或者优化垃圾回收的代码看起来不优雅、甚至不可读。

所以在JS这类高级语言中，有必要掌握内存分配原理，在对内存敏感的场景，比如nodejs代码做严格检查与优化。谨慎使用dom操作、主要删除没有业务意义的变量，避免提前优化，过度优化，在保证代码可读性的前提下，利用性能监控工具，通过调用栈定位问题代码。


不管什么程序语言，内存生命收齐基本是一致的：
1. 分配你所需要的内存。
2. 使用分配到的内存
3. 不需要时将其释放、归还


理论上着3点我们在编写JS代码的时候不需要过多关注。因为JS拥有一套自动回收垃圾的机制去做这些事情

我们之所以还是要去关注这些问题的原因是这套自动回收机制在有些方面做得不够好，需要我们手动销毁一些不太使用的内存占用。

## 垃圾回收机制

垃圾回收算法主要依赖于引用的概念。在内存管环境中，一个对象如果有访问另一个对象的权限（隐式或显式），叫做一个对象引用另一个对象。