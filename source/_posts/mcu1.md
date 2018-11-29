---
title: 用Proteus和Keil联调51单片机
date: 2012-10-22 00:00:00
categories: Uncategorized
keywords: Flash动画
description: 康佳一款电视的电源按钮。在回针下底针板上设计防震胶棒，回针底部闭空底针板，这样合模时回针推动防震胶棒使面针板和底针板带动顶针先复位
---

{% img /images/uploads/mcu11.gif 275 %}

Proteus是单片机及外围器件仿真软件，Keil是单片机C语言开发软件，通过以下设置实现Proteus和Keil对51单片机的联调：

1. 安装Proteus和Keil软件；

2. 下载并安装联调驱动vdmagdi.exe；

3. 将VDM51.dll从目录C:\Keil\C51\BIN复制到C:\Program Files\Labcenter Electronics\Proteus 7 Professional\BIN中；

4. 在Proteus中设计上图所示单片机电路（Proteus软件中可省略晶振电路及复位电路），在菜单“调试”中勾选“使用远程调试监控”；

5. 在keil中编写对应的程序代码：

``` C
#include <reg51.h>
void main(void)
{
    P1=0xFE;
    while(1);
}
```

6.在keil菜单“Project”中点选“Options for target 'target 1'”，在对话框的“Output”选项卡中选择“Create HEX Fi”，即让软件编译生成单片机使用的HEX文件，在对话框的“debug”选项卡中右上方的“Use”处选择“Proteus VSM Simulator”，即开启Proteus仿真；

7. 在keil中调试C程序，在Proteus中观察单片机对应运行结果。
