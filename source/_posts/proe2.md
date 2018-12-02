---
title: 常用推杆运动规律的Pro/E曲线方程式
date: 2012-10-26 00:00:00
categories: Uncategorized
keywords: 推杆运动规律, 盘形凸轮参数化建模, Pro/E
description: Pro/E中推杆常用的多项式运动规律和三角函数运动规律对应的凸轮轮廓曲线方程
---

所谓推杆运动规律，是指凸轮机构中推杆的位移s、速度v和加速度a随时间t变化的规律。因为凸轮一般为等速旋转，故而推杆的运动常表示为其运动参数随凸轮转角变化。

推杆常用的多项式运动规律和三角函数运动规律（以完成推程h计）其性质为：

{% raw %}
<table>
	<thead>
		<tr>
			<th>序号</th>
			<th>运动规律</th>
			<th>冲击类型</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>一次多项式（等速运动）</td>
			<td>刚性冲击</td>
		</tr>
		<tr>
			<td>2</td>
			<td>二次多项式（等加速等减速运动）</td>
			<td>柔性冲击</td>
		</tr>
		<tr>
			<td>3</td>
			<td>五次多项式</td>
			<td>无冲击</td>
		</tr>
		<tr>
			<td>4</td>
			<td>余弦加速度（简谐运动）</td>
			<td>柔性冲击</td>
		</tr>
		<tr>
			<td>5</td>
			<td>正弦加速度（摆线运动）</td>
			<td>无冲击</td>
		</tr>
	</tbody>
</table>
{% endraw %}

当使用Pro/E对盘形凸轮进行参数化建模时，其凸轮轮廓曲线使用笛卡尔坐标下的方程形式来分段（按推程、远休止、回程和近休止四段划分）表示。下面给出Pro/E中推杆常用的多项式运动规律和三角函数运动规律对应的凸轮轮廓曲线方程。

方程式中各参数定义详见文章：[基于Pro/E的凸轮机构参数化设计及仿真](proe3.html)。

需要注意的是，Pro/E曲线方程中的参数t变化范围为从0到1。

### 1. 一次多项式

``` C
/* 推程
x=(baser+h*t)*cos(phi1*t)
y=(baser+h*t)*sin(phi1*t)
z=0

/* 远休止
x=(baser+h)*cos(phi1+phi2*t)
y=(baser+h)*sin(phi1+phi2*t)
z=0

/* 回程
x=(baser+h*(1-t))*cos(phi1+phi2+phi3*t)
y=(baser+h*(1-t))*sin(phi1+phi2+phi3*t)
z=0

/* 近休止
x=baser*cos(phi1+phi2+phi3+phi4*t)
y=baser*sin(phi1+phi2+phi3+phi4*t)
z=0
```

### 2. 二次多项式

``` C
/* 推程
/* phi1的前半段
x=(baser+h*t^2/2)*cos(phi1/2*t)
y=(baser+h*t^2/2)*sin(phi1/2*t)
z=0
/* phi1的后半段
x=(baser+h*(1-(1-t)^2/2))*cos(phi1/2*(1+t))
y=(baser+h*(1-(1-t)^2/2))*sin(phi1/2*(1+t))
z=0

/* 远休止
x=(baser+h)*cos(phi1+phi2*t)
y=(baser+h)*sin(phi1+phi2*t)
z=0

/* 回程
/* phi3的前半段
x=(baser+h*(1-t^2/2))*cos(phi1+phi2+phi3/2*t)
y=(baser+h*(1-t^2/2))*sin(phi1+phi2+phi3/2*t)
z=0
/* phi3的后半段
x=(baser+h*(1-t)^2/2)*cos(phi1+phi2+phi3/2*(1+t))
y=(baser+h*(1-t)^2/2)*sin(phi1+phi2+phi3/2*(1+t))
z=0

/* 近休止
x=baser*cos(phi1+phi2+phi3+phi4*t)
y=baser*sin(phi1+phi2+phi3+phi4*t)
z=0
```

### 3. 五次多项式

``` C
/* 推程
x=(baser+h*(10*t^3-15*t^4+6*t^5))*cos(phi1*t)
y=(baser+h*(10*t^3-15*t^4+6*t^5))*sin(phi1*t)
z=0

/* 远休止
x=(baser+h)*cos(phi1+phi2*t)
y=(baser+h)*sin(phi1+phi2*t)
z=0

/* 回程
x=(baser+h*(1-10*t^3+15*t^4-6*t^5))*cos(phi1+phi2+phi3*t)
y=(baser+h*(1-10*t^3+15*t^4-6*t^5))*sin(phi1+phi2+phi3*t)
z=0

/* 近休止
x=baser*cos(phi1+phi2+phi3+phi4*t)
y=baser*sin(phi1+phi2+phi3+phi4*t)
z=0
```

### 4. 余弦加速度

``` C
/* 推程
x=(baser+h*(1-cos(180*t))/2)*cos(phi1*t)
y=(baser+h*(1-cos(180*t))/2)*sin(phi1*t)
z=0

/* 远休止
x=(baser+h)*cos(phi1+phi2*t)
y=(baser+h)*sin(phi1+phi2*t)
z=0

/* 回程
x=(baser+h*(1+cos(180*t))/2)*cos(phi1+phi2+phi3*t)
y=(baser+h*(1+cos(180*t))/2)*sin(phi1+phi2+phi3*t)
z=0

/* 近休止
x=baser*cos(phi1+phi2+phi3+phi4*t)
y=baser*sin(phi1+phi2+phi3+phi4*t)
z=0
```

### 5. 正弦加速度

``` C
/* 推程
x=(baser+h*(t-sin(360*t)/(2*pi)))*cos(phi1*t)
y=(baser+h*(t-sin(360*t)/(2*pi)))*sin(phi1*t)
z=0

/* 远休止
x=(baser+h)*cos(phi1+phi2*t)
y=(baser+h)*sin(phi1+phi2*t)
z=0

/* 回程
x=(baser+h*(1-t+sin(360*t)/(2*pi)))*cos(phi1+phi2+phi3*t)
y=(baser+h*(1-t+sin(360*t)/(2*pi)))*sin(phi1+phi2+phi3*t)
z=0

/* 近休止
x=baser*cos(phi1+phi2+phi3+phi4*t)
y=baser*sin(phi1+phi2+phi3+phi4*t)
z=0
```
