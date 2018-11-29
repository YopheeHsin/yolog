---
title: LabVIEW求一列数前后两数的差值
date: 2013-05-03 00:00:00
categories: Uncategorized
keywords: LabVIEW
description: 在LabVIEW中，先计算数组大小，在For循环中使用索引数组不断循环引用各组前后两个数求差。
---

通过数据采集卡采集光栅式转角编码器的脉冲信号，在LabVIEW软件中用固定的时间间隔读取一系列脉冲数，接着计算电机转速时，需要计算此脉冲序列前后两数的差值，LabVIEW软件中没有现成函数，故编写如下：

{% img /images/labview/subtract.gif" 275 %}

先计算数组大小，在For循环中使用索引数组不断循环引用各组前后两个数求差。

使用到的LabVIEW函数位置分别为：

- 编程 > 数组 > 数组大小
- 编程 > 结构 > For循环
- 编程 > 数组 > 索引数组
