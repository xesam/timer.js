const {CounterTimer} = require('../src');

new CounterTimer(1000, {
    onStart(timer) {
        console.log('onStart');
    },
    onStop(timer) {
        console.log('onStop');
    },
    onTick(timer, count) {
        console.log(count);
    }
}).start();
