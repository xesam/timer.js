const assert = require('assert');
const {Tick} = require('../index');
const {Clock} = require('js-mock-clock');

const clock = new Clock().bind(global);

let count = 0;

_ticker = new Tick({
    onTimeout(time) {
        console.log(time);
        count += 1;
    }
});

_ticker.start(2000);

assert.strictEqual(count, 0);

clock.tick(2000);
assert.strictEqual(count, 1);

clock.tick(2000);
assert.strictEqual(count, 1);

clock.tick(2000);
assert.strictEqual(count, 1);