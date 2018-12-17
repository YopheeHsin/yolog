---
title: JavaScript四则运算
date: 2018-12-17 00:00:00
categories: Code Snippets
keywords: JavaScript, add, subtract, multiply, divide
description: JavaScript加减乘除四则运算
---

``` JavaScript
function mathAdd(a, b) {
    if (!a) a = 0
    if (!b) b = 0
    let c = d = 0, e
    try {
        c = a.toString().split('.')[1].length
    } catch (f) {}
    try {
        d = b.toString().split('.')[1].length
    } catch (f) {}
    e = Math.pow(10, Math.max(c, d))
    return (mathMultiply(a, e) + mathMultiply(b, e)) / e
}

function mathSubtract(a, b) {
    return mathAdd(a, -b)
}

function mathMultiply(a, b) {
    if (!a) a = 0
    if (!b) b = 0
    let c = 0, d = a.toString(), e = b.toString()
    try {
        c += d.split('.')[1].length
    } catch (f) {}
    try {
        c += e.split('.')[1].length
    } catch (f) {}
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

function mathDivide(a, b) {
    if (!a) a = 0
    if (!b) b = 0
    let c, d, e = f = 0
    try {
        e = a.toString().split('.')[1].length
    } catch (g) {}
    try {
        f = b.toString().split('.')[1].length
    } catch (g) {}
    c = Number(a.toString().replace('.', ''))
    d = Number(b.toString().replace('.', ''))
    return mathMultiply(c / d, Math.pow(10, f - e))
}

/*
    const num = 200.3
    num * 3 //600.9000000000001
    mathMultiply(num, 3) //600.9
*/
```
