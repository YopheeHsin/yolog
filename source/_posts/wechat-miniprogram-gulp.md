---
title: 在微信小程序中使用pug和sass
date: 2021-12-01 00:00:00
categories: Uncategorized
keywords: 小程序, pug, sass
description: 利用gulp实现在微信小程序中使用pug和sass
---

<a href="https://gulpjs.com/">gulp</a>是基于流的自动化构建工具。

老骥伏枥，在微信小程序项目中借助gulp使用pug和sass。实现新建page页面时，自动创建对应的pug和sass文件，修改pug或sass文件时，自动将其编译为wxml或wxss文件。

## 依赖包

``` JSON
{
    "dependencies": {
        "gulp": "^4.0.2",
        "gulp-plumber": "^1.2.1",
        "gulp-pug": "^5.0.0",
        "gulp-rename": "^2.0.0",
        "gulp-sass": "^4.1.1",
        "map-stream": "0.0.7"
    }
}
```

## 放置在项目根目录的gulp主文件

``` JavaScript gulpfile.js
const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const wait = () => require('map-stream')((data, cb) => {
    setTimeout(() => cb(null, data), 1000);
});

const pug = require('gulp-pug');
const sass = require('gulp-sass');

const pagePath = 'pages';
const pugSrc = [`${pagePath}/**/*.pug`];
const sassSrc = [`${pagePath}/**/*.sass`];

const dev_pug = () => gulp.src(pugSrc)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(rename({ extname: '.wxml' }))
    .pipe(gulp.dest(pagePath));

const dev_sass = () => gulp.src(sassSrc)
    .pipe(wait())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest(pagePath));

const dev_watch = cb => {
    chokidar.watch(pagePath, {
        ignoreInitial: true,
        ignorePermissionErrors: true
    }).on('all', (event, filePath) => {
        try {
            console.log(event, path.resolve(__dirname, filePath));
            if (event === 'addDir') {
                const fileName = filePath.split(/\/|\\/).pop();
                const file = path.resolve(__dirname, filePath, fileName);
                fs.writeFile(file + '.pug', '', () => {});
                fs.writeFile(file + '.sass', '', () => {});
            }
            if (event === 'change') {
                if (/\.pug$/.test(filePath)) {
                    dev_pug();
                } else if (/\.sass$/.test(filePath)) {
                    dev_sass();
                }
            }
        } catch (err) {
            console.log('chokidar error', err);
        }
    });
    cb && cb();
};

gulp.task('dev', dev_watch);
```
