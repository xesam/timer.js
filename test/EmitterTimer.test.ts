import { EmitterTimer } from '../src/EmitterTimer';

jest.useFakeTimers();

class FakeTimeSource {
    private nowValue = 0;

    now(): number {
        return this.nowValue;
    }

    advance(ms: number): void {
        this.nowValue += ms;
    }
}

describe('EmitterTimer', () => {
    it('completes an empty source without emitting phantom data', () => {
        const data = jest.fn();
        const done = jest.fn();
        const timer = new EmitterTimer<string>([], 1000);
        timer.on('data', data);
        timer.on('done', done);

        timer.start();

        expect(data).not.toHaveBeenCalled();
        expect(done).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledWith({
            elapsed: 0,
            delta: 0,
            data: undefined,
            index: 0
        });
        expect(timer.index).toBe(0);
        expect(timer.state).toBe('idle');
    });

    it('restarts with index zero after reset', () => {
        const data = ['a', 'b', 'c'];
        const emitted = jest.fn();
        const timer = new EmitterTimer(data, 1000);
        timer.on('data', emitted);

        timer.start();
        jest.advanceTimersByTime(2000);
        timer.reset();
        timer.start();
        jest.advanceTimersByTime(1000);

        expect(emitted.mock.calls[2][0]).toEqual({
            data: 'a',
            index: 0,
            elapsed: 1000,
            delta: 1000
        });
    });

    it('emits data with consistent timing payloads', () => {
        const dataCallback = jest.fn();
        const data = [1, 2, 3];
        const timer = new EmitterTimer<number>(data, 1000);
        timer.on('data', dataCallback);

        timer.start();
        jest.advanceTimersByTime(1000);

        expect(dataCallback).toHaveBeenCalledTimes(1);
        expect(dataCallback.mock.calls[0][0]).toEqual({
            data: 1,
            index: 0,
            elapsed: 1000,
            delta: 1000
        });
    });

    it('projects the emitted item from compensated elapsed time when callbacks are delayed', () => {
        const time = new FakeTimeSource();
        const emitted = jest.fn();
        const timer = new EmitterTimer(['a', 'b', 'c', 'd'], 1000, { timeSource: time });
        timer.on('data', emitted);

        timer.start();
        time.advance(2500);
        jest.advanceTimersByTime(1000);

        expect(emitted).toHaveBeenCalledTimes(1);
        expect(emitted).toHaveBeenCalledWith({
            data: 'b',
            index: 1,
            elapsed: 2500,
            delta: 2500
        });
    });
});
