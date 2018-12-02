---
title: Flash动画基础班教学笔记（六） – Flash深入
date: 2012-08-09 00:00:00
categories: Uncategorized
keywords: Flash深入, Flash动画
description: Flash的三维实现、官方实例、反编译（破解）
---

## Flash中的三维实现

- Poser软件：动物、人体造型及人体动画制作
- Swift3D软件：构建模型并渲染为swf文件
- Cool3D软件：制作三维文字动画效果

## Flash官方实例

- 影片剪辑拖动 / 碰撞检测
- 阴影 / 速度感
- 组件

## 其他

用Sothink SWF Decompiler对Flash文件反编译（破解），提取参考素材，借鉴学习。

替换鼠标ActionScript编程

```
onClipEvent (enterFrame) {
    this.startDrag();
    Mouse.hide();
    _x = _root._xmouse;
    _y = _root._ymouse;
}
```
