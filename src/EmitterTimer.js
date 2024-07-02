const Timer = require('./Timer');

class EmitterTimer extends Timer {
    constructor(dataSource, interval) {
        super(
            ({ type }) => {
                if (type === 'tick') {
                    const data = this._dataSource[this._count];
                    this.onEmit(data, this._count);
                    this._count++;
                }
            },
            interval
        );
        this._dataSource = dataSource;
        this._count = 0;
    }

    _onTick_() {
        return this._count < this._dataSource.length;
    }

    onEmit(data, index) {
        console.log(data, index);
    }
}

module.exports = EmitterTimer;
