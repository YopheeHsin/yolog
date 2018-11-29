---
title: Pro/E装配连接约束及相对运动关系
date: 2012-10-24 00:00:00
categories: Uncategorized
keywords: Pro/E
description: Pro/E装配及运动仿真中，定义零件连接方式时，各约束关系、相对运动关系、零件自由度
---

Pro/E装配及运动仿真中，定义零件连接方式时，各约束关系、相对运动关系、零件自由度如下表：

{% raw %}
<table>
	<thead>
		<tr>
			<th>连接类型</th>
			<th>约束定义</th>
			<th>相对运动关系</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><strong>刚性/Rigid</strong></td>
			<td>多个约束</td>
			<td>无任何相对运动，构成单一主体</td>
		</tr>
		<tr>
			<td><strong>销钉/Pin</strong></td>
			<td>一个轴对齐，一个平面匹配/对齐或点对齐（限制平移）</td>
			<td>可绕轴线转动，但不能沿轴线平移</td>
		</tr>
		<tr>
			<td><strong>滑动杆/Slider</strong></td>
			<td>一个轴对齐，一个平面匹配/对齐（限制转动）</td>
			<td>可沿轴线平移，但不能绕轴线转动</td>
		</tr>
		<tr>
			<td><strong>圆柱/Cylinder</strong></td>
			<td>一个轴对齐</td>
			<td>既可绕轴线转动，也可沿轴线平移</td>
		</tr>
		<tr>
			<td><strong>平面/Planar</strong></td>
			<td>一个平面匹配/对齐</td>
			<td>即可在一个平面内平移，也可绕垂直该平面的轴线转动</td>
		</tr>
		<tr>
			<td><strong>球/Ball</strong></td>
			<td>一个点对齐</td>
			<td>可沿任何方向旋转，但不能平移</td>
		</tr>
		<tr>
			<td><strong>焊接/Weld</strong></td>
			<td>坐标系对齐</td>
			<td>无任何相对运动</td>
		</tr>
		<tr>
			<td><strong>轴承/Bearing</strong></td>
			<td>一个点与轴/边对齐</td>
			<td>既可在约束点上沿任何方向旋转，也可沿对齐的轴/边平移</td>
		</tr>
		<tr>
			<td><strong>槽/Slot</strong></td>
			<td>一个点与边/曲线对齐</td>
			<td>可沿对齐的边/曲线平移</td>
		</tr>
	</tbody>
</table>
{% endraw %}
