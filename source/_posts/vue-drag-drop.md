---
title: 使用vue-drag-drop实现拖放
date: 2019-04-17 00:00:00
categories: Vue
keywords: vue-drag-drop, Vue拖放, Vue
description: 使用vue-drag-drop实现拖放，借助Vuex在Drag和Drop组件之间共享拖放状态
---

vue-drag-drop是[HTML中Drag/Drop拖放接口](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)在Vue中的封装。

HTML元素拖放的基本原理是：

- 鼠标选中一个可拖动的元素，移动鼠标到一个可放置的元素上，然后释放鼠标
- 在拖动放置操作期间，会触发一系列事件，通过监听响应这些事件实现界面交互
- 可拖动元素需添加属性draggable="true"
- 可放置元素需设置ondragover和ondrop响应事件
- 在可拖动元素的ondragstart事件中，在dataTransfer属性上设置拖动的数据、图像和效果
- 在可放置元素的ondrop事件中，获取放置上来的元素所携带的数据

这里是Vue中使用vue-drag-drop实现的拖放，演示将诗词列表拖动到唐诗或宋词区域中实现分类收藏，借助Vuex在drag-panel和drop-panel组件之间共享拖放状态。

拖动相关的store模块，dragType存放当前拖动元素的类型，是唐诗还是宋词。

``` JavaScript store/modules/drag.js
import { DRAG } from '../types'

export default {
    state: {
        dragType: null
    },

    getters: {
        dragType: state => state.dragType
    },

    mutations: {
        [DRAG.TYPE](state, dragType) {
            state.dragType = dragType
        }
    }
}
```

可拖动元素组件，拖动数据为诗词内容，开始拖动时设置dragType，拖动结束后清空dragType。通过slot设置了拖动时跟随鼠标的显示图像，相当于调用事件的dataTransfer.setDragImage方法。

``` Vue drag-panel.vue
<template lang="pug">
ul.list
    li(
        v-for="(item, index) in list"
        :key="index"
    )
        drag(
            :transfer-data="item"
            @dragstart="setDragType(item.type)"
            @dragend="setDragType(null)"
        )
            .drag-wrapper
                icon
                | {{ item.title }}
            div.drag-content(slot="image")
                | {{ item.title }}
                p {{ item.content }}
</template>

<script>
import { mapMutations } from 'vuex'
import { Drag } from 'vue-drag-drop'
import Icon from './icon'

export default {
    components: { Drag, Icon },

    props: {
        list: Array
    },

    methods: {
        ...mapMutations({
            setDragType: 'DRAG_TYPE'
        })
        // 除使用辅助函数映射，也可通过$store提交mutation
        // setDragType(type) {
        //  this.$store.commit('DRAG_TYPE', type)
        // }
    }
}
</script>
```

诗词的分类区域为可放置元素，当可拖动元素开始拖动时，与dragType相同的分类区域样式提示可放置，而其他分类区域则样式置灰，并通过@dragover事件将拖动效果dropEffect设为none。释放鼠标时，通过@drop事件获取诗词信息，保存收藏数据。

``` Vue drop-panel.vue
<template lang="pug">
.drop-container
    drop.drop-wrapper(
        v-for="(v, k) in collections"
        :key="k"
        :class="{ active: k === dragType, passive: dragType && k !== dragType }"
        @dragover="handleDragover(k, ...arguments)"
        @drop="handleDrop"
    )
        h2 {{ v.des }}收藏：
        ul
            li(
                v-for="(item, index) in v.list"
                :key="index"
            ) {{ item }}
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Drop } from 'vue-drag-drop'

export default {
    components: { Drop },

    computed: {
        ...mapGetters(['collections', 'dragType'])
    },

    methods: {
        ...mapMutations({
            addCollection: 'COLLECTIONS_ADD'
        }),

        handleDragover(type, data, event) {
            if (type !== data.type) {
                event.dataTransfer.dropEffect = 'none'
            }
        },

        handleDrop({ title }) {
            const list = this.collections[this.dragType].list
            if (list.indexOf(title) === -1) {
                this.addCollection({
                    type: this.dragType,
                    title
                })
            } else {
                alert('重复收藏')
            }
        }
    }
}
</script>
```

主页面，组合拖动和放置组件，获取数据。

``` Vue App.vue
<template lang="pug">
.row
    .col.col-l
        drop-panel
    .col.col-r
        drag-panel(:list="list")
</template>

<script>
import DragPanel from './drag-drop/drag-panel'
import DropPanel from './drag-drop/drop-panel'
import { list } from './drag-drop/list'

export default {
    components: { DragPanel, DropPanel },

    data() {
        return {
            list: this._.shuffle(list)
        }
    }
}
</script>
```

诗词数据列表。

``` JavaScript list.js
export const list = [{
    title: '早发白帝城',
    type: 't',
    content: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。'
},
// 省略...
{
    title: '如梦令·昨夜雨疏风骤',
    type: 's',
    content: '昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。知否，知否？应是绿肥红瘦。'
}]
```

{% raw %}
<p class="demo-p"><button type="button" onclick="openIframe('/demo/vue-drag-drop/index.html')">查看demo »</button></p>
{% endraw %}
