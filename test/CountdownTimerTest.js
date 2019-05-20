const {CountdownTimer} = require('../src');

new CountdownTimer(4500, 1000, {
    onTick(timer, left) {
        console.log(left);
    },
    onFinish(timer) {
        console.log('finished');
    }
}).start();
