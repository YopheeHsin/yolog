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

## 字符类匹配

通过方括号[]表示匹配它包含的任意字符；通过方括号内开头的^来否定，表示不包含；在方括号中使用连字符-表示字符范围。

{% raw %}
<table>
    <thead>
        <tr>
            <th>字符</th>
            <th>匹配</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>[...]</td>
            <td>方括号内的任意字符</td>
        </tr>
        <tr>
            <td>[^...]</td>
            <td>不在方括号内的任意字符</td>
        </tr>
        <tr>
            <td>.</td>
            <td>除换行符之外的任意字符</td>
        </tr>
        <tr>
            <td>\d</td>
            <td>数字，等同于[0-9]</td>
        </tr>
        <tr>
            <td>\D</td>
            <td>非数字，等同于[^0-9]</td>
        </tr>
        <tr>
            <td>\w</td>
            <td>单词，等同于[a-zA-Z0-9]</td>
        </tr>
        <tr>
            <td>\W</td>
            <td>非单词，等同于[^a-zA-Z0-9]</td>
        </tr>
        <tr>
            <td>\s</td>
            <td>Unicode空白符</td>
        </tr>
        <tr>
            <td>\S</td>
            <td>非Unicode空白符</td>
        </tr>
    </tbody>
</table>
{% endraw %}

## 重复匹配

{% raw %}
<table>
    <thead>
        <tr>
            <th>字符</th>
            <th>含义</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{n,m}</td>
            <td>至少n次，不超过m次</td>
        </tr>
        <tr>
            <td>{n,}</td>
            <td>n次或更多次</td>
        </tr>
        <tr>
            <td>{n}</td>
            <td>n次</td>
        </tr>
        <tr>
            <td>?</td>
            <td>0次或1次，等同于{0,1}</td>
        </tr>
        <tr>
            <td>+</td>
            <td>1次或多次，等同于{1,}</td>
        </tr>
        <tr>
            <td>*</td>
            <td>0次或多次，等同于{0,}</td>
        </tr>
    </tbody>
</table>
{% endraw %}

上述重复默认为“贪婪”匹配，即尽可能多地匹配，在待匹配字符后跟随问号?可改为“非贪婪”匹配。

## 选择项

使用符号|分隔供选择的字符，例如/ab|cd|ef/可以匹配ab，也可以匹配cd或者ef。注意，选择项从左到右尝试匹配，如果左边已匹配，就忽略右边的，即便右边的匹配更好。

## 分组和引用

圆括号()有多种作用：

1. 把单独的项组合成表达式，一块使用|、?、+、*等处理
2. 在完整模式中定义子模式，当正则表达式和目标字符串成功匹配时，可以从目标字符串中提取出和圆括号中的子模式相匹配的部分

``` JavaScript
const result = 'class007'.match(/[a-z]+(\d+)/);
result && result.length > 1 && result[1]; // 007
```

3. 在同一个正则表达式的后部，通过字符\加上数字编号，引用前面的子表达式（引用匹配文本）

``` JavaScript
/(['"])[^'"]*\1/.test('I love "JavaScript"'); // true
```

注，如果只是单纯分组，不需要提取或引用，应该使用(?:...)，即在左括号后面跟上?:。

## 匹配位置

匹配字符之间的位置，而不是实际的字符。

{% raw %}
<table>
    <thead>
        <tr>
            <th>字符</th>
            <th>含义</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>^</td>
            <td>开头</td>
        </tr>
        <tr>
            <td>$</td>
            <td>结尾</td>
        </tr>
        <tr>
            <td>\b</td>
            <td>单词边界，即\w和\W之间，或者\w和字符串开头或结尾之间</td>
        </tr>
        <tr>
            <td>\B</td>
            <td>非单词边界</td>
        </tr>
        <tr>
            <td>(?=...)</td>
            <td>零宽正向先行断言</td>
        </tr>
        <tr>
            <td>(?!...)</td>
            <td>零宽负向先行断言</td>
        </tr>
    </tbody>
</table>
{% endraw %}

零宽断言：需要捕获的内容前后必须是特定内容，但又不捕获这些特定内容。

## 转义

如果想要匹配在正则表达式中有特殊用途的元字符，必须对它们进行转义。

```
( ) [ ] { } \ / | ^ $ ? * + . = ! :
```
