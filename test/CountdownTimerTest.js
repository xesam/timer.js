const assert = require('assert');
const {CountdownTimer} = require('../index');
const {Clock} = require('js-mock-clock');

const clock = new Clock().bind(global);

let count = 0;

new CountdownTimer(4500, 1000, {
    onTick(timer, left) {
        console.log(left);
    },
    onFinish(timer) {
        console.log('finished');
    }
}).start();
