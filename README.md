# @xesam/timer

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
    new Timer(interval, eventHandleFunction); // eventHandler 会接收到一个 event 事件
```
event 事件类型:

    start
    pause
    resume
    stop
    tick

比如每次 tick 都会收到

    {type:'tick'}

的事件。

```javascript
    const timer = new Timer(1000, event => {
        console.log(event); // 每隔 1 秒种，会收到一次 event 事件
        switch(event.type) {
            case 'start':
                console.log('timer start');
                break;
            case 'pause':
                console.log('timer pause');
                break;
            case 'resume':
                console.log('timer resume');
                break;
            case 'stop':
                console.log('timer stop');
                break;
            case 'tick':
                console.log('timer tick');
                break;
            default:
                break;
        }
    });
    timer.start(); 
    timer.pause();
    timer.resume();
    timer.stop();
```

## 定时器（CounterTimer）

使用方法：
```javascript
    new Timer(interval, eventHandleFunction);
```

相比 Timer，CounterTimer 增加了 count 属性，表示计数器的值。每次 tick 都会增加 count 的值。

```javascript
    const timer = new CounterTimer(1000, function(event) {
        console.log(event, this.getCount());
    });
    timer.start(); 
    timer.pause();
    timer.resume();
    timer.stop();
```

## 倒计时计时器（CountdownTimer）

使用方法：
```javascript
    new Timer(total, interval, eventHandleFunction);
```

相比其他的计时器，CountdownTimer 增加了 finish 事件, 表示倒计时结束。
同时，在 tick 和 finish 事件中，都增加了 flyMills 属性，表示已经经过的时间。

示例：

```javascript
    const timer = new CountdownTimer(10000, 1000, event => {
        console.log(event);
        if(event.type === 'tick' || event.type === 'finish'){
            console.log(event.flyMills);
        }
    });
    timer.start(); 
    timer.pause();
    timer.resume();
    timer.stop();
```