---
title: 响应鼠标位置的parallax视差效果
date: 2019-07-09 00:00:00
categories: Uncategorized
keywords: 视差, parallax.js
description: 响应鼠标位置的视差效果的具体实现，运动元素各自设置不同的深度值，对鼠标位置作不同程度的响应
---

{% raw %}
<style>
.scene-wrapper { width: 100%; height: auto; margin-bottom: 2em; background-color: #232520; }
.scene { position: relative; width: 100%; max-width: 300px; margin: 0 auto; }
.scene > * { position: absolute; }
.scene > *:nth-child(1) { opacity: .15; }
.scene > *:nth-child(2) { opacity: .3; }
.scene > *:nth-child(3) { opacity: .45; }
.scene > *:nth-child(4) { opacity: .6; }
.scene > *:nth-child(5) { opacity: .75; }
.scene > *:nth-child(6) { opacity: .9; }
.scene img { margin: 0; }
</style>

<div class="scene-wrapper">
	<div class="scene">
		<div data-depth="1.0"><img src="/images/parallax/layer1.png"></div>
		<div data-depth="0.8"><img src="/images/parallax/layer2.png"></div>
		<div data-depth="0.6"><img src="/images/parallax/layer3.png"></div>
		<div data-depth="0.4"><img src="/images/parallax/layer4.png"></div>
		<div data-depth="0.2"><img src="/images/parallax/layer5.png"></div>
		<div data-depth="0.0"><img src="/images/parallax/layer6.png"></div>
	</div>
</div>
{% endraw %}

网页中的视差效果是指，页面中不同元素以不同的速度运动，形成z方向上接近3D的视觉感受。这里是响应鼠标位置的视差效果的具体实现，运动元素各自设置不同的深度值，对鼠标位置作不同程度的响应。

HTML结构如下，运动元素用data-depth设置不同的深度值。

``` HTML
<div class="scene">
    <div data-depth="1.0"><img src="layer1.png"></div>
    <div data-depth="0.8"><img src="layer2.png"></div>
    <!-- 省略... -->
    <div data-depth="0.0"><img src="layer6.png"></div>
</div>
```

视差引擎类，指定运动场景，设置响应鼠标的窗口尺寸，绑定事件，使用requestAnimationFrame更新动画。

``` JavaScript
class Parallax {
    constructor(element, options) {
        this.element = element
        this.elementWidth = 0
        this.elementHeight = 0
        this.depthsX = []
        this.depthsY = []

        const DEFAULTS = {
            frictionX: 0.1,
            frictionY: 0.1,
            originX: 0.5,
            originY: 0.5
        }

        Object.assign(this, DEFAULTS, options)

        this.inputX = 0
        this.inputY = 0

        this.velocityX = 0
        this.velocityY = 0

        this.windowWidth = 0
        this.windowHeight = 0
        this.windowCenterX = 0
        this.windowCenterY = 0
        this.windowRadiusX = 0
        this.windowRadiusY = 0

        this.raf = null

        this.onWindowResize = this.onWindowResize.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onAnimationFrame = this.onAnimationFrame.bind(this)

        this.initialise()
    }

    initialise() {
        helpers.accelerate(this.element)

        let style = window.getComputedStyle(this.element)
        if (style.getPropertyValue('position') === 'static') {
            this.element.style.position = 'relative'
        }
        this.element.style.pointerEvents = 'none'

        this.updateLayers()
        window.onload = () => {
            this.updateDimensions()
        }

        window.addEventListener('resize', this.onWindowResize)
        window.addEventListener('mousemove', this.onMouseMove)
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }

    updateLayers() {
        this.layers = this.element.children

        for (let index = 0; index < this.layers.length; index++) {
            let layer = this.layers[index]

            helpers.accelerate(layer)

            layer.style.position = index ? 'absolute' : 'relative'
            layer.style.display = 'block'
            layer.style.left = 0
            layer.style.top = 0

            let depth = helpers.data(layer, 'depth') || 0
            this.depthsX.push(helpers.data(layer, 'depth-x') || depth)
            this.depthsY.push(helpers.data(layer, 'depth-y') || depth)
        }
    }

    updateDimensions() {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.windowCenterX = this.windowWidth * this.originX
        this.windowCenterY = this.windowHeight * this.originY
        this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX)
        this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY)

        const bounds = this.element.getBoundingClientRect()
        this.elementWidth = bounds.width
        this.elementHeight = bounds.height
    }

    setPosition(element, x, y) {
        x = x.toFixed(1) + 'px'
        y = y.toFixed(1) + 'px'
        helpers.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)')
    }

    onWindowResize() {
        this.updateDimensions()
    }

    onMouseMove(event) {
        let clientX = event.clientX,
            clientY = event.clientY

        if (this.windowRadiusX && this.windowRadiusY) {
            this.inputX = (clientX - this.windowCenterX) / this.windowRadiusX
            this.inputY = (clientY - this.windowCenterY) / this.windowRadiusY
        }
    }

    onAnimationFrame() {
        this.velocityX += (this.inputX * this.elementWidth * 0.1 - this.velocityX) * this.frictionX
        this.velocityY += (this.inputY * this.elementHeight * 0.1 - this.velocityY) * this.frictionY
        for (let index = 0; index < this.layers.length; index++) {
            let layer = this.layers[index],
                xOffset = -this.velocityX * this.depthsX[index],
                yOffset = -this.velocityY * this.depthsY[index]
            this.setPosition(layer, xOffset, yOffset)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }
}
```

实例化，指定响应场景元素。

``` JavaScript
const scene = document.querySelector('.scene')
new Parallax(scene)
```

除了PC端的鼠标事件，也可监听移动设备方向和运动相关的事件deviceorientation和devicemotion。

<cite>参考：https://github.com/wagerfield/parallax</cite>


{% raw %}
<script>
const helpers = {
	propertyCache: {},

	data(element, name) {
		return parseFloat(element.getAttribute('data-' + name) || 0)
	},

	camelCase(value) {
		return value.replace(/-+(.)?/g, (match, character) => {
			return character ? character.toUpperCase() : ''
		})
	},

	css(element, property, value) {
		const vendors = [null, 'webkit', 'Moz', 'O', 'ms']
		let jsProperty = helpers.propertyCache[property]
		if (!jsProperty) {
			for (let i = 0, l = vendors.length; i < l; i++) {
				if (vendors[i] !== null) {
					jsProperty = helpers.camelCase(vendors[i] + '-' + property)
				} else {
					jsProperty = property
				}
				if (element.style[jsProperty] !== undefined) {
					helpers.propertyCache[property] = jsProperty
					break
				}
			}
		}
		element.style[jsProperty] = value
	},

	accelerate(element) {
		helpers.css(element, 'transform', 'translate3d(0,0,0)')
		helpers.css(element, 'transform-style', 'preserve-3d')
		helpers.css(element, 'backface-visibility', 'hidden')
	}
}


class Parallax {
	constructor(element, options) {
		this.element = element
		this.elementWidth = 0
		this.elementHeight = 0
		this.depthsX = []
		this.depthsY = []

		const DEFAULTS = {
			frictionX: 0.1,
			frictionY: 0.1,
			originX: 0.5,
			originY: 0.5
		}

		Object.assign(this, DEFAULTS, options)

		this.inputX = 0
		this.inputY = 0

		this.velocityX = 0
		this.velocityY = 0

		this.windowWidth = 0
		this.windowHeight = 0
		this.windowCenterX = 0
		this.windowCenterY = 0
		this.windowRadiusX = 0
		this.windowRadiusY = 0

		this.raf = null

		this.onWindowResize = this.onWindowResize.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onAnimationFrame = this.onAnimationFrame.bind(this)

		this.initialise()
	}

	initialise() {
		helpers.accelerate(this.element)

		let style = window.getComputedStyle(this.element)
		if (style.getPropertyValue('position') === 'static') {
			this.element.style.position = 'relative'
		}
		this.element.style.pointerEvents = 'none'

		this.updateLayers()
		window.onload = () => {
			this.updateDimensions()
		}

		window.addEventListener('resize', this.onWindowResize)
		window.addEventListener('mousemove', this.onMouseMove)
		this.raf = requestAnimationFrame(this.onAnimationFrame)
	}

	updateLayers() {
		this.layers = this.element.children

		for (let index = 0; index < this.layers.length; index++) {
			let layer = this.layers[index]

			helpers.accelerate(layer)

			layer.style.position = index ? 'absolute' : 'relative'
			layer.style.display = 'block'
			layer.style.left = 0
			layer.style.top = 0

			let depth = helpers.data(layer, 'depth') || 0
			this.depthsX.push(helpers.data(layer, 'depth-x') || depth)
			this.depthsY.push(helpers.data(layer, 'depth-y') || depth)
		}
	}

	updateDimensions() {
		this.windowWidth = window.innerWidth
		this.windowHeight = window.innerHeight
		this.windowCenterX = this.windowWidth * this.originX
		this.windowCenterY = this.windowHeight * this.originY
		this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX)
		this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY)

		const bounds = this.element.getBoundingClientRect()
		this.elementWidth = bounds.width
		this.elementHeight = bounds.height
	}

	setPosition(element, x, y) {
		x = x.toFixed(1) + 'px'
		y = y.toFixed(1) + 'px'
		helpers.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)')
	}

	onWindowResize() {
		this.updateDimensions()
	}

	onMouseMove(event) {
		let clientX = event.clientX,
			clientY = event.clientY

		if (this.windowRadiusX && this.windowRadiusY) {
			this.inputX = (clientX - this.windowCenterX) / this.windowRadiusX
			this.inputY = (clientY - this.windowCenterY) / this.windowRadiusY
		}
	}

	onAnimationFrame() {
		this.velocityX += (this.inputX * this.elementWidth * 0.1 - this.velocityX) * this.frictionX
		this.velocityY += (this.inputY * this.elementHeight * 0.1 - this.velocityY) * this.frictionY
		for (let index = 0; index < this.layers.length; index++) {
			let layer = this.layers[index],
				xOffset = -this.velocityX * this.depthsX[index],
				yOffset = -this.velocityY * this.depthsY[index]
			this.setPosition(layer, xOffset, yOffset)
		}
		this.raf = requestAnimationFrame(this.onAnimationFrame)
	}
}


const scene = document.querySelector('.scene')
new Parallax(scene)
</script>
{% endraw %}
