---
title: Promise, async/await
date: 2019-03-08 00:00:00
categories: JavaScript
keywords: Promise, async, await, JavaScript
description: 
---

JavaScript中存在异步操作，对其有依赖的动作需在回调函数中处理。如下示例，要执行待加载脚本中的函数，需要等待脚本加载完成后在回调函数中进行。如果多个异步操作逐一依赖，会形成层层嵌套的回调函数，即“回调地狱”。

``` JavaScript
function loadScript(src, callback) {
    let script = document.createElement('script')
    script.src = src
    script.onload = () => callback(null, script)
    script.onerror = () => callback(new Error(`Script load error: ${src}`))
    document.head.append(script)
}

loadScript('http://no-such-url', (error, script) => {
    if (error) {
        // 处理错误
    } else {
        // 成功加载脚本
    }
})
```

ES6原生提供Promise对象，将异步操作以同步操作的流程表达出来，避免回调函数的层层嵌套。Promise对象代表一个异步操作，有三种状态：初始pending、成功fulfilled或失败rejected。只有异步操作的结果，可以决定初始状态变为成功或失败最终态。传给new Promise的控制函数会立即被自动调用，此函数接受两个参数resolve和reject，分别会在Promise对象状态变为成功或失败时被执行。

``` JavaScript
function loadScript(src) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(script)
        script.onerror = () => reject(new Error(`Script load error: ${src}`))
        document.head.append(script)
    })
}

let promise = loadScript('https://cdn.bootcss.com/lodash.js/4.17.11/lodash.min.js')
promise.then(
    script => console.log(`${script.src} is loaded`),
    error => console.log(`Error: ${error.message}`)
)
promise.then(script => console.log('One more handler'))
```

promise.then返回一个promise，可以用它调用下一个then。当then中的控制函数返回一个值时，它会变成当前promise的result，下一个处理程序会使用这个返回值运行。

``` JavaScript

```



``` JavaScript

```


``` JavaScript

```