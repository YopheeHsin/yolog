---
title: ES5中类的封装
date: 2019-01-19 00:00:00
categories: Uncategorized
keywords: JS类, JS属性和方法, JavaScript
description: JavaScript中类的封装、私有属性和方法、公有属性和方法、特权方法、公共属性和方法、静态属性和方法
---

通过this在当前对象自身上添加属性和方法，通过原型prototype继承公共属性和方法。

JavaScript的函数作用域，即函数内部的变量和方法在外界是访问不到的，通过此特性即可创建私有属性和方法。

在函数内部通过this创建的属性和方法，每个实例化对象都拥有一份，并且外部可访问。

通过this创建的方法，不仅可以访问公有属性和方法，还能访问类的私有属性和方法，故而可以用这些特权方法来初始化实例对象，创建对象时调用特权方法可以看作是类的构造器。

类外部通过点语法添加的属性和方法，在使用new关键字创建对象时没有执行到，所以对象实例无法获取，称为静态属性和方法。

由于JavaScript原型链的特性，新实例对象的prototype和类的prototype指向的是同一个对象，所以实例对象可以共享在原型上定义的公共属性和方法。

{% img /images/else/class.gif 305 %}

下面示例中，person的name和race在出生时设定，并且永远不变。创建时，从一岁开始，并定好了寿命，寿命值隐藏外部不可见。对于体重，进食时增加，锻炼时减少。每次进食或者锻炼，都会长大一岁。人物对象具有公开的clothing属性，任何人都可以查看修改。公开的dirtFactor污垢因子，可以手动修改增加灰尘或清除污垢，每次进食或者锻炼，它也会增加，但可以通过shower()方法减少。

``` JavaScript
function Person(name, race) {
    this.constructor.population++

    // 私有属性和方法
    var alive = true, age = 1
    var maxAge = 70 + Math.round(Math.random() * 30)
    function makeOlder() {
        return alive = (++age <= maxAge)
    }

    var myName = name ? name : 'John Doe'
    var weight = 1

    // 特权方法
    this.toString = this.getName = function() {
        return myName
    }

    this.eat = function() {
        if (makeOlder()) {
            this.dirtFactor++
            return weight *= 3
        } else {
            console.log(myName + ' can\'t eat, he\'s dead!')
        }
    }
    this.exercise = function() {
        if (makeOlder()) {
            this.dirtFactor++
            return weight /= 2
        } else {
            console.log(myName + ' can\'t exercise, he\'s dead!')
        }
    }
    this.weigh = function() {
        return weight
    }
    this.getRace = function() {
        return race
    }
    this.getAge = function() {
        return age
    }
    this.muchTimePasses = function() {
        age += 50
        this.dirtFactor = 10
    }

    // 公有属性
    this.clothing = 'nothing/naked'
    this.dirtFactor = 0
}

// 公共属性 
Person.prototype.legs = 2

// 公共方法
Person.prototype.beCool = function() {
    this.clothing = 'khakis and black shirt'
}
Person.prototype.shower = function() {
    this.dirtFactor = 2
}
Person.prototype.showLegs = function() {
    console.log(this + ' has ' + this.legs + ' legs')
}
Person.prototype.amputate = function() {
    this.legs--
}

// 静态属性
Person.population = 0
```

下面是Person类使用示例。

``` JavaScript
function runLives() {
    // 创建两个新实例对象
    var gk = new Person('Gavin', 'caucasian')
    var lk = new Person('Lisa', 'caucasian')
    console.log('There are ' + Person.population + ' people')

    // 两个对象读取this.legs时共用原型属性
    gk.showLegs()
    lk.showLegs()

    // 设置公有属性，不会覆盖私有属性race
    gk.race = 'hispanic'
    // 返回创建时设置的私有属性race
    console.log(gk + '\'s real race is ' + gk.getRace())

    // 进食，体重增加到3、9、27
    gk.eat()
    gk.eat()
    gk.eat()
    console.log(gk + ' weighs ' + gk.weigh() +
        ' pounds and has a dirt factor of ' + gk.dirtFactor)

    // 锻炼，体重减至13.5
    gk.exercise()

    // 跟上潮流服饰
    gk.beCool()
    // 公有属性clothing可以随意设置
    gk.clothing = 'Pimp Outfit'

    // 洗澡，变干净
    gk.shower()
    console.log('Existing shower technology has gotten ' +
        gk + ' to a dirt factor of ' + gk.dirtFactor)

    // 50年过去了
    gk.muchTimePasses()
    // 更新所有人的公共洗澡方式
    Person.prototype.shower = function() {
        this.dirtFactor = 0
    }

    // 只给Gavin设置新酷炫着装方法
    gk.beCool = function() {
        this.clothing = 'tinfoil'
    }

    gk.beCool()
    gk.shower()
    console.log('Fashionable ' + gk + ' at ' +
        gk.getAge() + ' years old is now wearing ' +
        gk.clothing + ' with dirt factor ' +
        gk.dirtFactor)

    // 使用原型方法设置Gavin的公有属性
    gk.amputate()
    gk.showLegs()
    // Lisa的依旧维持原公有属性
    lk.showLegs()

    // 又50年过去了
    gk.muchTimePasses()
    // Gavin去世了，不再进食
    gk.eat()
}

runLives()
```

