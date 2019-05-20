export class Clock {
    constructor() {
        this.elapsed = 0;
        this.timeline = [];
        this.id = 1;
    }

    _check() {
        this.timeline.filter(ele => {
            return ele.time <= this.elapsed;
        }).forEach(ele => {
            ele.handler();
        });
        this.timeline = this.timeline.filter(ele => {
            return ele.time > this.elapsed;
        });
    }

    getElapsed() {
        return this.elapsed;
    }

    setElapsed(elapsed) {
        this.elapsed = elapsed;
        this._check();
    }

    tick(mills) {
        this.elapsed += mills;
        this._check();
        return this;
    }

    setTimeout(handler, mills) {
        this.id++;
        let tick = {
            id: this.id,
            time: this.elapsed + mills,
            handler: handler
        };
        this.timeline.push(tick);

        this.timeline.sort((a, b) => {
            return a.time > b.time ? 1 : -1;
        });

        return this.id;
    }

    clearTimeout(id) {
        this.timeline = this.timeline.filter(ele => {
            return ele.id !== id;
        });
    }
}


// let clock = new Clock();
// clock.setTimeout(() => {
//     console.log('150');
// }, 150);
// clock.setTimeout(() => {
//     console.log('10');
// }, 10);
// clock.setTimeout(() => {
//     console.log('100');
// }, 100);
// clock.setTimeout(() => {
//     console.log('100');
// }, 100);
// clock.setTimeout(() => {
//     console.log('9');
// }, 9);
// let flag = clock.setTimeout(() => {
//     console.log('90');
// }, 90);
//
// clock.clearTimeout(flag);
//
// new Array(200).fill(0).forEach((ele, index) => {
//     clock.tick(index);
// });
