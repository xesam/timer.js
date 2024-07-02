const Timer = require('./Timer');

class TimerEmitter extends Timer {
    constructor(dataSource, interval) {
        super(
            ({ type }) => {
                if (type === 'tick') {
                    const data = this._dataSource[this._count];
                    this.onEmit(data, this._count);
                    this._count++;
                }
            },
            interval,
            dataSource.length
        );
        this._dataSource = dataSource;
        this._count = 0;
    }

    onEmit(data, index) {
        console.log(data, index);
    }
}

module.exports = TimerEmitter;
