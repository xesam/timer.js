const {Timer} = require('../src');

new Timer(5000, {
    onTick(timer, left) {
        console.log(left);
    },
    onFinish(timer) {
        console.log('finished');
        console.log(timer);
    }
}).start();
