---
title: 可避障的追踪光线机器小车
date: 2012-10-08 00:00:00
categories: Uncategorized
keywords: 追踪光线机器小车, 机器人
description: 在机器小车上配备光敏和接触两种传感器，使其对两种外界刺激都能产生反应
---

在机器小车上配备光敏和接触两种传感器，使其对两种外界刺激都能产生反应。光敏传感器的电阻值随着照射光线的强度按比例改变，其连续变化的输出信号决定电机的驱动电平。接触传感器为开关量，实现机器小车躲避障碍。

编写程序，使机器小车在追踪光线行进的同时对接触传感器的触发也能产生相应反应：

``` C
void main() {
    while(1) {
        /* 右光敏传感器决定左电机转速 */
        motor(LEFT_MOTOR, normalize(light(RIGHT_EYE)));
        /* 左光敏传感器决定右电机转速 */
        motor(RIGHT_MOTOR, normalize(light(LEFT_EYE)));

        /* 检测接触传感器来壁障 */
        if(sensor(LEFT_TOUCH)) {
            backward();
            sleep(.25);
            right();
            sleep(.4);
        }
        if(sensor(RIGHT_TOUCH)) {
            backward();
            sleep(.25);
            left();
            sleep(.4);
        }
    }
}
```

光敏传感器接受的光照越强，输出的读数越小，而这里的电机控制却需要光照越强电机转速越快。控制电机转速的函数motor()，电平值从-100到+100变化，此小车不需要电机反转，仅使用0到+100的变化范围。于是需要将光敏传感器的读数转换为0到100之间的值，其中0代表光线最暗，100代表光线最强。编写读数格式化函数normalize()：

``` C
int normalize(int light) {
    /* 定义光敏传感器可能输出的最大和最小读数 */
    int MAX_LIGHT=10;
    int MIN_LIGHT=200;

    int output=100-(light- MAX_LIGHT)*100/(MIN_LIGHT-MAX_LIGHT);

    if(output<0) output=0;
    if(output>100) output=100;

    return output;
}
```

由于机器小车的运动速度与外界光强成正比，当外界环境光很弱时小车几乎不能运动也不能正常转弯。在机器小车上加装第三只光敏传感器，使其方向朝上检测环境光强，再将环境光强输出值合成到电机驱动信号中，这样小车运动速度就能保持相对稳定。

<cite>参考：Fred G.Martin. 机器人探索：工程实践指南. 电子工业出版社. 2004</cite>
