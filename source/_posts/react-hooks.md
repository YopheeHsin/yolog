---
title: React Hook
date: 2022-05-05 00:00:00
categories: React
keywords: React, React Hook, JavaScript
description: React Hook的基本用法
---

React 16.8的新增特性Hook，可以在函数组件中使用state以及生命周期等。

## useState

返回一个state和更新该state的方法，参数为初始值。setState接收一个新的state值并将组件的一次重新渲染加入队列，后续的重新渲染中，state始终是更新后最新的值。如果新state需要通过旧state计算得出，可以使用函数式更新，将函数传递给setState，该函数参数为旧state，并返回更新后的值。

```
function Counter() {
    const [count, setCount] = useState(0);
    return <button
        onClick={() => setCount(prevCount => prevCount + 1)}
    >{count}</button>;
}
```

## useEffect

在组件渲染到屏幕之后执行副作用（发送请求、改变DOM、添加订阅、设置定时器、记录日志等）。

默认情况下，effect会在每轮组件渲染完成后都执行，可以通过给useEffect传递第二个依赖数组参数来控制。传入空数组，则只在组件挂载时执行一次；如果数组非空，当数组元素值在两次重渲染之间发生变化时，effect才会再执行。

如果需要在组件卸载时清除effect创建的订阅或计时器等，useEffect需返回一个清除函数。如果组件多次渲染，则会在执行下一个effect之前，先清除上一个effect。

```
useEffect(() => {
    const timeId = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(timeId);
}, []);
```

## useContext

返回一个context对象（React.createContext）的当前值，其值由上层组件中距离当前组件最近的context对象的Provider的value prop决定，当Provider的value prop更新时，该Hook会触发组件重渲染。

```
import { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

const LocaleContext = createContext('');

function App() {
    const locale = useContext(LocaleContext);
    return <p>{locale}</p>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <LocaleContext.Provider value="zhCN">
        <App />
    </LocaleContext.Provider>
);
```

## useReducer

useState的替代方案，当state逻辑复杂或包含多个子值时使用，接收形如(state, action) => newState的reducer，返回当前state及其配套的dispatch方法。

```
function reducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'delete':
            return state.filter((d, i) => i !== action.payload);
        default:
            throw new Error();
    }
}

function List() {
    const [state, dispatch] = useReducer(reducer, []);
    const onAdd = e => {
        if (e.keyCode === 13) {
            dispatch({
                type: 'add',
                payload: e.target.value
            });
            e.target.value = '';
        }
    };
    return (
        <>
            <input onKeyUp={onAdd} />
            <ul>
                {state.map((d, i) => <li key={d}>
                    {d}
                    <button
                        onClick={() => dispatch({ type: 'delete', payload: i })}
                    >X</button>
                </li>)}
            </ul>
        </>
    );
}
```

## useCallback

把内联回调函数及依赖项数组作为参数传入useCallback，它将返回该回调函数的缓存版本，该回调函数仅在某个依赖项改变时才会更新。传给React.memo子组件时，可以避免因回调函数变动所导致的重复渲染。

useCallback(fn, deps)相当于useMemo(() => fn, deps)。

## useMemo

把高开销方法和依赖项数组作为参数传入useMemo，它仅会在某个依赖项改变时才重新计算缓存值。

## useRef

useRef会在每次渲染时返回同一个ref对象，其current属性中可保存任何可变值。变更current属性不会引发组件重新渲染。

```
function App() {
    const [count, setCount] = useState(0);
    const prevRef = useRef();
    useEffect(() => {
        prevRef.current = count;
    });
    return <button
        onClick={() => setCount(count + 1)}
    >{prevRef.current} -&gt; {count}</button>;
}
```

## useImperativeHandle

使用ref时自定义暴露给父组件的实例值，与<a href="http://xinyuefei.com/js/react.html#Refs">forwardRef</a>一起使用。

```
const FancyInput = forwardRef((props, ref) => {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current.focus()
    }));
    return <input ref={inputRef} />;
});

function App() {
    const ref = useRef();
    return <>
        <FancyInput ref={ref} />
        <button
            onClick={() => ref.current.focus()}
        >focus</button>
    </>;
}
```

## useLayoutEffect

useEffect在组件渲染到屏幕之后执行，useLayoutEffect则是在DOM结构更新后、渲染前执行，可以使用它来读取DOM布局并同步触发重渲染（会阻塞浏览器渲染）。

```
function App() {
    const [count, setCount] = useState(0);
    useLayoutEffect(() => {
        const pre = Date.now();
        while (Date.now() - pre < 500) {}
        if (count === 0) setCount(Math.random());
    }, [count]);
    return <button onClick={() => setCount(0)}>{count}</button>;
}
```

## useDeferredValue

React 18增加了并发渲染。将更新划分为urgent update，即用户期望马上响应的紧急更新，例如鼠标单击或键盘输入等；以及transition update，一些可以接受延迟的过渡更新，如查询、搜索、推荐结果的展示等。

useDeferredValue用来标记哪些状态拥有更低的优先级。

## useTransition

useTransition明确地告诉React哪些更新具有更低的优先级。

```
function App() {
    const [isPending, startTransition] = useTransition();
    const [count, setCount] = useState(0);

    function onClick() {
        startTransition(() => {
            setCount(c => c + 1);
        });
    }

    return (
        <div>
            {isPending && 'pending...'}
            <button onClick={onClick}>{count}</button>
        </div>
    );
}
```