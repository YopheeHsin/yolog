---
title: React基本用法
date: 2021-09-09 00:00:00
categories: JavaScript
keywords: React, Redux, JavaScript
description: React、Redux的基本用法
---

React是用于构建用户界面的JavaScript库，声明式编写UI，数据变动时React能高效更新并渲染合适的组件。

## 准备工作

使用<a href="https://facebook.github.io/create-react-app/">Create React App</a>创建项目。

``` bash
npx create-react-app my-app
```

## JSX

JSX标签语法是JavaScript的语法扩展，用来描述UI视图和事件逻辑等。Babel会把JSX转译成React.createElement()函数调用，创建React元素对象。

通过大括号{}嵌入变量或表达式，在属性中嵌入表达式时，不要在大括号外面加引号。

如果一个标签中无内容，可以使用/>闭合标签。

``` JavaScript
const element = <h1>Hello, {name}</h1>;
const element = <img src={user.avatarUrl} />;
```

JSX也是表达式，可以在if语句和for循环中使用JSX，将JSX赋值给变量，把JSX当作参数传入，以及在函数中返回JSX。

``` JavaScript
function getGreeting(user) {
    if (user) return <h1>Hello, {formatName(user)}</h1>;
    return <h1>Hello, Stranger</h1>;
}
```

JSX语法上更接近JavaScript而不是HTML，因而使用camelCase（小驼峰）来定义属性名称，class变成了className、for写成htmlFor、tabindex则为tabIndex。

为了便于阅读，将JSX拆分为多行，此时建议将内容包裹在括号()中。

``` JavaScript
const element = (
    <h1 className="welcome">
        Hello, {formatName(user)}!
    </h1>
);
```

## 渲染

将React元素渲染到DOM节点中。

``` JavaScript
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('app'));
```

## 组件、Props

组件即可复用的代码片段，接受入参props，返回React元素。

组件名称必须以大写字母开头。

### 函数组件

``` JavaScript
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}
```

### class组件

``` JavaScript
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

除了DOM标签，React元素也可以是自定义组件。当React元素为自定义组件时，会将JSX接收的属性（attributes）和子组件（children）合并成一个props对象传递给组件。

## State、生命周期

React组件必须像纯函数一样保护其props的只读性。如果需要组件随用户操作、网络响应或者其他变化而动态更改输出内容，可以使用state。

``` JavaScript
class Clock extends React.Component {
    constructor(props) {
        // 使用props参数调用父类的构造函数
        super(props);
        // 在构造函数中为state赋初值，这里是唯一可以给state赋值的地方
        this.state = { date: new Date() };
    }

    tick() {
        // 调用setState()，让React知道state已变，React会重新调用render()
        this.setState({ date: new Date() });
    }

