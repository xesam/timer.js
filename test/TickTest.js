const {Tick} = require('../src');

_ticker = new Tick({
    onTimeout(time) {
        console.log(time);
    }
});

_ticker.start(2000);

// setTimeout(() => {
//     _ticker.pause();
// }, 500);
//
//
// setTimeout(() => {
//     _ticker.resume();
// }, 1000);
//
//
// setTimeout(() => {
//     _ticker.pause();
// },1500);
//
//
// setTimeout(() => {
//     _ticker.resume();
// }, 2000);


setTimeout(() => {
    _ticker.stop();
    console.log(_ticker.getTime());
}, 500);
