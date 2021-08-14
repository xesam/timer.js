class IntervalTick {
    constructor(interval = 1000, handleEvent = x => x) {
        this.handleEvent = handleEvent;
        this.setInterval(interval);
        this.ticker = this.getInitialTicker();
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
        if (this.ticker.start(this._interval)) {
            this.onEvent({type: 'start'});
        }
    }

    pause() {
        if (this.ticker.pause()) {
            this.onEvent({type: 'pause'});
        }
    }

    resume() {
        if (this.ticker.resume()) {
            this.onEvent({type: 'resume'});
        }
    }

    stop() {
        if (this.ticker.stop()) {
            this.onEvent({type: 'stop'});
        }
    }
}

module.exports = IntervalTick;
