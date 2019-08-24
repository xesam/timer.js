const assert = require('assert');
const {CounterTimer} = require('../index');
const {Clock} = require('js-mock-clock');

const clock = new Clock().bind(global);

let count = 0;

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
