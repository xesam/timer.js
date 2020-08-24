const {Tick} = require('./Tick');

class Timer {
    constructor(eventHandler = () => {
    }) {
        this.eventHandler = eventHandler;
        this.setInterval(0);
        this._ticker = new Tick(flyMills => {
            this.onTick(flyMills);
        });
    }

    setInterval(interval) {
        this._interval = interval;
    }

    onEvent(event) {
        this.eventHandler(event);
    }

    onTick() {
        this.onEvent('tick');
        this._ticker.start(this._interval);
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.onEvent('start');
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.onEvent('pause');
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.onEvent('resume');
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.onEvent('stop');
        }
    }
}

module.exports = Timer;
