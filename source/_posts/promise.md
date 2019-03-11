---
title: Promise, async/await
date: 2019-03-11 00:00:00
categories: JavaScript
keywords: Promise, async, await, JavaScript
description: ES6原生提供Promise对象，避免回调函数的层层嵌套，ES8标准引入的async函数使得异步操作变得更加方便
---

## 异步回调嵌套

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

## Promise对象

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

## Promise处理链

promise.then会返回一个promise，可以用它调用下一个then。当then中的控制函数返回一个值时，它会变成当前promise的result，下一个处理程序会使用这个返回值运行。

``` JavaScript
new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 1000)
}).then(function(result) {
    console.log(result) // 1
    return result * 2
}).then(function(result) {
    console.log(result) // 2
    return result * 2
}).then(function(result) {
    console.log(result) // 4
    return result * 2
})
```

如果then中的控制函数返回的值是一个promise，那么直到它结束之前，下一步执行会一直被暂停。在结束之后，该promise的结果会传递给下一个then中的处理程序。

``` JavaScript
fetch('https://api.github.com/users/YopheeHsin')
    .then(response => response.json())
    .then(githubUser => new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = githubUser.avatar_url
        document.body.append(img)

        setTimeout(() => {
            img.remove()
            resolve(githubUser)
        }, 3000)
    }))
    // 3秒后执行
    .then(githubUser => console.log(`Finished showing ${githubUser.name}`))
```

把代码分割成几个可复用的函数。使用catch来处理Promise链中的所有错误，如果上面任一promise被reject，那么catch中的错误处理程序便会执行。除了明确的rejected失败状态，catch也适用于throw new Error和包括代码错误在内的任何错误。

``` JavaScript
function loadJson(url) {
    return fetch(url).then(response => response.json())
}

function showAvatar(githubUser) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = githubUser.avatar_url
        document.body.append(img)

        setTimeout(() => {
            img.remove()
            resolve(githubUser)
        }, 3000)
    })
}

loadJson('https://api.github.com/users/YopheeHsin')
    .then(showAvatar)
    .then(githubUser => console.log(`Finished showing ${githubUser.name}`))
    .catch(err => console.log(err))
```

## Promise静态方法

Promise类中有4个静态方法。

Promise.resolve根据给定的value值返回resolved promise。

``` JavaScript
let promise = Promise.resolve(value)
// 等价于
let promise = new Promise(resolve => resolve(value))
```

用来将已有的值“封装”进promise，确保接口统一性。

``` JavaScript
function loadCached(url) {
    let cache = loadCached.cache || (loadCached.cache = new Map())
    if (cache.has(url)) return Promise.resolve(cache.get(url))
    return fetch(url)
        .then(response => response.text())
        .then(text => {
            cache.set(url, text)
            return text
        })
}
```

Promise.reject创建带有error的rejected promise。

``` JavaScript
let promise = Promise.reject(error)
// 等价于
let promise = new Promise((resolve, reject) => reject(error))
```

Promise.all并行运行多个promise，并等待所有promise准备就绪。

``` JavaScript
let names = ['remy', 'jeresig', 'iliakan']
let requests = names.map(name => fetch(`https://api.github.com/users/${name}`))
Promise.all(requests)
    .then(responses => {
        responses.forEach(response => console.log(`${response.url}: ${response.status}`))
        return responses
    })
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(users => console.log(users.map(user => user.name)))
```

Promise.all使用下面这样的容错机制。catch会对异常promise产生error并返回，根据promise工作原理，只要then/catch处理器返回了值，执行流程就会“正常”进行。

``` JavaScript
let urls = [
    'https://api.github.com/users/YopheeHsin',
    '/',
    'http://no-such-url'
]

Promise.all(urls.map(url => fetch(url).catch(err => err)))
    .then(responses => Promise.all(
        responses.map(r => r instanceof Error ? r : r.json().catch(err => err))
    ))
    .then(results => {
        console.log(results[0].name)
        console.log(results[1])
        console.log(results[2])
    })
```

Promise.race与Promise.all类似，但不会等待所有promise都完成，只等待第一个promise完成后即继续执行。

## async/await

ES8标准引入的async函数使得异步操作变得更加方便。

将async关键字放在函数前，意味着该函数总是会返回promise。如果代码return非promise值，会自动将其封装到resolved promise中。

``` JavaScript
async function f() {
    return 1
}
// 等价于
async function f() {
    return Promise.resolve(1)
}

f().then(r => console.log(r))
```

await只在async函数中工作，作用是等待promise，直到其解决并返回其结果。这样的语法比promise.then更优雅地获取结果，也更容易阅读和编写。

``` JavaScript
async function showAvatar() {
    let response = await fetch('https://api.github.com/users/YopheeHsin')
    let githubUser = await response.json()
    let img = document.createElement('img')
    img.src = githubUser.avatar_url
    document.body.append(img)
    await new Promise(resolve => setTimeout(resolve, 3000))
    img.remove()
    return githubUser
}

showAvatar()
    .then(githubUser => console.log(`Finished showing ${githubUser.name}`))
```

当await的promise失败reject时，它会抛出error，就像该行上有常规throw语句一样，可以使用try...catch来捕获这个error。

``` JavaScript
async function f() {
    await Promise.reject(new Error('Whoops!'))
}
// 等价于
async function f() {
    throw new Error('Whoops!')
}

// 出错时，控制权会进入catch块，可以多行封装
async function f() {
    try {
        let response = await fetch('/no-user-here')
        let user = await response.json()
    } catch (err) {
        console.log(err)
    }
}

// 也可以通过追加catch来处理
async function f() {
    let response = await fetch('http://no-such-url')
}
f().catch(err => console.log(err))
```

<cite>参考：
http://es6.ruanyifeng.com/#docs/promise
http://es6.ruanyifeng.com/#docs/async
https://javascript.info/async</cite>
