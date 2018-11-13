---
title: 颜色加深或减淡
date: 2018-10-19 14:26:28
categories: Code Snippets
keywords: JavaScript, 颜色加深代码, 颜色减淡代码
description: JavaScript颜色加深或减淡
---

``` JavaScript
class Color {
    HexToRgb(str) {
        str = str.replace('#', '')
        const hxs = str.match(/../g)
        for (let i = 0; i < 3; i++) {
            hxs[i] = parseInt(hxs[i], 16)
        }
        return hxs
    }
    RgbToHex(a, b, c) {
        const hexs = [a.toString(16), b.toString(16), c.toString(16)]
        for (let i = 0; i < 3; i++) {
            if (hexs[i].length === 1) hexs[i] = '0' + hexs[i]
        }
        return '#' + hexs.join('')
    }
    getDarkColor(color, level) {
        const rgbc = this.HexToRgb(color)
        for (let i = 0; i < 3; i++) {
            rgbc[i] = Math.floor(rgbc[i] * (1 - level))
        }
        return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2])
    }
    getLightColor(color, level) {
        const rgbc = this.HexToRgb(color)
        for (let i = 0; i < 3; i++) {
            rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i])
        }
        return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2])
    }
}

const colorFn = new Color()

//colorFn.getDarkColor('#6CA3EF', 0.1)
```