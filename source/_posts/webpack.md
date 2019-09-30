---
title: webpack
date: 2019-09-30 00:00:00
categories: Uncategorized
keywords: webpack
description: webpack
---

## 初始化项目，安装webpack

```
mkdir my-project
cd my-project
npm init -y
npm install webpack webpack-cli --save-dev
```

## webpack.config.js配置

``` JavaScript
const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development' // production或none
}
```

## entry

``` JavaScript
// 单入口
entry: './path/to/my/entry/file.js'

// 多入口
entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
}
```

## output

``` JavaScript
output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
}

// 多个入口起点，可使用[hash]、[chunkhash]、[name]、[id]、[query]
filename: '[name].bundle.js',
```

## loader

``` JavaScript
module: {
    rules: [
        { test: /\.css$/, use: 'css-loader' },
        { test: /\.ts$/, use: 'ts-loader' }
    ]
}
```

## plugins

常用的plugins

Name | Description
--- | ---
CommonsChunkPlugin | 将chunks相同的模块代码提取成公共js
CleanWebpackPlugin | 清理构建目录
MiniCssExtractPlugin | 将CSS从bundle文件里提取成独立的CSS文件
CopyWebpackPlugin | 将文件或目录拷贝到构建目录
HtmlWebpackPlugin | 创建html文件以承载输出的bundle
UglifyjsWebpackPlugin | 压缩js

``` JavaScript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new webpack.optimize.UglifyJsPlugin()
]
```

## 解析ES6

``` JavaScript
rules: [
    { test: /\.js$/, use: 'babel-loader' }
]
```

安装

```
npm i babel-loader @babel/core @babel/preset-env -D
```

配置

``` JSON .babelrc
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

## 解析Less

``` JavaScript
rules: [
    {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
    }
]
```

## 解析图片

``` JavaScript
rules: [
    {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: ['file-loader']
    }
]
```

可使用url-loader将小图片用base64引入。

## 文件监听

``` JavaScript
module.exports = {
    watch: true
}
```

## 热更新

``` JavaScript
const webpack = require('webpack')
module.exports = {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    },
    mode: 'development'
}
```

命令

``` JSON
"scripts": {
    "dev": "webpack-dev-server --open"
}
```

也可以使用webpack-dev-middleware实现热更新。

``` JavaScript server.js
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/'
}))

app.listen(3000, function () {
    console.log('Listening on port 3000');
})
```

命令

``` JSON
"scripts": {
    "server": "node server.js"
}
```

## 文件指纹

- hash: 和整个项目的构建相关，只要项目文件有修改，整个项目的hash值就会更改
- chunkhash: 和打包的chunk相关，不同entry会生成不同的chunkhash
- contenthash: 由文件内容生成

__JS文件__

``` JavaScript
output: {
    filename: '[name][chunkhash:8].js'
}
```

__CSS文件__

``` JavaScript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name][contenthash:8].css',
        })
    ],
    rules: [
        {
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader'
            ]
        }
    ]
}
```

__图片、字体__

``` JavaScript
// file-loader中的hash即为contenthash
rules: [
    {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [
            loader: 'file-loader',
            options: {
                name: '[name][hash:8].[ext]'
            }
        ]
    }
]
```

## 代码压缩

__JS文件__

webpack4中已经内置并默认开启了uglifyjs-webpack-plugin，用于JS文件的压缩。

__CSS文件__

``` JavaScript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name][contenthash:8].css',
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        })
    ]
}
```

__HTML文件__

通过设置html-webpack-plugin的压缩参数实现。

``` JavaScript
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        chunks: ['index'],
        minify: {
            collapseWhitespace: true,
            removeComments: true
        }
    })
]
```

## 清理构建目录

``` JavaScript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// webpack's output.path directory will be removed
plugins: [
    new CleanWebpackPlugin()
]
```

## 补齐CSS3前缀

``` JavaScript

```

_待续 ~_







