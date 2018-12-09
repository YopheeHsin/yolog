---
title: 绘制D3树状图tree和集群图cluster
categories: D3.js
keywords: 'D3, D3.js'
description: d3
date: 2018-12-08 00:00:00
tags:
---

<div class="scrollable-wrapper"><svg id="d3"></svg></div>

## 画布

D3可以使用HTML、SVG或者Canvas展示数据，这里使用SVG。

``` HTML
<svg id="d3"></svg>
```

## 数据

JSON格式的初始层次结构数据，name是节点名称，children是子节点。没有children的是叶子节点。

``` JavaScript
const data = {
    name: '贾家',
    children: [{
        name: '宁国公',
        children: [{
            name: '贾代化',
            children: [{
                name: '贾敬',
                children: [{
                    name: '贾珍(妻尤氏)',
                    children: [{
                        name: '贾蓉(妻可卿)'
                    }]
                }, {
                    name: '惜春'
                }]
            }]
        }]
    }, {
        name: '荣国公',
        children: [{
            name: '贾代善(妻贾母)',
            children: [{
                name: '贾赦(妻邢夫人)',
                children: [{
                    name: '贾琏(妻王熙凤)',
                    children: [{
                        name: '巧姐'
                    }]
                }, {
                    name: '迎春'
                }, {
                    name: '贾琮'
                }]
            }, {
                name: '贾政(妻王夫人)',
                children: [{
                    name: '贾珠(妻李纨)',
                    children: [{
                        name: '贾兰'
                    }]
                }, {
                    name: '元春'
                }, {
                    name: '宝玉'
                }, {
                    name: '贾环'
                }, {
                    name: '探春'
                }]
            }]
        }]
    }]
};
```

## 尺寸

SVG画布的宽度width固定，使用同父元素相同的宽度，而高度height根据树状图的节点层次动态计算。

D3树状图的默认布局是将各节点坐标安排成一颗由上到下逐渐展开的竖直的树，而这里要绘制的树是由左至右展开的，所以树状图图中的x，y坐标需要跟画布对掉。dx表示树状图纵向的节点尺寸固定为20，dy表示横向的节点尺寸，根据SVG画布的宽度和树状图横向的最深节点数目计算。

``` JavaScript
// SVG画布的宽度最少为500
const width = Math.max(document.querySelector('svg#d3').parentNode.clientWidth, 600)
let height
const dx = 20
let dy
```

## 层次化

``` JavaScript
const hierarchy = d3.hierarchy(data)
// 如果需要对同级数据排序
// hierarchy.sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name))

dy = width / (hierarchy.height + 1) - 5;
```

返回的节点和每一个后代会被附加如下属性:

- node.data 当前节点关联的原始数据
- node.depth 当前节点的深度，根节点为0
- node.height 当前节点的高度，叶节点为0
- node.parent 当前节点的父节点，根节点为null
- node.children 当前节点的子节点，叶节点为undefined

## 树布局

``` JavaScript
// const root = d3.cluster()
const root = d3.tree().nodeSize([dx, dy])(hierarchy);
// console.log(root);

let min = Infinity;
let max = -min;
root.each(d => {
	if (d.x > max) max = d.x;
	if (d.x < min) min = d.x;
});
height = max - min + dx * 2
```

## 绘图

选择SVG画布，设置其宽高度。

``` JavaScript
const svg = d3.select('svg#d3')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
```

建立分组，统一设置字体大小，调整绘图元素位置。

``` JavaScript
const g = svg.append('g')
    .attr('font-size', 12)
    .attr('transform', `translate(${dy / 3}, ${dx - min})`)
```

``` JavaScript
const link = g.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .enter().append('path')
    .attr('d', d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + dy / 2},${d.target.x}
        ${d.source.y + dy / 2},${d.source.x}
        ${d.source.y},${d.source.x}
    `)
```

``` JavaScript
const node = g.append('g')
	.attr('stroke-linejoin', 'round')
	.attr('stroke-width', 3)
	.selectAll('g')
	.data(root.descendants().reverse())
	.enter().append('g')
	.attr('transform', d => `translate(${d.y},${d.x})`);

node.append('circle')
	.attr('fill', '#555')
	.attr('r', 2.5)
```

``` JavaScript
node.append('text')
	.attr('dy', '0.31em')
	.attr('x', d => d.children ? -6 : 6)
	.text(d => d.data.name)
	.filter(d => d.children)
	.attr('text-anchor', 'end')
	.clone(true).lower()
	.attr('stroke', '#f2f6ed')
```


{% raw %}
<script src='/scripts/d3.v5.min.js'></script>
<script>
const data = {
    name: '贾家',
    children: [{
        name: '宁国公',
        children: [{
            name: '贾代化',
            children: [{
                name: '贾敬',
                children: [{
                    name: '贾珍(妻尤氏)',
                    children: [{
                        name: '贾蓉(妻可卿)'
                    }]
                }, {
                    name: '惜春'
                }]
            }]
        }]
    }, {
        name: '荣国公',
        children: [{
            name: '贾代善(妻贾母)',
            children: [{
                name: '贾赦(妻邢夫人)',
                children: [{
                    name: '贾琏(妻王熙凤)',
                    children: [{
                        name: '巧姐'
                    }]
                }, {
                    name: '迎春'
                }, {
                    name: '贾琮'
                }]
            }, {
                name: '贾政(妻王夫人)',
                children: [{
                    name: '贾珠(妻李纨)',
                    children: [{
                        name: '贾兰'
                    }]
                }, {
                    name: '元春'
                }, {
                    name: '宝玉'
                }, {
                    name: '贾环'
                }, {
                    name: '探春'
                }]
            }]
        }]
    }]
}

const width = Math.max(document.querySelector('svg#d3').parentNode.clientWidth, 600)
let height
const dx = 20
let dy

const hierarchy = d3.hierarchy(data)
// hierarchy.sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name))

dy = width / (hierarchy.height + 1) - 5;

const root = d3.tree().nodeSize([dx, dy])(hierarchy);
// const root = d3.cluster()
// console.log(root);

let min = Infinity;
let max = -min;
root.each(d => {
    if (d.x > max) max = d.x;
    if (d.x < min) min = d.x;
});
height = max - min + dx * 2


const svg = d3.select('svg#d3')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)

const g = svg.append('g')
    .attr('font-size', 12)
    .attr('transform', `translate(${dy / 3}, ${dx - min})`)

const link = g.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .enter().append('path')
    .attr('d', d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + dy / 2},${d.target.x}
        ${d.source.y + dy / 2},${d.source.x}
        ${d.source.y},${d.source.x}
    `)

const node = g.append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants().reverse())
    .enter().append('g')
    .attr('transform', d => `translate(${d.y},${d.x})`);

node.append('circle')
    .attr('fill', '#555')
    .attr('r', 2.5)

node.append('text')
    .attr('dy', '0.31em')
    .attr('x', d => d.children ? -6 : 6)
    .text(d => d.data.name)
    .filter(d => d.children)
    .attr('text-anchor', 'end')
    .clone(true).lower()
    .attr('stroke', '#f2f6ed')
</script>
{% endraw %}
