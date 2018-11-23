---
title: Flash动画基础班教学笔记（一） – 初识Flash
date: 2012-08-02 00:00:00
categories: Uncategorized
keywords: Flash基础, Flash动画
description: 康佳一款电视的电源按钮。在回针下底针板上设计防震胶棒，回针底部闭空底针板，这样合模时回针推动防震胶棒使面针板和底针板带动顶针先复位
---

## Flash8软件简介（软件发展、功能、特征）

Flash软件的发展

{% img /images/flash/flash11.jpg 275 %}

1995年，Jonathan Gay设计了矢量动画软件Future Splash Animator，1996年被Macromedia收购后更名为Flash，之后发布一系列版本，功能日渐强大，2005年发布完最后一个版本Flash8.0后被Adobe收购，现在最新版本为Adobe Flash CS6 Professional。

Flash软件1997、98年传入中国并广泛传播，之后出现闪客帝国、闪吧等几个国内闪客聚集的网站，大批闪客制作出颇高水准的动画，其中代表闪客及作品有：老蒋《强盗的天堂》、小小动画系列、林℃《重爱轻友》、卜桦《猫》等。同时，Flash商业化制作团队出现，比如ShowGood《大话三国》、拾荒《小破孩》、创梦数码《大话李白》，以及飞鸟、思妙、中华轩等等。

Flash的主要功能

- 动画：广告、贺卡、MTV
- 游戏：网页游戏、手机小游戏
- 网站：Flash按钮、Flash导航、Flash整站
- 其他：在线电子杂志、教学课件

Flash动画的优势

- 矢量动画、占用存储空间小
- 兼容性好、浏览器均可播放
- 富因特网应用、多媒体、交互式

Flash的文件格式

- 原始文件.fla：可用Flash软件编辑的原始文件
- 动画文件.swf：.fla文件编译后生成的最终动画文件

本课程使用的Flash版本

- Flash8：省资源、易上手、最经典

## Flash8操作环境（软件各面板功能及操作）

- 左侧 工具箱：绘图和编辑工具
- 上方 时间轴：动画过程中随时间变化的序列
- 中部 编辑区：编辑和播放动画的区域
- 下方 属性面板：显示当前选用工具相应的设置
- 右侧 浮动面板：查看、组织、更改文档中动画元素的参数

## Flash基本概念（时间轴、图层、元件、库）

{% img /images/flash/flash12.jpg 275 %}

时间轴：动画过程中随时间变化的序列；
帧：进行flash动画制作最基本的时间单位。

{% raw %}
<table>
	<thead>
		<tr>
			<th>名称</th>
            <th>概念</th>
            <th>快捷键</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>普通帧</td>
            <td>能显示动画元素，但不能对元素进行编辑操作</td>
            <td>F5</td>
        </tr>
        <tr>
            <td>关键帧</td>
            <td>定义动画变化、更改元素状态，可对元素进行编辑</td>
            <td>F6</td>
        </tr>
        <tr>
            <td>空白关键帧</td>
            <td>没有包含任何元素的关键帧</td>
            <td>F7</td>
        </tr>
    </tbody>
</table>
{% endraw %}

图层：在不同图层上绘制和编辑对象，各图层独立存在，互不影响。

{% raw %}
<table>
	<thead>
		<tr>
            <th>名称</th>
            <th>概念</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>普通图层</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>引导层</td>
            <td>指定元件运动路径</td>
        </tr>
        <tr>
            <td>被引导层</td>
            <td>被引导层控制的层</td>
        </tr>
        <tr>
            <td>未使用的引导层</td>
            <td>无被引导层的引导层</td>
        </tr>
        <tr>
            <td>遮罩层</td>
            <td>显示被遮部分，隐藏其余部分</td>
        </tr>
        <tr>
            <td>被遮罩层</td>
            <td>被遮罩层控制的层</td>
        </tr>
    </tbody>
</table>
{% endraw %}

元件：构成Flash动画最基本最核心的元素；
库：储存着文档所有元件与素材。

{% raw %}
<table>
	<thead>
		<tr>
            <th>名称</th>
            <th>概念</th>
            <th>区别及特点</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>影片剪辑</td>
            <td>构成动画的片段</td>
            <td rowspan="3">1. 影剪播放独立于时间轴，图形播放与时间轴同步；<br>
            2. 影剪可设置实例名称、滤镜、混合，图形则不可；<br>
            3. 影剪和按钮中可包含声音，图形则不可；<br>
            4. 图形可设置播放方式，影剪只从第一帧开始循环播放；<br>
            5. 影剪在场景中测试看不到播放效果，图形则所见即所得；<br>
            6. 按钮时间线只有4帧，不自动播放。</td>
        </tr>
        <tr>
            <td>图形</td>
            <td>构成动画的元素</td>
        </tr>
        <tr>
            <td>按钮</td>
            <td>响应鼠标的元件</td>
        </tr>
    </tbody>
</table>
{% endraw %}
