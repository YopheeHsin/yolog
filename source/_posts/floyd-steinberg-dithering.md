---
title: Floyd-Steinberg扩散抖动算法
date: 2019-01-04 00:00:00
categories: Uncategorized
keywords: Floyd-Steinberg, 扩散抖动算法, canvas
description: 图像处理中Floyd-Steinberg扩散抖动算法在JavaScript中的具体实现
---

Floyd-Steinberg扩散抖动算法，用在图像处理中，例如将图像转换成最多256色的GIF格式。

该算法利用误差扩散实现抖动，从左到右、由上至下扫描图像的像素并将其逐个标准化（或二值化），把像素标准化后产生的误差叠加到相邻像素上，不影响已经处理过的像素。这样实现的效果是，如果某些像素向下取整，则下一个像素向上取整的可能性更大，这样使得平均量化误差最小。

下面伪代码中，输入图像的像素被标准化为[0, 1]，0为黑色，1为白色。

```
for each y from top to bottom
  for each x from left to right
    oldpixel = pixel[x][y]
    newpixel = round(oldpixel / 255)
    pixel[x][y] = newpixel
    quant_error = oldpixel - newpixel
    pixel[x + 1][y    ] += quant_error * 7 / 16
    pixel[x - 1][y + 1] += quant_error * 3 / 16
    pixel[x    ][y + 1] += quant_error * 5 / 16
    pixel[x + 1][y + 1] += quant_error * 1 / 16
```

下面是Floyd-Steinberg扩散抖动算法在JS中的具体实现。

## 图片像素

异步加载图片，用canvas做中介，将图片绘制到canvas画布上，使用画布的getImageData方法获取图片像素信息，该方法返回的imageData对象的data数组中，每个像素储存有四条信息，其中：

- R - 红色 (0-255)
- G - 绿色 (0-255)
- B - 蓝色 (0-255)
- A - alpha通道 (0-255 0透明 255完全可见)

<div class="scrollable-wrapper"><img src="/images/else/kid-l.jpg" width="280"></div>

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

## 扩散抖动

为简化演示，这里使用了不含色彩信息的灰度图像，其像素点的R、G和B数值是相同的；图片格式为JPG，无半透明效果，即alpha通道数值均为255。

根据imageData的数据形式，这里像素数据每4个一组进行处理。

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

## 结果展示

处理结果这里使用SVG展示，也可以使用canvas画布的putImageData方法绘制。可以看到Floyd-Steinberg处理后的图像比较细腻、失真较小、细节丰富。

<div class="scrollable-wrapper"><svg id="dithering"></svg></div>

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
