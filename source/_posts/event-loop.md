---
title: Event Loop事件循环执行过程
date: 2019-07-01 00:00:00
categories: JavaScript
keywords: 事件循环, event Loop, JavaScript
description: 同步任务在主线程上执行，形成stack执行栈，主线程从task queue任务队列中读取事件的过程不断循环的运行机制称为event loop事件循环
---

JavaScript语言是单线程的，同步任务在主线程上执行，形成一个执行栈(JS stack)。

异步任务，包括setTimeout、setInterval、setImmediate、requestAnimationFrame、I/O、UI rendering等，也被称作宏任务(macrotask)。

主线程之外存在一个先进先出的任务队列(Task queue)，异步任务的运行结果会在任务队列中放置对应事件(callback)。

一旦执行栈中的所有同步任务执行完毕，系统就会读取任务队列的事件并执行之。主线程从任务队列中读取事件的过程是不断重复循环的，这种运行机制便称为事件循环Event Loop。

JavaScript中还存在另外的一类异步任务，包括process.nextTick、Promise、MutationObserver，以及已经废弃的Object.observe，被称做微任务(microtask)，它们的回调函数会被放进微任务队列(Microtask queue)。

执行栈中的当前任务执行结束后，会立即检查并处理微任务队列，处理过程中产生的微任务也会被立即处理掉，而不用等下次事件循环。

通俗来讲，macrotask的规则是等下一班车，microtask的规则是挂在当前车尾，而且允许现做现卖。

下面是JavaScript事件循环Event Loop执行示例：

{% raw %}
<style>
.event-loop-walkthrough {
	position: relative;
	margin: 2em 0;
	border-radius: 3px;
	overflow: hidden;
}

.event-loop-walkthrough .highlight,
.event-loop-walkthrough table {
	margin: 0;
}

.event-loop-walkthrough table td {
	line-height: 1.4em;
	padding: 0 1rem;
	vertical-align: top;
	overflow: hidden;
}

.event-loop-walkthrough table td+td {
	padding: 0;
	border-left: 1px solid #d7dcd2;
}

.event-loop-label {
	height: calc(1.4em + 5px);
	margin-top: 5px;
}

.event-loop-items {
	display: flex;
	margin-top: 5px;
}

.event-loop-log .event-loop-items {
	flex-flow: row wrap;
}

.event-loop-item {
	margin: 0 0 5px 5px;
	padding: 0 5px;
	background-color: #d7dcd2;
	white-space: nowrap;
	opacity: 0;
}

.event-loop-commentary {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 320px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 1rem;
	font-size: 1.25rem;
	color: #fff;
}

.event-loop-commentary-item {
	padding: .5rem 1rem;
	background-color: rgba(0, 0, 0, .8);
	border-radius: 3px;
	opacity: 0;
}

.js-source {
	position: relative;
	border-bottom: 1px solid #d7dcd2;
}

.js-source .line-highlight {
	position: absolute;
	top: 1rem;
	right: 0;
	left: 0;
	background-color: rgba(0, 0, 0, .15);
	border-left: .5em solid rgba(0, 0, 0, .2);
	z-index: 1;
	opacity: 0;
}

.js-source .line-highlight::after {
	content: 'yo';
	line-height: 1.4em;
	color: transparent;
}

.event-loop-controls {
	padding: 1rem 0;
}

.event-loop-controls button {
	position: relative;
	margin-right: .1em;
	padding: 0 1em;
	background-color: #f2f6ed;
	border: 1px solid #d7dcd2;
	border-radius: 3px;
	cursor: pointer;
}

.event-loop-walkthrough .prev-btn::after,
.event-loop-walkthrough .next-btn::after {
	content: '';
	display: block;
	position: absolute;
	top: .3em;
	width: 0;
	height: 0;
	border-width: .3em .5em;
	border-style: solid;
	border-color: transparent;
}

.event-loop-walkthrough .prev-btn::after {
	left: .3em;
	border-right-color: #08a8e6;
}

.event-loop-walkthrough .next-btn::after {
	right: .3em;
	border-left-color: #08a8e6;
}

