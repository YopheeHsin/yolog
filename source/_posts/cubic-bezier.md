---
title: cubic-bezier三次贝塞尔时间函数
date: 2018-12-30 00:00:00
categories: Uncategorized
keywords: cubic-bezier, 三次贝塞尔, Vue, SVG
description: 用Vue实现响应式SVG来简单模拟cubic-bezier三次贝塞尔时间函数
---

{% raw %}
<style>
#app p {
	text-align: center;
}
.svg-wrapper {
	margin-top: 1.25em;
}
.svg-wrapper svg {
	position: relative;
	display: block;
	margin: 0 auto;
	overflow: visible;
	-webkit-touch-callout: none;
	-webkit-user-select:none;
	user-select: none;
}
svg circle.draggable {
	fill: #f2f6ed;
	transition: all .1s;
	cursor: move;
}
svg circle.draggable:hover {
	stroke: #232520;
}
@keyframes animation{
	from { cy: 200 }
	to { cy: 0 }
}
</style>

<div id="app">
	<div class="svg-wrapper">
		<svg width="280" height="280">
			<defs>
				<marker id="arrow" markerWidth="6" markerHeight="6" refx="0" refy="3" orient="auto">
					<path d="M0,0 L0,6 L6,3 Z" fill="#83887c"></path>
				</marker>
			</defs>
			<g transform="translate(20, 40)" stroke="#83887c" fill="none">
				<g stroke-dasharray="3 2">
					<rect width="200" height="200"></rect>
					<line x1="0" y1="0" x2="0" y2="-20" marker-end="url(#arrow)"></line>
					<line x1="200" y1="200" x2="220" y2="200" marker-end="url(#arrow)"></line>
				</g>
				<g fill="#83887c">
					<circle cx="0" cy="200" r="3"></circle>
					<circle cx="200" cy="0" r="3"></circle>
				</g>
				<g stroke="none" fill="#83887c" font-size="12">
					<text x="5" y="215">time ratio</text>
					<g transform="translate(-8, 198), rotate(-90)">
						<text>output ratio</text>
					</g>
				</g>
				<g stroke="#d7dcd2">
					<line x1="250" y1="0" x2="250" y2="200"></line>
					<line x1="240" y1="0" x2="260" y2="0"></line>
					<line x1="240" y1="200" x2="260" y2="200"></line>
				</g>
				<g fill="#0791c6">
					<circle cx="250" cy="200" r="4.5"
					:style="{ animation: `animation 2s ${cubicBezierStr} infinite alternate` }"></circle>
				</g>
				<g stroke-width="1.5">
					<path :d="`M0,200 C${x1},${y1} ${x2},${y2} 200,0`"></path>
					<line :x1="x1" :y1="y1" x2="0" y2="200"></line>
					<line x1="200" y1="0" :x2="x2" :y2="y2"></line>
				</g>
				<g :transform="`translate(${x1}, ${y1})`"
					@mousedown="handleStart($event, 1)"
					@touchstart="handleStart($event, 1)">
					<circle r="6" class="draggable"></circle>
				</g>
				<g :transform="`translate(${x2}, ${y2})`"
					@mousedown="handleStart($event, 2)"
					@touchstart="handleStart($event, 2)">
					<circle r="6" class="draggable"></circle>
				</g>
			</g>
		</svg>
	</div>

	<p>{{ cubicBezierStr }}</p>
</div>
{% endraw %}

用在CSS的transition或者animation动画中的时间函数timing-function，描述在过渡或动画中一维数值的速度改变，通常称为缓动函数。

三次/立方贝塞尔曲线（cubic Bézier curves）是CSS时间函数常用的一种。语法为：

``` CSS
cubic-bezier(x1, y1, x2, y2)
```

- 横轴为时间比例（time ratio），纵轴为完成状态（output ratio）

- 曲线由四个点来定义，P<sub>0</sub>、P<sub>1</sub>、P<sub>2</sub>和P<sub>3</sub>

- P<sub>0</sub>(0, 0)和P<sub>3</sub>(1, 1)是固定在坐标系上的起点和终点

- 语法中x1, y1, x2, y2表示两个过渡点P<sub>1</sub>和P<sub>2</sub>的横纵坐标

- x1和x2是时间值，必须在[0, 1]范围内

- y1和y2可以是负数或者大于1，从而实现弹跳动画效果

- y值超过实际允许范围（比如颜色值大于255或小于0）会被修改为允许范围内的最接近值

常用的命名过渡效果，等同于某些数值的cubic-bezier。

名称 | 过渡效果 | 等同于
--- | --- | ---
linear | 以相同速度开始至结束 | cubic-bezier(0, 0, 1, 1)
ease | 慢速开始，然后变快，然后慢速结束 | cubic-bezier(.25, .1, .25, 1)
ease-in | 慢速开始 | cubic-bezier(.42, 0, 1, 1)
ease-out | 慢速结束 | cubic-bezier(0, 0, .58, 1)
ease-in-out | 慢速开始和结束 | cubic-bezier(.42, 0, .58, 1)

本页面用Vue实现响应式SVG来简单模拟cubic-bezier三次贝塞尔时间函数。

SVG画布和cubic-bezier过渡点的坐标系不同需要分别定义。

