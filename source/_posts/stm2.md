---
title: STC12C5A60S2无线遥控流水灯
date: 2012-11-24 00:00:00
categories: Uncategorized
keywords: Flash动画
description: 康佳一款电视的电源按钮。在回针下底针板上设计防震胶棒，回针底部闭空底针板，这样合模时回针推动防震胶棒使面针板和底针板带动顶针先复位
---

STC12C5A60S2是STC生产的新一代单片机，指令代码完全兼容传统8051。本文描述在面包板上搭建STC12C5A60S2单片机最小系统，并连接8个LED发光二极管组成流水灯，编写程序，用R06A无线遥控控制流水灯的方向。主要目的是熟悉单片机最小系统和R06A无线遥控的控制方式。

使用元器件列表：

{% raw %}
<table>
	<thead>
		<tr>
			<th>编号</th>
			<th>名称</th>
			<th>型号</th>
			<th>数量</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>&nbsp;</td>
			<td>单片机</td>
			<td>STC12C5A60S2</td>
			<td>1</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>芯片座</td>
			<td>40P</td>
			<td>1</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>面包板</td>
			<td>&nbsp;</td>
			<td>1</td>
		</tr>
		<tr>
			<td>C1</td>
			<td>电解电容</td>
			<td>10μF，16V</td>
			<td>1</td>
		</tr>
		<tr>
			<td>R1</td>
			<td>色环电阻</td>
			<td>10K，1/4W</td>
			<td>1</td>
		</tr>
		<tr>
			<td>C2</td>
			<td>瓷片电容</td>
			<td>30pF，16V</td>
			<td>2</td>
		</tr>
		<tr>
			<td>X1</td>
			<td>无源晶振</td>
			<td>11.0592M</td>
			<td>1</td>
		</tr>
		<tr>
			<td>R2</td>
			<td>色环电阻</td>
			<td>1K，1/4W</td>
			<td>8</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>发光二极管</td>
			<td>&nbsp;</td>
			<td>8</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>无线遥控套件</td>
			<td>R06A型，PT2262和PT2272组合，L4互锁</td>
			<td>1</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>单片机下载器</td>
			<td>STC51，5V电压输出</td>
			<td>1</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td>杜邦线</td>
			<td>针对针、孔对孔、针对孔</td>
			<td>若干</td>
		</tr>
	</tbody>
</table>
{% endraw %}

电路原理图：

{% img /images/uploads/mcu21.jpg 275 %}

完成接线后的实际电路：

{% img /images/uploads/mcu22.jpg 275 %}

C程序：

``` C
#include <STC_NEW_8051.H>
#include <intrins.h>

unsigned char led;
sbit key1=P2^0;
sbit key2=P2^1;

void delay(unsigned int z)
{
    unsigned int x,y;
    for(x=z;x>0;x--)
        for(y=110;y>0;y--);
}

void main (void){
    led=0x01;
    P0=00000000;
    while(1){
        if(key1==1){
            P0=led;
            delay(100);
            led=_crol_(led,1);
        }
        if(key2==1){
            P0=led;
            delay(100);
            led=_cror_(led,1);
        }
    }
}
```

将程序编译后烧入单片机，实现功能为：按遥控器C键流水灯朝一个方向流动，按D键流水灯换向，按A键或B键流水灯停止流动。
