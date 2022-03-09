# A simple js Timer

## install 

```shell script
    npm install @xesam/timer
```

## Timer.js

events:

    start
    pause
    resume
    stop
    tick

## sample

```javascript
    const timer = new Timer(1000, event => {
        console.log(event);
    });
    timer.start(); // {type:'start'}
    timer.pause();
    timer.resume();
    timer.stop();
```

## CounterTimer.js

events:

    start
    pause
    resume
    stop
    tick
    
## sample

```javascript
    const timer = new CounterTimer(1000, function(event) {
        console.log(event, this.getCount());
    });
    timer.start(); // {type:'start'}
    timer.pause();
    timer.resume();
    timer.stop();
```

## CountdownTimer.js

events:

    start
    pause
    resume
    stop
    tick
    finish
    
## sample

```javascript
    const timer = new CountdownTimer(10000, 1000, event => {
        console.log(event);
    });
    timer.start(); // {type:'start'}
    timer.pause();
    timer.resume();
    timer.stop();
```