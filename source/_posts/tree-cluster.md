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

JSON格式的初始层次结构数据，name是节点名称，children是子节点，没有children的是叶子节点。

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
                // 省略...
            }]
        }]
    }]
}
```

## 尺寸

SVG画布的宽度width固定，使用同父元素相同的宽度，而高度height根据树状图的节点层次动态计算。

D3树状图的默认布局是纵向的，是将各节点坐标安排成一颗由上到下逐渐展开的竖直的树。而这里要绘制的树是由左至右横向展开的，所以树状图中的x，y坐标需要跟画布对掉。dx表示树状图纵向的节点尺寸固定为20，dy表示横向的节点尺寸，dy根据SVG画布的宽度和树状图横向最深节点的数目计算。

``` JavaScript
// SVG画布的宽度最少为600
const width = Math.max(document.querySelector('svg#d3').parentNode.clientWidth, 600)
let height
const dx = 20
let dy
```

## 层次化

使用hierarchy方法对层次数据进行处理，并设置横向节点尺寸dy。

``` JavaScript
const hierarchy = d3.hierarchy(data)
// 如果需要对同级数据排序
// hierarchy.sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name))

dy = width / (hierarchy.height + 1) - 5
```

hierarchy方法返回的根节点和每个后代节点都会被附加如下属性：

- node.data 当前节点关联的原始数据
- node.depth 当前节点的深度，根节点为0
- node.height 当前节点的高度，叶节点为0
- node.parent 当前节点的父节点，根节点为null
- node.children 当前节点的子节点，叶节点为undefined

## 树布局

使用tree方法创建树布局，并设置节点尺寸。D3会自动计算并为每个节点设置位置属性(x,y)，根节点的位置为(0,0)。设置画布的高度为树状图纵向的最大值与最小值的差值加上一定的边距。

集群图cluster与树状图tree类似，不同点是cluster的所有的叶子节点都在相同的深度上，tree布局在空间上更紧凑一些。

``` JavaScript
const root = d3.tree().nodeSize([dx, dy])(hierarchy)
// 集群图 const root = d3.cluster()

let min = Infinity
let max = -min
root.each(d => {
    if (d.x > max) max = d.x
    if (d.x < min) min = d.x
})
height = max - min + dx * 2
```

## 绘图

选择SVG画布，设置其宽度和高度。

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

root.links()返回树的连线links数组，每个link是定义了source和target属性的对象，source为父节点，target为子节点。使用SVG的三次贝塞尔曲线C命令连接各组links。

用C命令创建三次贝塞尔曲线，需要设置三组坐标参数：C x1,y1 x2,y2 x,y，最后一组坐标(x,y)表示的是曲线的终点，另外两组坐标是控制点，(x1,y1)是起点的控制点，(x2,y2)是终点的控制点。

使用M命令移动画笔到target点，曲线沿着起点到第一控制点的方向伸出，逐渐弯曲，然后沿着第二控制点到终点的方向结束。

``` JavaScript
const link = g.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#83887c')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .enter().append('path')
    .attr('d', d => `
        M${d.target.y}, ${d.target.x}
        C${d.source.y + dy / 2}, ${d.target.x}
        ${d.source.y + dy / 2}, ${d.source.x}
        ${d.source.y}, ${d.source.x}
    `)
```

root.descendants()返回树的所有节点数组，用分组将每个节点移动到对应位置。所有节点的公共分组，设置路径转角stroke-linejoin为圆形，轮廓厚度为3，这两个设置用于改善节点间连线上覆盖文字的显示效果。

``` JavaScript
const node = g.append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants())
    .enter().append('g')
    .attr('transform', d => `translate(${d.y},${d.x})`)
```

节点处画实心圆。

``` JavaScript
node.append('circle')
    .attr('fill', '#83887c')
    .attr('r', 2.5)
```

SVG文字text的(x,y)表示基点坐标，(dx,dy)是相对于基点的偏移距离，text-anchor用来定义文本和基点的相对性。

节点处绘制文字，无children的叶节点，文字在圆圈右边，其他节点的文字则在圆圈左边。在圆圈左边的文字会覆盖在连线上，为了改善显示效果，使用clone命令复制文字并填充浅色用作背景。SVG中，后绘制的元素会覆盖先绘制的元素，所以需要使用lower命令将复制出来的背景文字元素移动到其父元素的第一个子元素位置。

``` JavaScript
node.append('text')
    .attr('dy', '0.3em')
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

dy = width / (hierarchy.height + 1) - 5

const root = d3.tree().nodeSize([dx, dy])(hierarchy)
// const root = d3.cluster()

let min = Infinity
let max = -min
root.each(d => {
    if (d.x > max) max = d.x
    if (d.x < min) min = d.x
})
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
    .attr('stroke', '#83887c')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .enter().append('path')
    .attr('d', d => `
        M${d.target.y}, ${d.target.x}
        C${d.source.y + dy / 2}, ${d.target.x}
        ${d.source.y + dy / 2}, ${d.source.x}
        ${d.source.y}, ${d.source.x}
    `)

const node = g.append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll('g')
    .data(root.descendants())
    .enter().append('g')
    .attr('transform', d => `translate(${d.y},${d.x})`)

node.append('circle')
    .attr('fill', '#83887c')
    .attr('r', 2.5)

node.append('text')
    .attr('dy', '0.3em')
    .attr('x', d => d.children ? -6 : 6)
    .text(d => d.data.name)
    .filter(d => d.children)
    .attr('text-anchor', 'end')
    .clone(true).lower()
    .attr('stroke', '#f2f6ed')
</script>
{% endraw %}
