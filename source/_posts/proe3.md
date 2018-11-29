---
title: 基于Pro/E的凸轮机构参数化设计及仿真
date: 2012-10-27 00:00:00
categories: Uncategorized
keywords: Pro/E
description: 在Pro/E中盘形凸轮和圆柱凸轮的参数化建模，以及用Pro/E的运动学分析模块Mechanism仿真的过程
---

本文简要描述在Pro/E中盘形凸轮和圆柱凸轮的参数化建模，以及用Pro/E的运动学分析模块Mechanism仿真的过程。

一般来说，凸轮机构主动件作等速转动，直接推动从动件（推杆）作直线往复运动。根据推杆位置，凸轮的轮廓划分为四部分，其对应的凸轮转角分别称为推程运动角、远休止角、回程运动角和近休止角。下图为各角度与推杆位置的对应关系。

{% img /images/proe/tulun1.jpg 275 %}

Pro/E盘形凸轮建模、仿真过程为：

<h3>1\. 盘形凸轮建模</h3>

a. 添加盘形凸轮参数

{% raw %}
<table>
	<thead>
		<tr>
			<th>参数</th>
			<th>值</th>
			<th>名称</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>baser</td>
			<td>50</td>
			<td>基圆半径</td>
		</tr>
		<tr>
			<td>h</td>
			<td>15</td>
			<td>推程</td>
		</tr>
		<tr>
			<td>phi1</td>
			<td>90</td>
			<td>推程运动角</td>
		</tr>
		<tr>
			<td>phi2</td>
			<td>90</td>
			<td>远休止角</td>
		</tr>
		<tr>
			<td>phi3</td>
			<td>90</td>
			<td>回程运动角</td>
		</tr>
		<tr>
			<td>phi4</td>
			<td>90</td>
			<td>近休止角</td>
		</tr>
		</tr>
	</tbody>
</table>
{% endraw %}
 
亦可添加凸轮厚度、转轴孔径等其他参数。

b. 绘制凸轮轮廓曲线

使用笛卡尔坐标下的方程形式，按推程运动角、远休止角、回程运动角和近休止角对应划分四段，绘制凸轮轮廓曲线（以推杆余弦加速度运动规律为例）。四段曲线具体方程式详见文章：[常用推杆运动规律的Pro/E曲线方程式](proe2.html)。

c. 提取轮廓曲线，拉伸成为凸轮

<h3>2\. 推杆和支架建模</h3>

支架用来安装凸轮和推杆，组合成为凸轮机构。

<h3>3\. 建立组件/装配体</h3>

使用“缺省”约束装入支架，使用“销钉”约束装入凸轮，使用“滑动杆”约束装入推杆，并建立推杆与凸轮之间的“槽”约束。此处使用的各种连接方式的约束关系详见文章：[Pro/E装配连接约束及相对运动关系](proe1.html)。

<h3>4\. 仿真</h3>

a. 进入应用程序“机构”模块

b. 添加伺服电动机

在凸轮“销钉”约束的转轴处添加伺服电动机，设置角速度为36deg/sec。

c. 机构分析

分析类型选择“动态”，此模式下可以测量速度和加速度，持续时间设置为10sec，使凸轮完成整一圈转动。

{% img /images/proe/tulun2.gif 275 %}

d. 测量结果

推杆位置图像

{% img /images/proe/tulun3.gif 275 %}

推杆速度图像

{% img /images/proe/tulun4.gif 275 %}

推杆加速度图像

{% img /images/proe/tulun5.gif 275 %}

<h3>5\. 圆柱凸轮建模</h3>

a. 添加圆柱凸轮参数

{% raw %}
<table>
	<thead>
		<tr>
			<th>参数</th>
			<th>值</th>
			<th>名称</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>bottomr</td>
			<td>50</td>
			<td>圆柱底圆半径</td>
		</tr>
		<tr>
			<td>baseh</td>
			<td>70</td>
			<td>圆柱基高</td>
		</tr>
		<tr>
			<td>h</td>
			<td>15</td>
			<td>推程</td>
		</tr>
		<tr>
			<td>phi1</td>
			<td>90</td>
			<td>推程运动角</td>
		</tr>
		<tr>
			<td>phi2</td>
			<td>90</td>
			<td>远休止角</td>
		</tr>
		<tr>
			<td>phi3</td>
			<td>90</td>
			<td>回程运动角</td>
		</tr>
		<tr>
			<td>phi4</td>
			<td>90</td>
			<td>近休止角</td>
		</tr>
	</tbody>
</table>
{% endraw %}

b. 绘制凸轮轮廓曲线

不同于盘形凸轮，这里使用圆柱坐标系（以推杆余弦加速度运动规律为例）：

``` C
/* 推程
r=bottomr
theta=t*phi1
z=baseh+h*(1-cos(180*t))/2

/* 远休止
r=bottomr
theta=phi1+phi2*t
z=baseh+h

/* 近休止
r=bottomr
theta=phi1+phi2+phi3*t
z=baseh+h*(1+cos(180*t))/2

/* 回程
r=bottomr
theta=phi1+phi2+phi3+phi4*t
z=baseh
```

c. 提取轮廓曲线，在FRONT面草绘一个底圆

d. 使用可变剖面扫描作4段圆柱体
