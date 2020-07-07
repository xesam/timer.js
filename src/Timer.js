const {Tick} = require('./Tick');

class Timer {
    constructor() {
        this.setInterval(0);
        this._ticker = new Tick(flyMills => {
            this._onTick(flyMills);
        });
    }

    _onTick() {
        this.onTick && this.onTick();
        this._ticker.start(this._interval);
    }

    setInterval(interval) {
        this._interval = interval;
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.onStart && this.onStart();
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.onPause && this.onPause();
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.onResume && this.onResume();
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.onStop && this.onStop();
        }
    }
}

module.exports = Timer;
