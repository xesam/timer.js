import { Timer } from './Timer';

export class CounterTimer extends Timer {
    private _count: number = 0;
    private _maxCount: number;

    constructor(interval: number, maxCount: number = Number.MAX_VALUE) {
        super(interval);
        this._maxCount = maxCount;
        this.on('tick', () => {
            this._count++;
        });
    }

    protected _keepContinue_(): boolean {
        return this._count < this._maxCount;
    }

    getCount(): number {
        return this._count;
    }
}