    componentDidMount() {
        // 可以在class中随意添加不参与数据流的额外字段，例如这里的timeId
        this.timeId = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timeId);
    }

    render() {
        const { date } = this.state;
        return <p>{date.toLocaleTimeString()}</p>;
    }
}
```

直接修改state不会重新渲染组件，而应该使用setState()。

出于性能考虑，React可能会把多个setState()调用合并成一个，这样this.props和this.state可能会异步更新。如果更新下一个状态时依赖这些值，需要setState()接收一个函数，这个函数用上一个state作为第一个参数，将此次更新被应用时的props做为第二个参数。

``` JavaScript
this.setState((state, props) => ({
    counter: state.counter + props.increment
}));
```

组件的生命周期包括组件实例被创建并插入DOM中，组件的props或state发生变化时触发更新，以及组件从DOM中移除的过程。

### 挂载
- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

### 更新
- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

### 卸载
- componentWillUnmount()

## render()方法

render()方法是class组件中唯一必须实现的方法，有多种返回类型。

- 返回JSX创建的DOM节点或者自定义组件
- 使用Fragment返回多个元素
- 使用Portal将子节点渲染到父组件以外的DOM节点中
- 将字符串或数字渲染为文本节点
- 布尔类型或null则什么都不渲染

``` JavaScript
// 当不需要key或属性时，可使用短语法<>和</>
function Glossary(props) {
    return (
        <dl>
            {props.items.map(item => (
                <React.Fragment key={item.id}>
                    <dt>{item.term}</dt>
                    <dd>{item.description}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}
```

对话框、悬浮卡以及提示框等场景，使用Portal将组件渲染到指定的DOM中。这样做不会影响事件冒泡。

``` JavaScript
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}
```

## 事件处理

React事件命名采用camelCase（小驼峰），使用JSX时需传入一个函数用作事件处理。

``` JavaScript
function Form() {
    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
        </form>
    );
}
```

JavaScript中，class的方法默认不会绑定this实例，解决办法有：

- 在constructor()中使用bind为事件处理函数绑定实例
- 在class中使用箭头函数定义方法
- 在回调中使用箭头函数，此时如果该回调函数作为prop传入子组件时，可能会额外重新渲染

``` JavaScript
constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
}
```

``` JavaScript
class ClickButton extends React.Component {
    handleClick = () => { console.log(this); };

    render() {
        return (
            <button onClick={this.handleClick}>
                Click
            </button>
        );
    }
}
```

``` JavaScript
class ClickButton extends React.Component {
    handleClick() { console.log(this); }

    render() {
        return (
            <button onClick={() => this.handleClick()}>
                Click
            </button>
        );
    }
}
```

通过箭头函数或者bind为事件处理函数传递额外参数。下面两种情况，事件对象e都会被作为第二个参数传递。使用箭头函数时，事件对象必须显式传递，而bind方式的事件对象会被隐式传递。

``` JavaScript
<button onClick={e => this.del(id, e)}>Delete</button>
<button onClick={this.del.bind(this, id)}>Delete</button>
```

## Refs

通过Refs访问DOM节点或者React组件实例。

``` JavaScript
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        // 使用React.createRef()创建ref
        this.textInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    focusTextInput() {
        // 通过ref的current属性访问DOM节点
        this.textInput.current.focus();
    }

    render() {
        // 通过ref属性将上面创建的ref附加到input节点
        return (
            <div>
                <input ref={this.textInput} />
                <button
                    onClick={this.focusTextInput}
                >Focus the text input</button>
            </div>
        );
    }
}
```

``` JavaScript
class AutoFocusTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    componentDidMount() {
        // 通过ref的current属性访问组件实例
        this.textInput.current.focusTextInput();
    }

    render() {
        return <CustomTextInput ref={this.textInput} />;
    }
}
```

上面这种方式不能在函数组件上使用，因为它们没有实例。在函数组件上，可以使用forwardRef进行Refs转发，将ref通过函数组件传递到其子组件上。

``` JavaScript
const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref}>{props.children}</button>
));

// 中转获取button
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

在函数组件内部使用useRef。

``` JavaScript
function CustomTextInput(props) {
    // 使用useRef创建ref
    const textInput = useRef(null);

    function focusTextInput() {
        textInput.current.focus();
    }

    return (
        <div>
            <input ref={textInput} />
            <button
                onClick={focusTextInput}
            >Focus the text input</button>
        </div>
    );
}
```

React也支持另一种设置Refs的方式，称为“回调Refs”。即传递一个函数，在这个函数中接受DOM节点或者组件实例作为参数，以使它们能在其他地方被存储和访问。

``` JavaScript
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
        this.focusTextInput = () => {
            if (this.textInput) this.textInput.focus();
        };
    }

    componentDidMount() {
        this.focusTextInput();
    }

    render() {
        return (
            <div>
                <input ref={this.setTextInputRef} />
                <button
                    onClick={this.focusTextInput}
                >Focus the text input</button>
            </div>
        );
    }
}
```

## 表单

在React中使用表单元素，有“受控组件”或者“非受控组件”两种形式。

“受控组件”自己维护内部state，并根据用户输入等操作进行更新。

``` JavaScript
class InfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            healthy: true,
            gender: 'male',
            city: ''
            hobby: {
                basketball: false,
                football: false,
                badminton: false
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        console.log(event.target.name, event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                />

                <input
                    name="healthy"
                    type="checkbox"
                    checked={this.state.healthy}
                    onChange={this.handleChange}
                />

                <input
                    name="gender"
                    type="radio"
                    value="male"
                    checked={this.state.gender === 'male'}
                    onChange={this.handleChange}
                />
                <input
                    name="gender"
                    type="radio"
                    value="female"
                    checked={this.state.gender === 'female'}
                    onChange={this.handleChange}
                />

                <select value={this.state.city} onChange={this.handleChange}>
                    <option value="BJ">北京</option>
                    <option value="SH">上海</option>
                </select>

                <input type="submit" value="提交" />
            </form>
        );
    }
}
```