---
title: Lodash常用命令
categories: Code Snippets
keywords: Lodash
description: Lodash常用命令
date: 2018-12-14 15:24:00
tags:
---


在Vue中使用Lodash：

``` JavaScript
// 全局引用
import Vue from 'vue'
import _ from 'lodash'
Vue.prototype._ = _

// 组件中使用
this._.VERSION
```

``` JavaScript
_.intersection
_.intersection(this.path, routerMap.correct.path).length
```

``` JavaScript
_.keys
```

_.get
_.findIndex