.event-loop-controls .prev-btn:hover::after {
	border-right-color: #0791c6;
}

.event-loop-controls .prev-btn:active::after {
	border-right-color: #0677a2;
}

.event-loop-controls .next-btn:hover::after {
	border-left-color: #0791c6;
}

.event-loop-controls .next-btn:active::after {
	border-left-color: #0677a2;
}

.event-loop-controls span {
	margin: 0 0 0 1em;
	text-align: center;
	color: #83887c
}
</style>
{% endraw %}


{% raw %}
<div class="event-loop-walkthrough content">
	<div class="js-source">
		<div class="line-highlight"></div>
		<div class="code-highlight">
{% endraw %}
``` JavaScript
console.log('script start')

setTimeout(function() {
    console.log('setTimeout')
}, 0)

Promise.resolve().then(function() {
    console.log('promise1')
}).then(function() {
    console.log('promise2')
})

console.log('script end')
```
{% raw %}
		</div>
	</div>
	<table>
		<tr class="task-queue">
			<td>
				<div class="event-loop-label">Task queue</div>
			</td>
			<td>
				<div class="event-loop-items">
					<div class="event-loop-item">Run script</div>
					<div class="event-loop-item">setTimeout callback</div>
				</div>
			</td>
		</tr>
		<tr class="microtask-queue">
			<td>
				<div class="event-loop-label">Microtask queue</div>
			</td>
			<td>
				<div class="event-loop-items">
					<div class="event-loop-item">Promise then</div>
					<div class="event-loop-item">Promise then</div>
				</div>
			</td>
		</tr>
		<tr class="js-stack">
			<td>
				<div class="event-loop-label">JS stack</div>
			</td>
			<td>
				<div class="event-loop-items"></div>
			</td>
		</tr>
		<tr class="event-loop-log">
			<td>
				<div class="event-loop-label">Log</div>
			</td>
			<td>
				<div class="event-loop-items">
					<div class="event-loop-item">script start</div>
					<div class="event-loop-item">script end</div>
					<div class="event-loop-item">promise1</div>
					<div class="event-loop-item">promise2</div>
					<div class="event-loop-item">setTimeout</div>
				</div>
			</td>
		</tr>
	</table>
	<div class="event-loop-controls">
		<button type="button" class="prev-btn">&nbsp;</button>
		<button type="button" class="next-btn">&nbsp;</button>
		<span>点击按钮切换执行步骤</span>
	</div>
	<div class="event-loop-commentary">
		<div class="event-loop-commentary-item"></div>
	</div>
</div>
{% endraw %}

具体执行过程大致如下：

1. JS线程启动，创建事件循环
2. 当前同步代码Run script为任务队列的第一项
3. script加入执行栈
4. 执行`console.log('script start')`，输出日志“script start”
5. 执行`setTimeout...`，其回调函数被插入任务队列
6. 执行`Promise.resolve()...`，其回调函数`console.log('promise1')`被插入微任务队列
7. 执行`console.log('script end')`，输出日志“script end”
8. script出栈，执行栈为空，立即检查并处理微任务队列
9. 微任务`console.log('promise1')`入执行栈执行，输出日志“promise1”
10. 处理过程中产生新的微任务`console.log('promise2')`立即入执行栈处理，输出日志“promise2”
11. Run script事件结束，开始检查任务队列
12. `console.log('setTimeout')`入执行栈执行，输出日志“setTimeout”
13. 进行新一轮事件循环

所以这段代码Log日志的出现顺序为：script start、script end、promise1、promise2、setTimeout。

<cite>参考：
https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
http://www.ruanyifeng.com/blog/2014/10/event-loop.html
http://www.ayqy.net/blog/javascript-macrotask-vs-microtask/</cite>


