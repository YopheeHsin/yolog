---
title: 解决机器小车突发状况
date: 2012-10-10 00:00:00
categories: Uncategorized
keywords: 机器小车避障, 机器人
description: 模仿小虫的飞行，在机器小车的行动中增加一些随机性，使其获得同样的生存优势
---

自然界中的生物行为总有一定的随机性，如下图在瓶中的小虫被外部烛光吸引的情形。小虫总会朝有光的方向飞行，即便瓶口是打开的，小虫也一直被困在瓶中。然而，某些小虫的飞行行为具有随机性，它们就会有机会从瓶口飞出逃走。

{% img /images/robot/robot31.jpg 275 %}

模仿小虫的飞行，在机器小车的行动中增加一些随机性，使其获得同样的生存优势。这样，当机器小车在追踪光线途中被玻璃等遮挡卡住时，可以逃脱。

``` C
if(sensor(LEFT_TOUCH)) {
    backward();
    sleep(.25);
    right();
    if(random(4)==0) {
        /* 转弯延时0.5到1.49秒 */
        sleep((float)random(100)/100.+.5);
    } else {
        sleep(.4)
    }
}
```

机器小车在运动过程中可能遇到的另一情形是陷入某种循环动作，而不是简单的卡住不动。例如下图，小车向墙角运动，当其左侧接触传感器碰到左侧面墙后（图1），它将后退（图2）并向右转弯（图3），在转弯后前进时右侧接触传感器又碰到右侧面墙（图4），然后小车又后退（图5）并向左转弯（图6），此时小车又回到状态1，重新开始这个过程，如此循环不止。

{% img /images/robot/robot32.jpg 275 %}

除了借鉴动物行为增加随机性运动外，还可以给机器小车增加运动状态检测功能，找出无用的循环状态，然后启动避障功能。

具体地，给程序增加两个参数，一个是碰撞计数器，用于记录连续的碰撞次数；另一个是计时器，用来判断碰撞是否为短时间内连续发生。当程序检测到连续发生5次碰撞，则判断很可能陷入墙角循环，启动避障程序。主程序如下：

``` C
int LEFT_TOUCH=10;
int RIGHT_TOUCH=11;

void main() {
    int recent_bumps=0;
    reset_timer();

    while(1) {
        forward();
        if(sensor(LEFT_TOUCH)) {
            if(timer()<2.) {
                if(recent_bumps==5) {
                    random_avoid();
                    reset_timer();
                    recent_bumps=0;
                } else {
                    left_avoid();
                    reset_timer();
                    recent_bumps++;
                }
            } else {
                left_avoid();
                reset_timer();
                recent_bumps=1;
            }
        }

        if(sensor(RIGHT_TOUCH)) {
            if(timer()<2.) {
                if(recent_bumps==5) {
                    random_avoid();
                    reset_timer();
                    recent_bumps=0;
                } else {
                    right_avoid();
                    reset_timer();
                    recent_bumps++;
                }
            } else {
                right_avoid();
                reset_timer();
                recent_bumps=1;
            }
        }
    }
}
```

其中，函数reset_timer()的功能是将计时器复位，函数timer()则返回从上次计时器复位到当前经历的时间。

另外，程序中用到的避障函数为：

``` C
void random_avoid() {
    backward();
    sleep(.4);
    if(random(2)==0) left();
    else right();
    sleep((float)random(100)/100.+.5);
}
void left_avoid() {
    backward();
    sleep(.4);
    right();
    sleep(.4);
}
void right_avoid() {
    backward();
    sleep(.4);
    left();
    sleep(.4);
}
```

<cite>参考：Fred G.Martin. 机器人探索：工程实践指南. 电子工业出版社. 2004</cite>