<cite>参考：http://phrogz.net/JS/Classes/OOPinJS.html</cite>


{% raw %}
<script>
function Person(name, race) {
    this.constructor.population++

    // 私有属性和方法
    var alive = true, age = 1
    var maxAge = 70 + Math.round(Math.random() * 30)
    function makeOlder() {
        return alive = (++age <= maxAge)
    }

    var myName = name ? name : 'John Doe'
    var weight = 1

    // 特权方法
    this.toString = this.getName = function() {
        return myName
    }

    this.eat = function() {
        if (makeOlder()) {
            this.dirtFactor++
            return weight *= 3
        } else {
            console.log(myName + ' can\'t eat, he\'s dead!')
        }
    }
    this.exercise = function() {
        if (makeOlder()) {
            this.dirtFactor++
            return weight /= 2
        } else {
            console.log(myName + ' can\'t exercise, he\'s dead!')
        }
    }
    this.weigh = function() {
        return weight
    }
    this.getRace = function() {
        return race
    }
    this.getAge = function() {
        return age
    }
    this.muchTimePasses = function() {
        age += 50
        this.dirtFactor = 10
    }

    // 公有属性
    this.clothing = 'nothing/naked'
    this.dirtFactor = 0
}

// 公共属性 
Person.prototype.legs = 2

// 公共方法
Person.prototype.beCool = function() {
    this.clothing = 'khakis and black shirt'
}
Person.prototype.shower = function() {
    this.dirtFactor = 2
}
Person.prototype.showLegs = function() {
    console.log(this + ' has ' + this.legs + ' legs')
}
Person.prototype.amputate = function() {
    this.legs--
}

// 静态属性
Person.population = 0

function runLives() {
    // 创建两个新实例对象
    var gk = new Person('Gavin', 'caucasian')
    var lk = new Person('Lisa', 'caucasian')
    console.log('There are ' + Person.population + ' people')

    // 两个对象读取this.legs时共用原型属性
    gk.showLegs()
    lk.showLegs()

    // 设置公有属性，不会覆盖私有属性race
    gk.race = 'hispanic'
    // 返回创建时设置的私有属性race
    console.log(gk + '\'s real race is ' + gk.getRace())

    // 进食，体重增加到3、9、27
    gk.eat()
    gk.eat()
    gk.eat()
    console.log(gk + ' weighs ' + gk.weigh() +
        ' pounds and has a dirt factor of ' + gk.dirtFactor)

    // 锻炼，体重减至13.5
    gk.exercise()

    // 跟上潮流服饰
    gk.beCool()
    // 公有属性clothing可以随意设置
    gk.clothing = 'Pimp Outfit'

    // 洗澡，变干净
    gk.shower()
    console.log('Existing shower technology has gotten ' +
        gk + ' to a dirt factor of ' + gk.dirtFactor)

    // 50年过去了
    gk.muchTimePasses()
    // 更新所有人的公共洗澡方式
    Person.prototype.shower = function() {
        this.dirtFactor = 0
    }

    // 只给Gavin设置新酷炫着装方法
    gk.beCool = function() {
        this.clothing = 'tinfoil'
    }

    gk.beCool()
    gk.shower()
    console.log('Fashionable ' + gk + ' at ' +
        gk.getAge() + ' years old is now wearing ' +
        gk.clothing + ' with dirt factor ' +
        gk.dirtFactor)

    // 使用原型方法设置Gavin的公有属性
    gk.amputate()
    gk.showLegs()
    // Lisa的依旧维持原公有属性
    lk.showLegs()

    // 又50年过去了
    gk.muchTimePasses()
    // Gavin去世了，不再进食
    gk.eat()
}

runLives()
</script>
{% endraw %}