{% raw %}
<script>
(function() {
	function transition(el, obj, duration) {
		return new Promise(function(resolve, reject) {
			if (obj.transform) {
				obj['-webkit-transform'] = obj.transform;
			}

			var objKeys = Object.keys(obj);

			if (duration) {
				el.style.transitionProperty = objKeys.join();
				el.style.transitionTimingFunction = 'ease-in-out';
				el.style.transitionDuration = duration + 's';
				el.offsetLeft; // style recalc

				el.addEventListener('transitionend', function te() {
					el.style.transitionProperty = '';
					el.style.transitionTimingFunction = '';
					el.style.transitionDuration = '';
					resolve();
					el.removeEventListener('transitionend', te);
				});
			} else {
				resolve();
			}

			objKeys.forEach(function(key) {
				el.style.setProperty(key, obj[key]);
			});
		});
	}

	function EventLoopAnimation(el) {
		this._initalState = el;
		this._states = [];
		this._el = el;
		this._queue = Promise.resolve();
		this._reset();
	}

	EventLoopAnimation.prototype._reset = function() {
		var newEl = this._initalState.cloneNode(true);
		this._tasksShown = 0;
		this._microtasksShown = 0;
		this._tasksRemoved = 0;
		this._microtasksRemoved = 0;
		this._logsShown = 0;
		this._currentPos = 0;

		this._el.parentNode.insertBefore(newEl, this._el);
		this._el.parentNode.removeChild(this._el);
		this._el = newEl;
		this._taskRail = this._el.querySelector('.task-queue .event-loop-items');
		this._microtaskRail = this._el.querySelector('.microtask-queue .event-loop-items');
		this._jsStack = this._el.querySelector('.js-stack .event-loop-items');
		this._log = this._el.querySelector('.event-loop-log .event-loop-items');
		this._codeBar = this._el.querySelector('.line-highlight');
		this._commentary = this._el.querySelector('.event-loop-commentary-item');

		var onClick = function(event) {
			var className = event.target.getAttribute('class');
			if (className === 'prev-btn') {
				event.preventDefault();
				if (event.type == 'click') {
					this.back();
				}
			} else if (className === 'next-btn') {
				event.preventDefault();
				if (event.type == 'click') {
					this.forward(true);
				}
			}
		}.bind(this);

		this._el.addEventListener('click', onClick);
	};

	EventLoopAnimation.prototype.forward = function(animate) {
		this._queue = this._queue.then(function() {
			var state = this._states[this._currentPos];
			if (!state) return this.goTo(0);
			this._currentPos++;
			return Promise.all(
				state.map(function(func) {
					return func(animate);
				})
			);
		}.bind(this));
	};

	EventLoopAnimation.prototype.goTo = function(pos) {
		this._queue = this._queue.then(function() {
			this._reset();
			while (pos--) {
				this.forward(false);
			}
		}.bind(this));
	};

	EventLoopAnimation.prototype.back = function() {
		this._queue = this._queue.then(function() {
			if (this._currentPos === 0) return this.goTo(this._states.length);
			return this.goTo(this._currentPos - 1);
		}.bind(this));
	};

	EventLoopAnimation.prototype.state = function() {
		this._states.push([]);
		return this;
	};

	EventLoopAnimation.prototype.action = function(func) {
		this._states[this._states.length - 1].push(func);
		return this;
	};

	EventLoopAnimation.prototype.pushTask = function(activated) {
		return this.action(function(animate) {
			var newTask = this._taskRail.children[this._tasksShown];
			this._tasksShown++;

			if (activated) {
				newTask.style.backgroundColor = '#FFDF1E';
			}

			return transition(newTask, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.pushMicrotask = function() {
		return this.action(function(animate) {
			var newTask = this._microtaskRail.children[this._microtasksShown];
			this._microtasksShown++;

			return transition(newTask, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.pushStack = function(text) {
		return this.action(function(animate) {
			var div = document.createElement('div');
			div.className = 'event-loop-item';
			div.textContent = text;
			div.style.backgroundColor = '#FFDF1E';
			this._jsStack.appendChild(div);
			return transition(div, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.popStack = function(text) {
		return this.action(function(animate) {
			var div = this._jsStack.children[this._jsStack.children.length - 1];
			return transition(div, {
				opacity: 0
			}, 0.2 * animate).then(function() {
				this._jsStack.removeChild(div);
			}.bind(this));
		}.bind(this));
	};

	EventLoopAnimation.prototype.showCodeBar = function() {
		return this.action(function(animate) {
			return transition(this._codeBar, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.hideCodeBar = function() {
		return this.action(function(animate) {
			return transition(this._codeBar, {
				opacity: 0
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.pushLog = function() {
		return this.action(function(animate) {
			var newLog = this._log.children[this._logsShown];
			this._logsShown++;

			return transition(newLog, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.moveToLine = function(num) {
		return this.action(function(animate) {
			var barHeight = this._codeBar.getBoundingClientRect().height;

			return transition(this._codeBar, {
				transform: 'translateY(' + ((num - 1) * barHeight) + 'px)'
			}, 0.3 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.commentary = function(text) {
		return this.action(function(animate) {
			this._commentary.textContent = text;
			return transition(this._commentary, {
				opacity: 1
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.hideCommentary = function() {
		return this.action(function(animate) {
			return transition(this._commentary, {
				opacity: 0
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.activateMicrotask = function() {
		return this.action(function(animate) {
			var div = this._microtaskRail.children[this._microtasksRemoved];
			return transition(div, {
				'background-color': '#FFDF1E'
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.shiftMicrotask = function() {
		return this.action(function(animate) {
			this._microtasksRemoved++;
			var offset;
			var offsetEl = this._microtaskRail.children[this._microtasksRemoved];

			if (offsetEl) {
				offset = offsetEl.offsetLeft;
			} else {
				offset = this._microtaskRail.offsetWidth;
			}

			return transition(this._microtaskRail, {
				'transform': 'translateX(' + (-offset + 5) + 'px)'
			}, 0.3 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.activateTask = function() {
		return this.action(function(animate) {
			var div = this._taskRail.children[this._tasksRemoved];
			return transition(div, {
				'background-color': '#FFDF1E'
			}, 0.2 * animate);
		}.bind(this));
	};

	EventLoopAnimation.prototype.shiftTask = function() {
		return this.action(function(animate) {
			this._tasksRemoved++;
			var offset;
			var offsetEl = this._taskRail.children[this._tasksRemoved];

			if (offsetEl) {
				offset = offsetEl.offsetLeft;
			} else {
				offset = this._taskRail.offsetWidth;
			}

			return transition(this._taskRail, {
				'transform': 'translateX(' + (-offset + 5) + 'px)'
			}, 0.3 * animate);
		}.bind(this));
	};

	window.EventLoopAnimation = EventLoopAnimation;
}());

new EventLoopAnimation(document.querySelector('.event-loop-walkthrough'))
	.state().moveToLine(1).pushTask(true).pushStack('script').showCodeBar()
	.state().pushLog()
	.state().moveToLine(3)
	.state().commentary('setTimeout的回调函数被插入任务队列')
	.state().hideCommentary().pushTask()
	.state().moveToLine(7)
	.state().commentary('Promise的回调函数被插入微任务队列')
	.state().hideCommentary().pushMicrotask()
	.state().moveToLine(13)
	.state().pushLog()
	.state().hideCodeBar().popStack()
	.state().commentary('执行栈为空，立即检查并处理微任务队列')
	.state().hideCommentary().activateMicrotask()
	.state().showCodeBar().moveToLine(8).pushStack('Promise callback')
	.state().pushLog()
	.state().hideCodeBar().commentary('处理过程中产生新的微任务')
	.state().hideCommentary().pushMicrotask()
	.state().popStack().commentary('新微任务立即入执行栈处理')
	.state().hideCommentary()
	.state().shiftMicrotask().activateMicrotask()
	.state().showCodeBar().moveToLine(10).pushStack('Promise callback')
	.state().pushLog()
	.state().hideCodeBar().popStack().shiftMicrotask()
	.state().commentary('Run script事件结束，开始检查任务队列')
	.state().hideCommentary()
	.state().shiftTask().activateTask()
	.state().showCodeBar().moveToLine(4).pushStack('setTimeout callback')
	.state().pushLog()
	.state().hideCodeBar().popStack()
	.state().shiftTask()
	.state().commentary('进行新一轮事件循环');
</script>
{% endraw %}
