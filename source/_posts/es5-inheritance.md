---
title: ES5中的继承
date: 2019-02-11 00:00:00
categories: JavaScript
keywords: JS类, JS继承, JavaScript
description: JavaScript中继承的实现，包括类式继承、构造函数继承、组合继承、原型式继承、寄生式继承、寄生组合式继承
---

## 类式继承

将父类的实例赋值给子类的原型。实例化父类时，新创建的对象复制了父类构造函数的属性和方法，并且将\_\_proto\_\_指向了父类的原型，即拥有了父类原型上的共有属性和方法。

``` JavaScript
// 声明父类
function SuperClass() {
    this.superValue = true
}

// 为父类添加共有方法
SuperClass.prototype.getSuperValue = function() {
    return this.superValue
}

// 声明子类
function SubClass() {
    this.subValue = false
}

// 继承父类
SubClass.prototype = new SuperClass()

// 为子类添加共有方法
SubClass.prototype.getSubValue = function() {
    return this.subValue
}

// 使用
var subInstance = new SubClass()
console.log(subInstance.getSuperValue()) // true
console.log(subInstance.getSubValue()) // false

// 对象的prototype链关系
console.log(subInstance instanceof SuperClass) // true
console.log(subInstance instanceof SubClass) // true
console.log(SubClass.prototype instanceof SuperClass) // true
```

类式继承的缺点，一是不同子类实例对从父类构造函数继承来的引用类型属性的更改会互相影响；二是子类实例化时无法向父类传参。

## 构造函数继承

通过在子类的构造函数作用环境中执行父类的构造函数实现。JS的call方法可以更改函数的作用环境，在子类中对父类调用此方法，即将子类的this给父类使用，由于父类是给this绑定属性和方法的，因此子类自然也就继承了父类构造函数中的属性和方法。

``` JavaScript
// 声明父类
function SuperClass(id) {
    this.id = id
    this.books = ['JavaScript', 'HTML', 'CSS']
}

// 父类原型方法
SuperClass.prototype.showBooks = function() {
    console.log(this.books)
}

// 声明子类
function SubClass(id) {
    // 继承父类
    SuperClass.call(this, id)
}
```

构造函数继承没有涉及prototype，父类的原型属性和方法不会被继承，想要被子类继承就必须要放在构造函数中，这样创建出来的每个实例都会单独拥有一份，违背了代码复用的原则。

## 组合继承

组合使用类式继承和构造函数继承，扬长避短。

``` JavaScript
// 声明父类
function SuperClass(name) {
    this.name = name
    this.books = ['JavaScript', 'HTML', 'CSS']
}

// 父类原型方法
SuperClass.prototype.getName = function() {
    return this.name
}

// 声明子类
function SubClass(name, time) {
    // 构造函数式继承父类
    SuperClass.call(this, name)
    // 子类新增属性
    this.time = time
}

// 类式继承父类
SubClass.prototype = new SuperClass()

// 子类原型方法
SubClass.prototype.getTime = function() {
    return this.time
}
```

组合继承的不完美之处在于，使用构造函数继承时执行了一遍父类的构造函数，而在实现类式继承时又重复调用了一遍。

## 原型式继承

借助原型prototype根据已有对象创建新对象。

``` JavaScript
function inheritObject(o) {
    // 声明一个过渡函数对象
    function F() {}
    // 过渡对象的原型继承父对象
    F.prototype = o
    return new F()
}

// 使用
var book = {
    name: 'JavaScript',
    alikeBooks: ['HTML', 'CSS']
}

var newBook = inheritObject(book)
newBook.name = 'Canvas'
newBook.alikeBooks.push('SVG')
```

上面函数中的过渡对象F相当于继承中的子类，由于F的构造函数中无内容，开销比较小。缺点是父类对象的引用类型属性会被共用。

## 寄生式继承

对原型式继承的二次封装，在封装过程中对继承的对象进行了拓展，添加了新的属性和方法。

``` JavaScript
function createBook(obj) {
    // 原型式继承
    var o = new inheritObject(obj)
    // 拓展新对象
    o.getName = function() {
        return this.name
    }
    return o
}
```

## 寄生组合式继承

``` JavaScript
function inheritPrototype(subClass, superClass) {
    // 复制一份父类的原型副本保存在变量中
    var p = inheritObject(superClass.prototype)
    // 修正子类的constructor
    p.constructor = subClass
    // 设置子类原型
    subClass.prototype = p
}

// 定义父类
function SuperClass(name) {
    this.name = name
    this.colors = ['red', 'blue', 'green']
}

// 定义父类原型方法
SuperClass.prototype.getName = function() {
    return this.name
}

// 定义子类
function SubClass(name, time) {
    // 构造函数式继承
    SuperClass.call(this, name)
    // 子类新增属性
    this.time = time
}

// 寄生式继承父类原型
inheritPrototype(SubClass, SuperClass)

// 子类新增原型方法
SubClass.prototype.getTime = function() {
    return this.time
}
```

<cite>参考：《JavaScript设计模式》</cite>