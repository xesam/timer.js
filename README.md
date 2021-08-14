# A simple js Timer

## install 

```shell script
    npm install @xesam/timer
```

## Timer.js

```javascript
    const timer = new Timer(1000, event => {
        console.log(event);
    });
    timer.start();
    timer.pause();
    timer.resume();
    timer.stop();
```

## CounterTimer.js

```javascript
    const timer = new CounterTimer(1000, event => {
        console.log(event, this.getCount());
    });
    timer.start();
    timer.pause();
    timer.resume();
    timer.stop();
```

```javascript
    const timer = new CounterTimer(1000, event => {
        console.log(event, this.getCount());
    }, 10);
    timer.start();
    timer.pause();
    timer.resume();
    timer.stop();
```

## CountdownTimer.js

```javascript
    const timer = new CountdownTimer(10000, 1000, event => {
        console.log(event);
    });
    timer.start();
    timer.pause();
    timer.resume();
    timer.stop();
```