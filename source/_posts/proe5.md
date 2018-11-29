---
title: 新安装Pro/E后的常用配置
date: 2013-03-05 00:00:00
categories: Uncategorized
keywords: Pro/E
description: 新安装Pro/E后的常用配置及工程图配置文件生成方法
---

菜单“工具” - “选项”命令，添加/更改下表选项，然后把工作目录下生成的current_session.pro改名为config.pro。

{% raw %}
<table>
	<thead>
		<tr>
			<th>选项</th>
			<th>值</th>
			<th>说明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>trail_dir</td>
			<td>D:\proe4\trail</td>
			<td>设置轨迹文件trail.txt的生成目录</td>
		</tr>
		<tr>
			<td>web_browser_homepage</td>
			<td>about:blank</td>
			<td>设置浏览器主页为空白页面</td>
		</tr>
		<tr>
			<td>drawing_setup_file</td>
			<td>D:\proe4\work\drw.dtl</td>
			<td>设置工程图配置文件</td>
		</tr>
		<tr>
			<td>pdf_use_pentable</td>
			<td>yes</td>
			<td>导出PDF图纸时使用系统线宽设置</td>
		</tr>
		<tr>
			<td>pen_table_file</td>
			<td>D:\proe4\work\table.pnt</td>
			<td>设置打印线宽配置文件</td>
		</tr>
		<tr>
			<td>pro_unit_sys</td>
			<td>mmns</td>
			<td>缺省单位</td>
		</tr>
		<tr>
			<td>template_solidpart</td>
			<td>mmns_part_solid.prt</td>
			<td>缺省零件模板</td>
		</tr>
		<tr>
			<td>template_sheetmetalpart</td>
			<td>mmns_part_sheetmetal.prt</td>
			<td>缺省钣金零件模板</td>
		</tr>
		<tr>
			<td>template_designasm</td>
			<td>mmns_asm_design.asm</td>
			<td>缺省装配体模板</td>
		</tr>
	</tbody>
</table>
{% endraw %}

打印线宽配置文件table.pnt中设置为：

```
pen 1 color 0.0 0.0 0.0; thickness 0.03 cm
pen 2 color 0.0 0.0 0.0; thickness 0.013 cm
pen 3 color 0.0 0.0 0.0; thickness 0.01 cm
pen 4 color 0.0 0.0 0.0; thickness 0.01 cm
pen 5 color 0.0 0.0 0.0; thickness 0.01 cm
pen 6 color 0.0 0.0 0.0; thickness 0.01 cm
pen 7 color 0.0 0.0 0.0; thickness 0.01 cm
pen 8 color 0.0 0.0 0.0; thickness 0.01 cm
```

工程图配置文件生成方法为：进入绘图模块，菜单“文件” - “属性” - “绘图选项”命令，添加/更改需要选项，然后把文件保存为drw.dtl。
