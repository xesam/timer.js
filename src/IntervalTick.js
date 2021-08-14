class IntervalTick {
    constructor(interval = 1000, handleEvent = x => x) {
        this.handleEvent = handleEvent;
        this.setInterval(interval);
        this._ticker = this.getInitialTicker();
    }

    getInitialTicker() {
        return null;
    }

    onTick() {
        return true;
    }

    setInterval(interval) {
        this._interval = interval;
        return this;
    }

    onEvent(event) {
        this.handleEvent.call(this, event);
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.onEvent({type: 'start'});
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.onEvent({type: 'pause'});
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.onEvent({type: 'resume'});
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.onEvent({type: 'stop'});
        }
    }
}

module.exports = IntervalTick;
