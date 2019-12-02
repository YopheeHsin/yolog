---
title: 正则表达式
date: 2019-12-24 00:00:00
categories: JavaScript
keywords: 正则表达式, RegExp, JavaScript
description: 正则表达式
---

## 怎么用

正则表达式用来搜索和替换字符串。

``` JavaScript
// 两种创建语法
re1 = new RegExp(pattern[, flags])
re2 = /pattern/[flags]
```

flags修饰符：i不区分大小写，g查找所有匹配项，m多行模式，u完整unicode支持，y粘滞模式。

__只查找首个匹配项__

- str.search(reg) - 位置
- str.match(reg) - 匹配项
- regexp.test(str) - 是否有匹配
- regexp.exec(str) - 设置regexp.lastIndex，从指定位置查找

__查找所有匹配项__

- str.match(reg) - 使用g修饰符，得到匹配项数组
- regexp.exec(str) - 在循环中使用g修饰符，获取所有匹配项完整信息

__搜索并替换__

- str.replace(reg, str|func)

__拆分字符串__

- str.split(str|reg)




_待续 ~_







