---
title: canvas动态随机纹理
date: 2019-02-27 00:00:00
categories: Uncategorized
keywords: canvas, createImageData, putImageData, createPattern
description: 使用重复平铺模式给canvas图像填充动态随机纹理
---

{% raw %}
<div class="scrollable-wrapper"><canvas id="grain"></canvas></div>
<p style="margin-top:-1.25em; text-align:center; color:#83887c">点击图片启/停动态</p>
{% endraw %}

配置参数，包括重复平铺元素的尺寸、背景的放大系数、纹理的透明度、动态重绘频率。

``` JavaScript
const config = {
    size: 150,
    scaleX: 1,
    scaleY: 1,
    alpha: 20,
    interval: 8
}
```

背景画布，scale方法可对绘图进行缩放。

``` JavaScript
let bgCanvas, viewW, viewH, bgCtx

bgCanvas = document.getElementById('grain')
viewW = bgCanvas.width = bgCanvas.parentNode.clientWidth
viewH = bgCanvas.height = Math.round(viewW * 0.4)
bgCtx = bgCanvas.getContext('2d')
bgCtx.scale(config.scaleX, config.scaleY)
```

创建重复平铺元素，使用createImageData方法创建空白ImageData对象，ImageData对象的data是一个Uint8ClampedArray数组，图像的每个像素信息占4个元素储存，其中：

- R - 红色 (0-255)
- G - 绿色 (0-255)
- B - 蓝色 (0-255)
- A - alpha通道 (0-255 0透明 255完全可见)

这里空白ImageData对象data的所有像素初始值均为0。

``` JavaScript
let ptCanvas, ptCtx, ptData, ptDataLength

ptCanvas = document.createElement('canvas')
ptCanvas.width = ptCanvas.height = config.size
ptCtx = ptCanvas.getContext('2d')
ptData = ptCtx.createImageData(config.size, config.size)
ptDataLength = config.size * config.size * 4
```

绘图，给ImageData设置随机像素值，使用putImageData方法将图像数据放入平铺元素画布，擦除背景上的纹理图像，然后设置用于填充绘画的重复平铺模式，最后矩形填充背景。

``` JavaScript
function draw() {
    for (let i = 0; i < ptDataLength; i += 4) {
        const v = (Math.random() * 255) | 0
        ptData.data[i] = v
        ptData.data[i + 1] = v
        ptData.data[i + 2] = v
        ptData.data[i + 3] = config.alpha
    }
    ptCtx.putImageData(ptData, 0, 0)

    bgCtx.clearRect(0, 0, viewW, viewH)
    bgCtx.fillStyle = bgCtx.createPattern(ptCanvas, 'repeat')
    bgCtx.fillRect(0, 0, viewW, viewH)
}
draw()
```

以一定的频率动态重绘。

``` JavaScript
let frame = 0, play = false

function loop() {
    if (++frame % config.interval === 0) draw()
    play && requestAnimationFrame(loop)
}

bgCanvas.addEventListener('click', () => {
    play = !play
    play && loop()
})
```


{% raw %}
<script>
!function() {
    const config = {
        size: 150,
        scaleX: 1,
        scaleY: 1,
        alpha: 20,
        interval: 8
    }

    let bgCanvas, viewW, viewH, bgCtx

    bgCanvas = document.getElementById('grain')
    viewW = bgCanvas.width = bgCanvas.parentNode.clientWidth
    viewH = bgCanvas.height = Math.round(viewW * 0.4)
    bgCtx = bgCanvas.getContext('2d')
    bgCtx.scale(config.scaleX, config.scaleY)

    let ptCanvas, ptCtx, ptData, ptDataLength

    ptCanvas = document.createElement('canvas')
    ptCanvas.width = ptCanvas.height = config.size
    ptCtx = ptCanvas.getContext('2d')
    ptData = ptCtx.createImageData(config.size, config.size)
    ptDataLength = config.size * config.size * 4

    function draw() {
        for (let i = 0; i < ptDataLength; i += 4) {
            const v = (Math.random() * 255) | 0
            ptData.data[i] = v
            ptData.data[i + 1] = v
            ptData.data[i + 2] = v
            ptData.data[i + 3] = config.alpha
        }
        ptCtx.putImageData(ptData, 0, 0)

        bgCtx.clearRect(0, 0, viewW, viewH)
        bgCtx.fillStyle = bgCtx.createPattern(ptCanvas, 'repeat')
        bgCtx.fillRect(0, 0, viewW, viewH)
    }
    draw()

    let frame = 0, play = false

    function loop() {
        if (++frame % config.interval === 0) draw()
        play && requestAnimationFrame(loop)
    }

    bgCanvas.addEventListener('click', () => {
        play = !play
        play && loop()
    })
}()
</script>
{% endraw %}
