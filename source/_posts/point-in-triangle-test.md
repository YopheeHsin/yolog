---
title: 用坐标判断点是否在三角形内部
date: 2019-04-22 00:00:00
categories: Uncategorized
keywords: 向量, 平面几何, JavaScript
description: 使用各点的坐标计算向量a、b、c和p，进而判断点P是否在三角形ABC内部
---

{% raw %}
<div class="scrollable-wrapper">
	<svg id="triangle" :width="w" :height="h" @click="onClick">
		<defs>
			<pattern id="dotOut" patternUnits="userSpaceOnUse" width="12" height="12">
				<circle cx="6" cy="6" r="1" fill="#d7dcd2" stroke-width="0"></circle>
			</pattern>
			<pattern id="dotIn" patternUnits="userSpaceOnUse" width="12" height="12">
				<circle cx="6" cy="6" r="1.5" fill="#83887c" stroke-width="0"></circle>
			</pattern>
		</defs>
		<rect x="0" y="0" :width="w" :height="h" style="fill: url(#dotOut)"></rect>
		<path :d="d" stroke="#83887c" :fill="inTriangle ? 'url(#dotIn)' : 'none'"></path>
		<circle :cx="x" :cy="y" r="4" stroke="#f2f6ed" stroke-width="3" fill="#0791c6"></circle>
		<circle :cx="x" :cy="y" r="6" stroke="#0791c6" stroke-width="1" fill="none"></circle>
	</svg>
</div>
<p style="margin-top:-1.25em; text-align:center; color:#83887c">点击改变点的位置</p>
{% endraw %}

平面上的3个点构成三角形ABC，点P可用向量表示为：

{% raw %}
\[P = A + u\left( {C - A} \right) + v\left( {B - A} \right)\]
{% endraw %}

点P是否在三角形ABC内部，判定条件为：

{% raw %}
\[\left\{ \begin{gathered}
  u \geqslant 0 \hfill \\
  v \geqslant 0 \hfill \\
  u + v \leqslant 1 \hfill \\ 
\end{gathered}  \right.\]
{% endraw %}

用x表示向量差X-A，可将点P的向量表示等式转化为：

{% raw %}
\[p = uc + vb\]
{% endraw %}

等式两边同时点乘c或b，得到方程组：

{% raw %}
\[\left\{ \begin{gathered}
  p \cdot c = u\left( {c \cdot c} \right) + v\left( {b \cdot c} \right) \hfill \\
  p \cdot b = u\left( {c \cdot b} \right) + v\left( {b \cdot b} \right) \hfill \\ 
\end{gathered}  \right.\]
{% endraw %}

解方程组得：

{% raw %}
\[u = \frac{{\left( {p \cdot c} \right)\left( {b \cdot b} \right) - \left( {b \cdot c} \right)\left( {p \cdot b} \right)}}{{\left( {c \cdot c} \right)\left( {b \cdot b} \right) - \left( {b \cdot c} \right)\left( {b \cdot c} \right)}}\]
{% endraw %}

{% raw %}
\[v = \frac{{\left( {p \cdot b} \right)\left( {c \cdot c} \right) - \left( {p \cdot c} \right)\left( {c \cdot b} \right)}}{{\left( {c \cdot c} \right)\left( {b \cdot b} \right) - \left( {b \cdot c} \right)\left( {b \cdot c} \right)}}\]
{% endraw %}

这样就可以使用各点的坐标计算向量a、b、c和p，进而判断点P是否在三角形ABC内部。

<cite>参考：https://observablehq.com/@kelleyvanevert/2d-point-in-triangle-test</cite>


{% raw %}
<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>
<script src="/scripts/vue.min.js"></script>
<script>
const app = new Vue({
	el: '#triangle',

	data: {
		w: 0,
		h: 0,
		x: 0,
		y: 0,
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0,
		x3: 0,
		y3: 0
	},

	computed: {
		d() {
			const t = this
			return `M${t.x1},${t.y1} L${t.x2},${t.y2} L${t.x3},${t.y3} Z`
		},
		inTriangle() {
			const t = this
			const A = [t.x1, t.y1]
			const B = [t.x2, t.y2]
			const C = [t.x3, t.y3]
			const P = [t.x, t.y]
			const sub = ([a, b], [d, e]) => [a - d, b - e]
			const dot = ([a, b], [d, e]) => a * d + b * e
			const uv = () => {
				const c = sub(C, A)
				const b = sub(B, A)
				const p = sub(P, A)
				const cc = dot(c, c)
				const bc = dot(b, c)
				const pc = dot(c, p)
				const bb = dot(b, b)
				const pb = dot(b, p)
				const denom = cc * bb - bc * bc
				const u = (bb * pc - bc * pb) / denom
				const v = (cc * pb - bc * pc) / denom
				return [u, v]
			}
			const [u, v] = uv()
			return (u >= 0) && (v >= 0) && (u + v <= 1)
		}
	},

	methods: {
		onClick(event) {
			const el = document.querySelector('#triangle')
			const { left, top } = el.getBoundingClientRect()
			const { clientX, clientY } = event
			this.x = clientX - left
			this.y = clientY - top
		}
	},

	mounted() {
		this.w = Math.round(document.querySelector('#triangle').parentNode.clientWidth)
		this.h = Math.round(this.w * 0.4)
		this.x = Math.round(this.w / 2)
		this.y = Math.round(this.h / 2)

		const { w, h } = this
		const f = (max, min) => Math.floor(min + Math.random() * (max - min))
		this.x1 = f(0, w / 3)
		this.y1 = f(0, h / 3)
		this.x2 = f(w * 2 / 3, w)
		this.y2 = f(0, h / 3)
		this.x3 = f(w / 3, w * 2 / 3)
		this.y3 = f(h * 2 / 3, h)
	}
})
</script>
{% endraw %}
