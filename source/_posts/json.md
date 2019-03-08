---
title: 何为JSON
date: 2013-02-03 00:00:00
categories: JavaScript
keywords: JSON
description: JSON即JavaScript Object Notation，JavaScript对象表示法，是一种流行的数据交换方式，易于程序员阅读和编写、程序解析和生成
---

JSON即JavaScript Object Notation，JavaScript对象表示法，是一种流行的数据交换方式，易于程序员阅读和编写、程序解析和生成。JSON是JavaScript原生数据格式，可以轻松用于AJAX应用中。

JSON规范如下：

1. 对象：包含在“{”和“}”之间的一个键-值对集合，每个键-值对之间以逗号分隔。键和值本身用冒号“:”分隔。键是简单的字符串，值可以是数组、字符串、数字、布尔值或为空；
2. 数组：有序数据对，数组的值以逗号分隔并包含在“[”和“]”之间；
3. 字符串：必须包含在双引号之间。

JSON实例：

最简单的JSON

``` JavaScript
{
    "name": "Yophee",
    "address": "Beijing"
}
```

使用数组的JSON

``` JavaScript
{
    "name": "bank",
    "phoneNumbers": ["95588", "95533", "95559"]
}
```

复杂的JSON

``` JavaScript
{
    "people": [{
        "name": "Zhang San",
        "age": 29,
        "isAdult": true
    }, {
        "name": "Li Si",
        "age": 15,
        "isAdult": false
    }]
}
```

需要注意的是：

1. 对象的键和字符串类型的值必须包含在双引号中，不允许使用单引号
2. JSON要求数据编码为UTF-8格式
