const Timer = require('./Timer');

class EmitterTimer extends Timer {
    constructor(dataSource, interval) {
        super(interval);
        this._dataSource = dataSource;
        this._count = 0;
        this.on('tick', () => {
            const index = this._count;
            const data = this._dataSource[index];
            this.emit('data', {
                data,
                index
            });
            this._count++;
        });
    }

    _onTick_() {
        return this._count < this._dataSource.length;
    }
}

module.exports = EmitterTimer;
