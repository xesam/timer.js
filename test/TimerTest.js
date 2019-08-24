const assert = require('assert');
const {Timer} = require('../index');
const {Clock} = require('js-mock-clock');

const clock = new Clock().bind(global);

let count = 0;

new Timer(2000, {
    onStart(timer) {
        console.log('onStart');
    },
    onStop(timer) {
        console.log('onStop');
    },
    onTick(timer, fly) {
        console.log('onTick', fly);
        count += 1;
    }
}).start();

assert.strictEqual(count, 0);

clock.tick(2000);
assert.strictEqual(count, 1);

clock.tick(2000);
assert.strictEqual(count, 2);

clock.tick(2000);
assert.strictEqual(count, 3);