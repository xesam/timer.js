import { CounterTimer } from '../src/CounterTimer';

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

describe('CounterTimer', () => {
    it('completes immediately when maxCount is zero', () => {
        const tick = jest.fn();
        const done = jest.fn();
        const timer = new CounterTimer(1000, 0);
        timer.on('tick', tick);
        timer.on('done', done);

        timer.start();

        expect(tick).not.toHaveBeenCalled();
        expect(done).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledWith({
            elapsed: 0,
            delta: 0,
            count: 0
        });
        expect(timer.count).toBe(0);
        expect(timer.state).toBe('idle');
    });

    it('starts a fresh count after stop and restart', () => {
        const timer = new CounterTimer(1000, 3);

        timer.start();
        jest.advanceTimersByTime(2000);
        timer.stop();

        expect(timer.count).toBe(2);

        timer.start();
        expect(timer.count).toBe(0);
    });

    it('emits count together with core tick timing fields', () => {
        const tick = jest.fn();
        const timer = new CounterTimer(1000, 3);
        timer.on('tick', tick);

        timer.start();
        jest.advanceTimersByTime(1000);

        expect(tick).toHaveBeenCalledWith({
            elapsed: 1000,
            delta: 1000,
            count: 1
        });
    });

    it('projects count from compensated elapsed time when callbacks are delayed', () => {
        const time = new FakeTimeSource();
        const tick = jest.fn();
        const timer = new CounterTimer(1000, 5, { timeSource: time });
        timer.on('tick', tick);

        timer.start();
        time.advance(2500);
        jest.advanceTimersByTime(1000);

        expect(tick).toHaveBeenCalledTimes(1);
        expect(tick).toHaveBeenCalledWith({
            elapsed: 2500,
            delta: 2500,
            count: 2
        });
        expect(timer.count).toBe(2);
    });
});
