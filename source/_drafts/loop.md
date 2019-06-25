---
title: test
categories: Code Snippets
keywords: 
description: 
date: 2019-06-21 00:00:00
tags:
---



``` JavaScript
console.log('script start')

setTimeout(function() {
    console.log('setTimeout')
}, 0)

Promise.resolve().then(function() {
    console.log('promise1')
}).then(function() {
    console.log('promise2')
})

console.log('script end')
```