``` JavaScript
data: {
    // SVG画布中的坐标
    x1: 50,
    y1: 180,
    x2: 50,
    y2: 0,

    // cubic-bezier过渡点的坐标
    cx1: 0.25,
    cy1: 0.1,
    cx2: 0.25,
    cy2: 1,
}
```

坐标转换，将时间值约束在[0, 1]范围内。

``` JavaScript
computed: {
    cubicBezierStr() {
        const f = n => {
            let r = String(n.toFixed(2))
            r = r.replace(/^0+|0+$/g, '')
            r = r.replace(/\.$/, '')
            if (r === '') r = 0
            return r
        }
        const { x1, y1, x2, y2 } = this
        const cx1 = x1 / 200
        const cy1 = (200 - y1) / 200
        const cx2 = x2 / 200
        const cy2 = (200 - y2) / 200
        return `cubic-bezier(${f(cx1)}, ${f(cy1)}, ${f(cx2)}, ${f(cy2)})`
    }
}
```

实现过渡点的拖动与计算，兼容桌面和移动设备mousemove/touchmove。

``` JavaScript
methods: {
    handleStart(event, point) {
    	event.preventDefault()
        const isTouch = !!event.touches
        if (isTouch && event.touches.length > 1) return
        if (isTouch) event = event.touches[0]

        const { x1, y1, x2, y2 } = this
        this.dragState = {
            dragging: true,
            left: event.clientX,
            top: event.clientY
        }

        document.onselectstart = () => false
        document.ondragstart = () => false

        const handleMove = event => {
            event.preventDefault()
            if (isTouch) event = event.touches[0]

            const constrain = n => Math.min(Math.max(0, n), 200)
            const deltaLeft = event.clientX - this.dragState.left
            const deltaTop = event.clientY - this.dragState.top
            if (point === 1) {
                this.x1 = constrain(x1 + deltaLeft)
                this.y1 = y1 + deltaTop
            } else if (point === 2) {
                this.x2 = constrain(x2 + deltaLeft)
                this.y2 = y2 + deltaTop
            }
        }

        const handleEnd = () => {
            this.dragState.dragging = false
            if (isTouch) {
                document.removeEventListener('touchmove', handleMove)
                document.removeEventListener('touchend', handleEnd)
            } else {
                document.removeEventListener('mousemove', handleMove)
                document.removeEventListener('mouseup', handleEnd)
            }
            document.onselectstart = null
            document.ondragstart = null
        }

        if (isTouch) {
            document.addEventListener('touchmove', handleMove, {
                passive: false
            })
            document.addEventListener('touchend', handleEnd)
        } else {
            document.addEventListener('mousemove', handleMove)
            document.addEventListener('mouseup', handleEnd)
        }
    }
}
```


{% raw %}
<script src="/scripts/vue.min.js"></script>
<script>
const app = new Vue({
    el: '#app',

    data: {
        x1: 50,
        y1: 180,
        x2: 50,
        y2: 0,

        cx1: 0.25,
        cy1: 0.1,
        cx2: 0.25,
        cy2: 1,

        dragState: {
            dragging: false,
            left: 0,
            top: 0,
        }
    },

    computed: {
        cubicBezierStr() {
            const f = n => {
                let r = String(n.toFixed(2))
                r = r.replace(/^0+|0+$/g, '')
                r = r.replace(/\.$/, '')
                if (r === '') r = 0
                return r
            }
            const { x1, y1, x2, y2 } = this
            const cx1 = x1 / 200
            const cy1 = (200 - y1) / 200
            const cx2 = x2 / 200
            const cy2 = (200 - y2) / 200
            return `cubic-bezier(${f(cx1)}, ${f(cy1)}, ${f(cx2)}, ${f(cy2)})`
        }
    },

    methods: {
        handleStart(event, point) {
        	event.preventDefault()
            const isTouch = !!event.touches
            if (isTouch && event.touches.length > 1) return
            if (isTouch) event = event.touches[0]

            const { x1, y1, x2, y2 } = this
            this.dragState = {
                dragging: true,
                left: event.clientX,
                top: event.clientY
            }

            document.onselectstart = () => false
            document.ondragstart = () => false

            const handleMove = event => {
                event.preventDefault()
                if (isTouch) event = event.touches[0]

                const constrain = n => Math.min(Math.max(0, n), 200)
                const deltaLeft = event.clientX - this.dragState.left
                const deltaTop = event.clientY - this.dragState.top
                if (point === 1) {
                    this.x1 = constrain(x1 + deltaLeft)
                    this.y1 = y1 + deltaTop
                } else if (point === 2) {
                    this.x2 = constrain(x2 + deltaLeft)
                    this.y2 = y2 + deltaTop
                }
            }

            const handleEnd = () => {
                this.dragState.dragging = false
                if (isTouch) {
                    document.removeEventListener('touchmove', handleMove)
                    document.removeEventListener('touchend', handleEnd)
                } else {
                    document.removeEventListener('mousemove', handleMove)
                    document.removeEventListener('mouseup', handleEnd)
                }
                document.onselectstart = null
                document.ondragstart = null
            }

            if (isTouch) {
                document.addEventListener('touchmove', handleMove, {
                    passive: false
                })
                document.addEventListener('touchend', handleEnd)
            } else {
                document.addEventListener('mousemove', handleMove)
                document.addEventListener('mouseup', handleEnd)
            }
        }
    }
})
</script>
{% endraw %}
