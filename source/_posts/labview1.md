---
title: 在LabVIEW中依次输入一列数并绘图显示
date: 2014-03-16 00:00:00
categories: Uncategorized
keywords: LabVIEW
description: 在LabVIEW中依次输入一列数并绘图显示的程序
---

在扭转刚度实验中，需逐次增加悬挂砝码重量，并用编码器记录各组重量对应的轴扭转变形量，手动将重量值输入程序，计算、绘图显示刚度曲线。在LabVIEW中依次输入一列数并绘图显示的程序框图如下：

{% img /images/labview/input2.gif 275 %}

使用事件结构，“添加”按钮触发将新一组的数据添加到数组中并在XY图中显示，在While循环中使用移位寄存器储存实验中的一列多组数据，达到依次连续绘图的目的。

使用到的LabVIEW函数位置分别为：

- 编程 > 结构 > While循环
- 编程 > 结构 > 事件结构
- 编程 > 簇、类与变体 > 捆绑
- 编程 > 数组 > 创建数组