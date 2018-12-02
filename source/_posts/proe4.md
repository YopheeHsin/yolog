---
title: Pro/E绘图格式的创建
date: 2012-11-05 00:00:00
categories: Uncategorized
keywords: Pro/E绘图格式, Pro/E
description: Pro/E绘图格式的创建过程
---

在Pro/E工程图中，格式其实就是图纸框，还包括表格中的图纸名称、比例、绘图日期、页码、版本号、绘图人等信息及其字体等的设定。

Pro/E绘图格式的创建过程为：

1\. 新建“格式”，其文件后缀为.frm，选择所需的“标准大小”（例如A4）；

2\. 右侧“启用草绘链”，使用“直线”，右键打开“绝对坐标”，绘制内框；

3\. 菜单打开“表”-“插入”-“表”，依次点选“升序”、“左对齐”、“按长度”、“顶点”，选择内框右下角顶点，依次输入表格列宽和行高，绘制表格；

4\. 菜单打开“表”-“合并单元格”，合并表格中的部分单元格；

5\. 菜单打开“格式”-“文本样式库”-“新建”，设置需要的文本字体大小、对齐等格式；

6\. 菜单打开“格式”-“缺省文本样式”，选择前面建立的“样式”，将其设置为默认文本样式；

7\. 双击表格单元格，填写信息，其中可以用到的注释标签有：

{% raw %}
<table>
	<tbody>
		<tr>
			<td>&amp;model_name</td>
			<td>显示模型名称</td>
		</tr>
		<tr>
			<td>&amp;todays_date</td>
			<td>显示当前日期</td>
		</tr>
		<tr>
			<td>&amp;scale</td>
			<td>显示绘图比例</td>
		</tr>
		<tr>
			<td>&amp;dwg_name</td>
			<td>显示工程图名称</td>
		</tr>
		<tr>
			<td>&amp;current_sheet</td>
			<td>显示当前图纸页码</td>
		</tr>
		<tr>
			<td>&amp;total_sheets</td>
			<td>显示总共图纸页码</td>
		</tr>
		<tr>
			<td>&amp;format</td>
			<td>显示图纸规格</td>
		</tr>
		<tr>
			<td>&amp;type</td>
			<td>显示模型类型</td>
		</tr>
	</tbody>
</table>
{% endraw %}

需要注意的是，上表的注释标签与其他文字之间必须用空格隔开。
