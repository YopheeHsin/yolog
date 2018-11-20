---
title: Flash动画基础班教学笔记（六） – Flash深入
date: 2012-08-09 00:00:00
categories: Uncategorized
keywords: Flash深入, Flash动画
description: 康佳一款电视的电源按钮。在回针下底针板上设计防震胶棒，回针底部闭空底针板，这样合模时回针推动防震胶棒使面针板和底针板带动顶针先复位
---

<strong>Flash中的三维实现</strong>

<ul>
<li>Poser软件：动物、人体造型及人体动画制作</li>
<li>Swift3D软件：构建模型并渲染为swf文件</li>
<li>Cool3D软件：制作三维文字动画效果</li>
</ul>

<strong>Flash官方实例</strong>

<ul>
<li>影片剪辑拖动 / 碰撞检测</li>
<li>阴影 / 速度感</li>
<li>组件</li>
</ul>

<strong>其他</strong>

用Sothink SWF Decompiler对Flash文件反编译（破解），提取参考素材，借鉴学习。

替换鼠标ActionScript编程

<pre>
onClipEvent (enterFrame) {
　this.startDrag();
　Mouse.hide();
　_x = _root._xmouse;
　_y = _root._ymouse;
}
</pre>
