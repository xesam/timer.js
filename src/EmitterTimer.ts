import { Timer } from './Timer';

interface DataPayload<T> {
    data: T;
    index: number;
}

export class EmitterTimer<T = any> extends Timer {
    private _dataSource: T[];
    private _index: number = 0;

    constructor(dataSource: T[], interval: number) {
        super(interval);
        this._dataSource = dataSource;
        this.on('tick', () => {
            const index = this._index;
            const data = this._dataSource[index];
            this.emit('data', { data, index } as DataPayload<T>);
            this._index++;
        });
    }

    protected _keepContinue_(): boolean {
        return this._index < this._dataSource.length;
    }
}