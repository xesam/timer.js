const {Tick} = require('./Tick');

class Timer {
    constructor(interval, options = {}) {
        this._interval = interval;
        this._ticker = new Tick();
        this._options = options;
        this._flyTotal = 0;
    }

    start() {
        this._ticker.onTick(time => {
            this._flyTotal += time.fly;
            this._ticker.start(this._interval - (time.fly - time.timeout));
            this._options.onTick && this._options.onTick(this, this._flyTotal);
        });
        this._options.onStart && this._options.onStart(this, this._flyTotal);
        this._ticker.start(this._interval);
    }

    pause() {
        this._ticker.pause();
        this._options.onPause && this._options.onPause(this, this._flyTotal);
    }

    resume() {
        this._options.onResume && this._options.onResume(this, this._flyTotal);
        this._ticker.resume();
    }

    stop() {
        this._ticker.stop();
        this._options.onStop && this._options.onStop(this, this._flyTotal);
    }
}

module.exports = Timer;
