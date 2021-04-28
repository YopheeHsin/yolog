---
title: 正则表达式
date: 2019-12-24 00:00:00
categories: JavaScript
keywords: 正则表达式, RegExp, JavaScript
description: 正则表达式
---

## 怎么用

正则表达式用来搜索和替换字符串。

``` JavaScript
// 两种创建语法
re1 = new RegExp(pattern[, flags])
re2 = /pattern/[flags]
```

flags修饰符：i不区分大小写，g查找所有匹配项，m多行模式，u完整unicode支持，y粘滞模式。

__只查找首个匹配项__

- str.search(reg) - 返回第一个匹配位置，未找到则返回-1

``` JavaScript
const str = 'I love JavaScript';
str.search(/love/i); // 返回第一个匹配位置2
```

- str.match(reg) - 不使用g修饰符，以数组形式返回第一个匹配项，无匹配项则返回null

``` JavaScript
const str = 'I love JavaScript';
const result = str.match(/Java(Script)/);

result[0]; // 完全匹配JavaScript
result[1]; // 第一个分组Script
result.length; // 2
result.index; // 匹配位置7
result.input; // 源字符串str
```

- regexp.test(str) - 判断是否有匹配，返回true/false

``` JavaScript
const str = 'I love JavaScript';
/love/i.test(str); // true，相当于：
str.search(/love/i) !== -1;
```

- regexp.exec(str) - 使用g修饰符，并设置regexp.lastIndex，从指定位置查找

``` JavaScript
const str = 'I love JavaScript';
const regexp = /\w+/g;
regexp.lastIndex = 2;
const result = regexp.exec(str);

result[0]; // 完全匹配love
result.index; // 匹配位置2
result.input; // 源字符串str
```

__查找所有匹配项__

- str.match(reg) - 使用g修饰符，得到匹配项数组，不含index和捕获分组

``` JavaScript
const str = 'I love JavaScript';
str.match(/Java(Script)/g); // ['JavaScript']
```

- regexp.exec(str) - 在循环中使用g修饰符，获取所有匹配项完整信息

``` JavaScript
const str = 'I love JavaScript';
const regexp = /\w+/g;
let result;
while (result = regexp.exec(str)) {
    console.log(`Found ${result[0]} at position ${result.index}`);
}
```

__搜索并替换__

- str.replace(reg, str|func)

``` JavaScript
'12-34-56'.replace(/-/g, ':');
```

在替代字符串中使用特殊字符：

{% raw %}
<table>
    <thead>
        <tr>
            <th>符号</th>
            <th>作用</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$$</td>
            <td>$符号</td>
        </tr>
        <tr>
            <td>$&</td>
            <td>匹配项</td>
        </tr>
        <tr>
            <td>$`</td>
            <td>匹配项左边的内容</td>
        </tr>
        <tr>
            <td>$'</td>
            <td>匹配项右边的内容</td>
        </tr>
        <tr>
            <td>$n</td>
            <td>第n个括号的匹配项</td>
        </tr>
        <tr>
            <td>$&lt;name&gt;</td>
            <td>命名分组的匹配项</td>
        </tr>
    </tbody>
</table>
{% endraw %}

``` JavaScript
const str = 'Adele Adkins';
str.replace(/(\w+) (\w+)/i, '$2, $1');
```

__拆分字符串__

- str.split(str|reg)

``` JavaScript
'12,34, 56,  78'.split(/,\s*/); // ['12', '34', '56', '78']
```



_待续 ~_
