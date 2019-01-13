---
title: ES5中的继承
date: 2019-01-13 00:00:00
categories: Uncategorized
keywords: JS类, JS继承, JavaScript
description: JavaScript中类的封装、类式继承、构造函数继承、组合继承、原型式继承、寄生式继承、寄生组合式继承
---

## 类的封装

通过this在当前对象自身上添加属性和方法，通过原型prototype继承公共属性和方法。

JavaScript的函数作用域，即函数内部的变量和方法在外界是访问不到的，通过此特性即可创建私有属性和方法。

在函数内部通过this创建的属性和方法，每个实例化对象都拥有一份，并且外部可访问。

通过this创建的方法，不仅可以访问公有属性和方法，还能访问类的私有属性和方法，故而可以用这些特权方法来初始化实例对象，创建对象时调用特权方法可以看作是类的构造器。

类外部通过点语法添加的属性和方法，在使用new关键字创建对象时没有执行到，所以对象实例无法获取，称为静态属性和方法。

由于JavaScript原型链的特性，新实例对象的prototype和类的prototype指向的是同一个对象，所以实例对象可以共享在原型上定义的公共属性和方法。

<img src="/images/else/class.gif" width="295">

``` JavaScript
function Book(name, price) {
    // 私有属性
    var internalID = 1
    // 私有方法
    function setID() {}

    // 对象公有属性
    this.name = name
    // 对象公有方法
    this.printName = function() {}

    // 特权方法
    this.getPrice = function() {}
    this.setPrice = function() {}

    // 构造器
    this.setPrice(price)
}

// 公共属性
Book.prototype.isTechBook = false
// 公共方法
Book.prototype.display = function() {}

// 静态属性
Book.isChineseBook = true
// 静态方法
Book.resetTime = function() {}
```

## 类式继承

## 构造函数继承

## 组合继承

## 原型式继承

## 寄生式继承

## 寄生组合式继承