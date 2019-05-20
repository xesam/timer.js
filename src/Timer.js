const BaseTimer = require('./BaseTimer');

class Timer extends BaseTimer {
    constructor(interval, options = {}) {
        super(options);
        this.setInterval(interval);
    }
}

module.exports = Timer;
