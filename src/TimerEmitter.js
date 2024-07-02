const CounterTimer = require('./CounterTimer');

class TimerEmitter extends CounterTimer {
    constructor(dataSource, interval) {
        super(
            interval,
            ({ type }) => {
                if (type === 'tick') {
                    const count = this.getCount();
                    const data = this._dataSource[count];
                    this.onEmit(data, count);
                }
            },
            dataSource.length
        );
        this._dataSource = dataSource;
    }

    onEmit(data, index) {
        console.log(data, index);
    }
}

module.exports = TimerEmitter;
