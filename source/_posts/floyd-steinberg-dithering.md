---
title: Floyd-Steinberg
date: 2019-01-01 00:00:00
categories: Uncategorized
keywords: Floyd-Steinberg, 三次贝塞尔, Vue, SVG
description: 用Vue实现响应式SVG来简单模拟cubic-bezier三次贝塞尔时间函数
---


<div class="scrollable-wrapper"><svg id="dithering"></svg></div>

{% img /images/else/kid-l.jpg 280 %}

Floyd–Steinberg抖动是一种图像抖动算法，由Robert W.Floyd和Louis Steinberg于1976年首次发布。它通常由图像处理软件使用，例如，当图像转换为最多256色的GIF格式时。



该算法利用误差扩散实现抖动，即将像素的剩余量化误差推（加）到相邻像素上，待以后处理。它根据分布（显示为相邻像素的地图）将债务摊开：



用星（\*）指示的像素指示当前正在扫描的像素，并且空白像素是先前扫描的像素。该算法从左到右，从上到下扫描图像，逐像素量化。每次量化误差转移到相邻像素，而不影响已经量化的像素。因此，如果一些像素向下取整，则下一个像素向上取整的可能性更大，这样平均而言，量化误差接近于零。


扩散系数具有这样的性质：如果原始像素值正好位于最接近的可用颜色之间的中间，则抖动的结果是棋盘图案。例如，50%的灰色数据可以作为黑白棋盘图案抖动。为了实现最佳抖动，量化误差的计数应具有足够的精度，以防止舍入误差影响结果。



在一些实现中，扫描的水平方向在两行之间交替；这被称为“蛇形扫描”或布斯特罗菲登变换抖动。



在下面的伪代码中，我们可以看到上面描述的算法。输入图像像素的值以浮点格式规范化为[0,1]，0（黑色）和1（白色）。


Floyd-Steinberg抖动是一种图像抖动算法，由罗伯特·弗洛伊德和路易斯·斯坦伯格于1976年首次出版。它通常由图像处理软件使用，例如当图像被转换为​​限制为最多256种颜色的GIF格式时。

该算法使用误差扩散实现抖动，这意味着它将像素的残余量化误差推送（相加）到其相邻像素上，以便稍后处理。它根据分布（显示为相邻像素的地图）展开债务：

用星号（\*）表示的像素表示当前正在扫描的像素，并且空白像素是先前扫描的像素。该算法从左到右，从上到下扫描图像，逐个量化像素值。每次量化误差被传送到相邻像素，同时不影响已经量化的像素。因此，如果向下舍入多个像素，则下一个像素向上舍入的可能性更大，使得平均来说量化误差接近于零。

扩散系数具有如下特性：如果原始像素值恰好在最近的可用颜色之间的中间，则抖动结果是棋盘图案。例如，50％的灰色数据可以作为黑白棋盘图案抖动。为了获得最佳抖动，量化误差的计数应足够精确，以防止舍入误差影响结果。

在一些实施方式中，水平扫描方向在线之间交替;这被称为“蛇形扫描”或boustrophedon变换抖动。

在下面的伪代码中，我们可以看到上述算法。输入图像的像素值以浮点格式标准化为[0,1]，0（黑色）和1（白色）。

```
for each y from top to bottom
  for each x from left to right
    oldpixel = pixel[x][y]
    newpixel = find_closest_palette_color(oldpixel)
    pixel[x][y] = newpixel
    quant_error = oldpixel - newpixel
    pixel[x + 1][y    ] += quant_error * 7 / 16
    pixel[x - 1][y + 1] += quant_error * 3 / 16
    pixel[x    ][y + 1] += quant_error * 5 / 16
    pixel[x + 1][y + 1] += quant_error * 1 / 16
```

加载图片，像素化

``` JavaScript
async function getImg() {
    const img = new Image()
    img.src = '/images/else/kid-s.jpg'
    await new Promise(resolve => img.addEventListener('load', resolve))
    const width = img.width
    const height = img.height
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, width, height)
    return {
        width,
        height,
        data: imageData.data
    }
}
```

处理

``` JavaScript
const px = (x, y) => x * 4 + y * width * 4

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const oldPixel = data[px(x, y)]
        const newPixel = oldPixel > 125 ? 255 : 0
        data[px(x, y)] = data[px(x, y) + 1] = data[px(x, y) + 2] = newPixel
        const quantError = oldPixel - newPixel

        data[px(x + 1, y    )] =
        data[px(x + 1, y    ) + 1] =
        data[px(x + 1, y    ) + 2] =
        data[px(x + 1, y    )] + quantError * 7 / 16

        data[px(x - 1, y + 1)] =
        data[px(x - 1, y + 1) + 1] =
        data[px(x - 1, y + 1) + 2] =
        data[px(x - 1, y + 1)] + quantError * 3 / 16

        data[px(x    , y + 1)] =
        data[px(x    , y + 1) + 1] =
        data[px(x    , y + 1) + 2] =
        data[px(x    , y + 1)] + quantError * 5 / 16

        data[px(x + 1, y + 1)] =
        data[px(x + 1, y + 1) + 1] =
        data[px(x + 1, y + 1) + 2] =
        data[px(x + 1, y + 1)] + quantError * 1 / 16
    }
}
```
ctx.putImageData()

<cite>参考：
https://beta.observablehq.com/@tmcw/dithering
https://beta.observablehq.com/@tmcw/final-step-of-dithering-to-svg</cite>

{% raw %}
<script>
async function getImg() {
    const img = new Image()
    img.src = '/images/else/kid-s.jpg'
    await new Promise(resolve => img.addEventListener('load', resolve))
    const width = img.width
    const height = img.height
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, width, height)
    return {
        width,
        height,
        data: imageData.data
    }
}


getImg().then(({ width, height, data }) => {

    const px = (x, y) => x * 4 + y * width * 4

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldPixel = data[px(x, y)]
            const newPixel = oldPixel > 125 ? 255 : 0
            data[px(x, y)] = data[px(x, y) + 1] = data[px(x, y) + 2] = newPixel
            const quantError = oldPixel - newPixel

            data[px(x + 1, y    )] =
            data[px(x + 1, y    ) + 1] =
            data[px(x + 1, y    ) + 2] =
            data[px(x + 1, y    )] + quantError * 7 / 16

            data[px(x - 1, y + 1)] =
            data[px(x - 1, y + 1) + 1] =
            data[px(x - 1, y + 1) + 2] =
            data[px(x - 1, y + 1)] + quantError * 3 / 16

            data[px(x    , y + 1)] =
            data[px(x    , y + 1) + 1] =
            data[px(x    , y + 1) + 2] =
            data[px(x    , y + 1)] + quantError * 5 / 16

            data[px(x + 1, y + 1)] =
            data[px(x + 1, y + 1) + 1] =
            data[px(x + 1, y + 1) + 2] =
            data[px(x + 1, y + 1)] + quantError * 1 / 16
        }
    }

    const w = width * 4
    let d = ''
    for (let i = 0; i < data.length; i += w) {
        const y = Math.floor(i / w)
        d += `M0, ${y}`
        let line = false
        for (let j = i; j < i + w; j += 4) {
            const co = `${(j % w) / 4}, ${y}`
            if (data[j] === 0) {
                if (!line) {
                    d += 'M' + co
                    line = true
                }
            } else {
                if (line) {
                    d += 'L' + co
                    line = false
                }
            }
        }
    }

    const svg = document.getElementById('dithering')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.innerHTML = `<path d="${d}" stroke="#232520" stroke-width="0.5" fill="none"></path>`

})
</script>
{% endraw %}
