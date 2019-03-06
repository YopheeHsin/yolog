---
title: axios + axios-mock-adapter + Mock.js模拟响应请求
date: 2019-03-06 00:00:00
categories: Vue
keywords: axios, axios-mock-adapter, Mock.js, Vue
description: 前端使用axios-mock-adapter适配axios，实现HTTP请求Mock.js生成的模拟数据
---

Mock.js支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等模拟响应数据。前端使用axios-mock-adapter适配axios，实现HTTP请求Mock.js生成的模拟数据。

目录结构如下，responses文件夹中为各接口模拟数据，其中index.js定义了各接口地址、请求方法和对应数据。

```
mock/
    responses/
        frameworks.js
        tasks.js
        ...
        index.js
    index.js
App.vue
main.js
...
```

定义两个请求，POST请求地址/frameworks，GET请求地址/tasks。

``` JavaScript mock/responses/index.js
import frameworks from './frameworks'
import tasks from './tasks'

const res = [
    ['POST', '/frameworks', frameworks],
    ['GET', '/tasks', tasks]
]

export default res
```

模拟数据示例，使用Mock.js的Random方法生成各种随机数据。

``` JavaScript mock/responses/tasks.js
import Mock from 'mockjs'
const Random = Mock.Random

export default [{
    pre_step: {
        work_info: {
            id: ''
        }
    },
    steps: [{
        name: Random.ctitle(),
        id: Random.guid(),
        type: Random.pick(['manual', 'automatic']),
        frequency: {
            times: 1,
            rounds: ['T1'],
            rate: 'noInterval',
            rate_info: {
                num: '',
                unit: 'day'
            },
            time_range: [1, 1]
        }
    }]
}]
```

axios拦截配置，这里模拟了接口异步请求的延时，请求未定义接口时返回404错误，以及小概率的服务器500错误。

``` JavaScript mock/index.js
import axios from 'axios'
import adapter from 'axios-mock-adapter'
import mockResponses from './responses'

export default {
    init() {
        const mock = new adapter(axios)

        mock.onAny().reply(config => {
            return new Promise((resolve, reject) => {
                let response

                if (Math.random() > 0.01) {
                    const matchedResponse = mockResponses.filter(([method, url]) => {
                        return config.method.toUpperCase() === method && config.url === url
                    })

                    response = matchedResponse.length ?
                        [200, {
                            code: 0,
                            msg: 'Success',
                            data: matchedResponse[0][2]
                        }] : [404, {
                            code: 404,
                            msg: 'Not Found',
                            data: null
                        }]
                } else {
                    response = [500, {
                        code: 500,
                        msg: 'Internal Server Error',
                        data: null
                    }]
                }

                setTimeout(() => {
                    if (response[0] === 200) {
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }, Math.floor(200 + Math.random() * 800))
            })
        })
    }
}
```

应用的入口文件，只在开发环境中初始化调用mock。

``` JavaScript main.js
import Vue from 'vue'
import router from './router'
import store from './store'
import './css/common/normalize'

import _ from 'lodash'
Vue.prototype._ = _

import axios from 'axios'
axios.defaults.timeout = 30000
// 添加响应拦截器，统一处理请求异常
axios.interceptors.response.use(({ data }) => {
    if (data.code > 0) Vue.prototype.$message.error(data.msg)
    return data
}, error => {
    Vue.prototype.$message.error('未知错误')
    return Promise.reject(error)
})
Vue.prototype.$http = axios

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

import mock from './mock'
// eslint-disable-next-line
process.env.NODE_ENV === 'development' && mock.init()

new Vue({
    router,
    store
}).$mount('#app')
```
