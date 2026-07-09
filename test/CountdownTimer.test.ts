import { CountdownTimer } from '../src/CountdownTimer';

jest.useFakeTimers();

describe('CountdownTimer', () => {
    it('projects core tick timing with remaining time', () => {
        const tick = jest.fn();
        const timer = new CountdownTimer(1000, 2500);
        timer.on('tick', tick);

        timer.start();
        jest.advanceTimersByTime(2000);

        expect(tick.mock.calls[1][0]).toEqual({
            elapsed: 2000,
            delta: 1000,
            remaining: 500
        });
    });

    it('completes on the remaining partial interval instead of one full tick late', () => {
        const tick = jest.fn();
        const done = jest.fn();
        const timer = new CountdownTimer(1000, 2500);
        timer.on('tick', tick);
        timer.on('done', done);

        timer.start();

        jest.advanceTimersByTime(2499);
        expect(tick).toHaveBeenCalledTimes(2);
        expect(done).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(done).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledWith({
            elapsed: 2500,
            delta: 500,
            remaining: 0
        });

        jest.advanceTimersByTime(500);
        expect(tick).toHaveBeenCalledTimes(2);
        expect(done).toHaveBeenCalledTimes(1);
    });

    it('reset clears remaining time back to duration', () => {
        const timer = new CountdownTimer(1000, 2500);

        timer.start();
        jest.advanceTimersByTime(1000);
        timer.reset();

        expect(timer.remaining).toBe(2500);
        expect(timer.state).toBe('idle');
    });
});
