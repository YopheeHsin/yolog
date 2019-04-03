---
title: 文本打散分离
date: 2019-04-03 00:00:00
categories: Uncategorized
keywords: SplitText, Lettering.js
description: 文本打散分离的原生JS实现
---

{% raw %}
<style>
.animation-wrapper {
	position: relative;
	width: 100%;
	min-height: 200px;
	padding-top: 40%;
	background: linear-gradient(to bottom, #405166 0%, #656f6f 100%);
	overflow: hidden;
	user-select: none;
}
.animation-wrapper > div {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -56%);
}
.animation-wrapper h3 {
	margin: 0;
	line-height: 40px;
	font-size: 36px;
	font-weight: 500;
	text-align: center;
	text-transform: uppercase;
	white-space: nowrap;
	transform: rotate(-10deg);
}
.animation-wrapper h3:nth-child(1) {
	color: #e55643;
}
.animation-wrapper h3:nth-child(2) {
	color: #2b9f5e;
}
.animation-wrapper h3:nth-child(3) {
	color: #f1c83c;
}
.animation-wrapper h3 span {
	display: inline-block;
	min-width: 10px;
	min-height: 40px;
	text-shadow: #533d4a 1px 1px, #533d4a 2px 2px, #533d4a 3px 3px, #533d4a 4px 4px, #533d4a 5px 5px, #533d4a 6px 6px;
	transform: skew(-10deg);
}
</style>

<div class="scrollable-wrapper">
	<div class="animation-wrapper"><div>
		<h3>The cloud</h3>
		<h3>wishes</h3>
		<h3>it were a bird</h3>
	</div></div>
</div>
{% endraw %}

实现类似上面的文字动画，需要DOM中将文本打散分离成单个字符。可用的工具有jQuery的Lettering.js，GreenSock动画平台的SplitText等插件。这里是文本打散分离的原生JS实现。

``` JavaScript
const splitText = (el, options = {}) => {
    const {
        splitRegex,
        tagName,
        classPrefix
    } = {
        splitRegex: null,
        tagName: 'span',
        classPrefix: 'char',
        ...options
    }

    // 删除空的、合并相邻的文本节点
    el.normalize()
    let count = 1

    const inject = el => {
        const parentNode = el.parentNode
        const str = el.nodeValue
        const split = splitRegex ? str.split(splitRegex) : str
        const l = split.length
        let i = -1
        while (++i < l) {
            const node = document.createElement(tagName)
            if (classPrefix) {
                node.className = classPrefix + count
                count++
            }
            node.appendChild(document.createTextNode(split[i]))
            node.setAttribute('aria-hidden', 'true')
            parentNode.insertBefore(node, el)
        }
        if (str.trim() !== '') {
            // 无障碍
            parentNode.setAttribute('aria-label', str)
        }
        parentNode.removeChild(el)
    }

    (function traverse(el) {
        // el为文本节点
        if (el.nodeType === 3) {
            return inject(el)
        }

        const childNodes = [].slice.call(el.childNodes)
        const l = childNodes.length

        // el只有一个子文本节点
        if (l === 1 && childNodes[0].nodeType === 3) {
            return inject(childNodes[0])
        }

        // el有多个子文本节点
        let i = -1
        while (++i < l) {
            traverse(childNodes[i])
        }
    }(el))
}
```

<cite>参考：https://github.com/yuanqing/charming</cite>


{% raw %}
<script src='/scripts/TweenMax.min.js'></script>
<script>
const splitText = (el, options = {}) => {
	const {
		splitRegex,
		tagName,
		classPrefix
	} = {
		splitRegex: null,
		tagName: 'span',
		classPrefix: 'char',
		...options
	}

	el.normalize()
	let count = 1

	const inject = el => {
		const parentNode = el.parentNode
		const str = el.nodeValue
		const split = splitRegex ? str.split(splitRegex) : str
		const l = split.length
		let i = -1
		while (++i < l) {
			const node = document.createElement(tagName)
			if (classPrefix) {
				node.className = classPrefix + count
				count++
			}
			node.appendChild(document.createTextNode(split[i]))
			node.setAttribute('aria-hidden', 'true')
			parentNode.insertBefore(node, el)
		}
		if (str.trim() !== '') {
			parentNode.setAttribute('aria-label', str)
		}
		parentNode.removeChild(el)
	}

	(function traverse(el) {
		if (el.nodeType === 3) {
			return inject(el)
		}

		const childNodes = [].slice.call(el.childNodes)
		const l = childNodes.length

		if (l === 1 && childNodes[0].nodeType === 3) {
			return inject(childNodes[0])
		}

		let i = -1
		while (++i < l) {
			traverse(childNodes[i])
		}
	}(el))
}

(function run() {
	const wrapper = document.querySelector('.animation-wrapper')
	const lines = wrapper.querySelectorAll('h3')
	Array.prototype.forEach.call(lines, line => splitText(line))
	const els = wrapper.querySelectorAll('span')

	new TimelineMax({
		repeat: -1
	}).staggerFromTo(els, .5, {
		opacity: 0,
		y: 90
	}, {
		ease: Back.easeOut.config(1.8),
		opacity: 1,
		y: 0
	}, .05, .5).staggerTo(els, .5, {
		opacity: 0,
		y: -90
	}, .05, '+=1.5')
}())
</script>
{% endraw %}
