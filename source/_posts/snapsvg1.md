---
title: Snap
date: 2018-12-23 00:00:00
categories: Snap.svg
keywords: Snap, Snap.svg
description: 
---

## `Snap()`

创建SVG画布或者封装已有的SVG元素，返回值为Element对象

- 参数为width, height，指定创建画布的尺寸
- 参数为SVG DOM，指定Snap封装对象
- 参数为CSS query selector，通过CSS查询选择封装对象
- 参数为Element数组，将元素组合成集合队列
- 参数留空，相当于width=100%, height=100%

## `Snap.acos()`

求反余弦值，与Math.acos()返回弧度值不同的是，它返回角度值

## `Snap.ajax()`

参数为url, postData, callback, scope
postData可选，传值发送POST请求，否则为GET；scope为回调函数的作用域

## `Snap.angle()`

参数为x1, y1, x2, y2, [x3], [y3]
只传两个点时，表示x坐标轴顺时针旋转到点2指向点1的向量的角度值
传入三个点，表示点3指向点2的向量顺时针旋转到点3指向点1的向量的角度值

## `Snap.animate()`

将一个/组数字缓动到另一个/组数字

参数为from, to, setter, duration, [easing], [callback]
from, to为动画起始和结束数值或数组；setter是参数为各个数值或数组中间值的动画执行函数；duration为动画持续毫秒时间；easing为缓动函数；callback动画结束时候执行的回调

``` JavaScript
const rect = Snap().rect(0, 0, 10, 10)
Snap.animate(0, 10, val => {
    rect.attr({
        x: val
    })
}, 1000)
// 等同于
rect.animate({x: 10}, 1000)
```
<!-- ## `Snap.animation()` -->

## `Snap.asin()`

求反正弦值，与Math.asin()返回弧度值不同的是，它返回角度值

## `Snap.atan()`

求反正切值，与Math.atan()返回弧度值不同的是，它返回角度值

## `Snap.atan2()`

求反正切值，与Math.atan2()返回弧度值不同的是，它返回角度值

## `Snap.closestPoint()`

Returns closest point to a given one on a given path.

Parameters
pathElementpath element
xnumberx coord of a point
ynumbery coord of a point
Returns:objectin format

## `Snap.color()`

## `Snap.cos()`

## `Snap.deg()`

## `Snap.deurl()`

## `Snap.filter`

## ``