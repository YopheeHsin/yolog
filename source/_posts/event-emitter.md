---
title: EventEmitter自定义事件监听器
date: 2019-04-01 00:00:00
categories: Code Snippets
keywords: event emitter, JavaScript
description: 监听自定义事件on，只触发一次之后移除监听器once，移除off，触发emit，清除所有自定义事件clean
---

小巧的自定义事件系统：监听自定义事件on，只触发一次之后移除监听器once，移除off，触发emit，清除所有自定义事件clean。

``` JavaScript
class EventEmitter {
    constructor() {
        this._events = Object.create(null)
    }

    on(name, cb) {
        if (!name || !cb) return

        let cbs = this._events[name] = this._events[name] || []
        cbs.indexOf(cb) === -1 && cbs.push(cb)

        return this
    }

    off(name, cb) {
        if (!name || !cb) return
        let cbs = this._events[name]
        if (!cbs || !cbs.length) return

        const index = cbs.indexOf(cb)
        if (index !== -1) cbs.splice(index, 1)

        return this
    }

    once(name, cb) {
        if (!name || !cb) return

        let fired = false

        function magic() {
            this.off(name, magic)

            if (!fired) {
                fired = true
                cb.apply(this, arguments)
            }
        }

        this.on(name, magic)

        return this
    }

    emit(name) {
        if (!name) return

        const args = [].slice.call(arguments, 1)
        const cbs = this._events[name] || []

        for (let i = 0, l = cbs.length; i < l; i++) {
            cbs[i].apply(this, args)
        }

        return this
    }

    clean() {
        delete this._events
    }
}

export default EventEmitter
```
