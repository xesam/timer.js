# Timer.js

一个简单的 Javascript 计时器封装（A simple javascript Timer）；增加了一些控制方法：

    start(timeout) // 开启计时器
    pause() // 暂停计时器
    resume() // 恢复计时器
    stop() // 停止计时器

## install

```shell script
    npm install @xesam/timer
```

## 普通计时器（Timer）

使用方法：

```javascript
const timer = new Timer(interval, eventHandleFunction); // eventHandler 会接收到一个 event 事件
timer.on('tick', () => {
});
timer.start();
timer.pause();
timer.resume();
timer.stop();
```

默认的 event 事件类型:

    start
    pause
    resume
    stop
    tick

比如每次 tick 都会收到 `tick` 事件，而 start, pause, resume, stop 则会收到 `start,pause，resume，stop`的事件。

```javascript
const timer = new Timer(1000);
timer.on('start', console.log);
timer.on('stop', console.log);
timer.on('pause', console.log);
timer.on('resume', console.log);
timer.on('tick', console.log);
```

## 定时器（CounterTimer）

使用方法：

```javascript
const timer = new CounterTimer(interval);
timer.on('tick', () => {
    console.log(timer.getCount());
});
timer.start();
timer.pause();
timer.resume();
timer.stop();
```

相比 Timer，CounterTimer 增加了 getCount() 方法，用来获取计数器的值。每次 tick 都会增加 count 的值。

可以指定最大的count值，在到达最大的 count 之后，会触发 `done` 事件：

```javascript
const timer = new CounterTimer(interval, 3);
timer.on('done', () => {
    console.log(timer.getCount()); // `3`
});
timer.start();
```

## 元素定时发射（EmitterTimer）

将数组元素定时发射出去的计时器, `tick` 参数是 {data, index}:

    index : emit 元素的数组索引
    data : index 对应的数组元素

```javascript
const timer = new EmitterTimer(1000);
timer.on('tick', ({ data, index }) => {
    console.log(index, data);
});
timer.start();
```

## 倒计时计时器（CountdownTimer）

使用方法：

```javascript
const timer = new CountdownTimer(1000, 10000);
timer.on('tick', ({ leftMills }) => {
    console.log(leftMills);
});
timer.start();
timer.pause();
timer.resume();
timer.stop();
```

相比其他的计时器，CountdownTimer 增加了 done 事件, 表示倒计时结束。
同时，在 tick 和 done 事件中，都增加了 leftMills 属性，表示剩余的时间。

## ChangeLog

### 0.1.0

1. 增加 EmitterTimer；
2. 增加 on/emit 接口；