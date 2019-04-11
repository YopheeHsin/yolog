---
title: 图片快速切换动效
date: 2019-04-11 00:00:00
categories: Uncategorized
keywords: 动效, TweenMax
description: 
---

TweenMax是GreenSock Animation Platform(GSAP)动画平台核心文件，包含动画和时间轴相关的核心功能、基础插件、时间曲线等。Tween功能可用来构建[补间动画](flash3.html)，Timeline功能可创建时间轴，精确控制和管理动画序列。这里使用TweenMax实现图片快速切换动效。

单个切换区块对象，包含背景图片和使用[splitText](split-text.html)将文本打散分离的标题。

``` JavaScript
class Slide {
    constructor(el) {
        this.DOM = { el }
        this.DOM.img = this.DOM.el.querySelector('.slide__image')
        this.DOM.title = this.DOM.el.querySelector('.slide__title')
        splitText(this.DOM.title)
        this.DOM.titleLetters = Array.from(this.DOM.title.querySelectorAll('span'))
        this.titleLettersTotal = this.DOM.titleLetters.length
    }
}
```

图片切换对象，包含一组切换区块、控制切换的button和事件、具体的切换动画实现等。难点是如何控制各动画元素的时间轴先后关系实现需要的动效。

``` JavaScript
class Slides {
    constructor(el) {
        this.DOM = { el }
        this.slides = []
        Array.from(this.DOM.el.querySelectorAll('.slide')).forEach(slide => this.slides.push(new Slide(slide)))
        this.slidesTotal = this.slides.length
        this.current = 0
        this.slides[this.current].DOM.el.classList.add('slide--current')
        this.navigationCtrls = {
            next: this.DOM.el.querySelector('.nav__button--next'),
            prev: this.DOM.el.querySelector('.nav__button--previous')
        }
        this.initEvents()
    }
    initEvents() {
        this.navigationCtrls.next.addEventListener('click', () => this.navigate('next'))
        this.navigationCtrls.prev.addEventListener('click', () => this.navigate('prev'))

        document.addEventListener('keydown', ev => {
            const keyCode = ev.keyCode || ev.which
            if (keyCode === 38) {
                this.navigate('prev')
            } else if (keyCode === 40) {
                this.navigate('next')
            }
        })
    }
    navigate(direction = 'next') {
        if (this.isAnimating) return
        this.isAnimating = true

        const currentSlide = this.slides[this.current]
        this.current = direction === 'next' ?
            (this.current < this.slidesTotal - 1 ? this.current + 1 : 0) :
            (this.current > 0 ? this.current - 1 : this.slidesTotal - 1)
        const upcomingSlide = this.slides[this.current]

        const currentImg = currentSlide.DOM.img
        const currentTitle = currentSlide.DOM.title
        const currentTitleLetters = currentSlide.DOM.titleLetters
        const currentTitleLettersTotal = currentSlide.titleLettersTotal
        const upcomingImg = upcomingSlide.DOM.img
        const upcomingTitle = upcomingSlide.DOM.title

        this.tl = new TimelineMax({
            onStart: () => {
                upcomingSlide.DOM.el.classList.add('slide--current')
            },
            onComplete: () => {
                currentSlide.DOM.el.classList.remove('slide--current')
                this.isAnimating = false
            }
        }).add('begin')

        this.tl
            .set(upcomingImg, {
                transformOrigin: direction === 'next' ? '50% 0%' : '50% 100%',
                y: direction === 'next' ? winsize.height : -1 * winsize.height,
                scaleY: 1.5,
                scaleX: 0.8,
                opacity: 0
            })
            // 省略...
            .to(currentImg, 0.3, {
                ease: Power1.easeOut,
                scaleY: 2,
                scaleX: 0.85,
                opacity: 0.5
            }, 'begin')
            // 省略...
            .staggerTo(currentTitleLetters.sort((a, b) => 0.5 - Math.random()), 0.2, {
                ease: Expo.easeOut,
                cycle: {
                    y: () => direction === 'next' ? getRandomNumber(-800, -400) : getRandomNumber(400, 800),
                    x: () => getRandomNumber(-100, 100),
                },
                opacity: 0
            }, 0.5 / currentTitleLettersTotal, 'begin+=0.6')
            // 省略...
            .set(currentTitleLetters, {
                x: 0,
                y: 0,
                opacity: 1
            })

        this.tl.addCallback(() => {
            main.classList.add('show-deco')
        }, 'begin+=0.2')

        this.tl.addCallback(() => {
            main.classList.remove('show-deco')
        }, 'begin+=1.1')
    }
}
```

图片切换实例，并使用imagesLoaded判断页面内图片是否加载完成。

``` JavaScript
new Slides(document.querySelector('.slides'))

imagesLoaded(document.querySelectorAll('.slide__image'), {
    background: true
}, () => main.classList.remove('loading'))
```

{% raw %}
<p class="demo-p"><button type="button" onclick="openIframe('/demo/speedy-transition-effect/index.html')">查看demo »</button></p>
{% endraw %}

<cite>参考：https://github.com/codrops/MotionTransitionEffect</cite>
