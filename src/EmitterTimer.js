const Timer = require('./Timer');

class EmitterTimer extends Timer {
    constructor(dataSource, interval) {
        super(interval);
        this._dataSource = dataSource;
        this._index = 0;
        this.on('tick', () => {
            const index = this._index;
            const data = this._dataSource[index];
            this.emit('data', {
                data,
                index
            });
            this._index++;
        });
    }

    _keepContinue_() {
        return this._index < this._dataSource.length;
    }
}

module.exports = EmitterTimer;
