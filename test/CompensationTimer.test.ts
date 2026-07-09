import { Timer } from '../src/Timer';
import { TimeSource, TimerState } from '../src/TimerTypes';

jest.useFakeTimers();

class FakeTimeSource implements TimeSource {
    private nowValue = 0;

    now(): number {
        return this.nowValue;
    }

    advance(ms: number): void {
        this.nowValue += ms;
    }
}

describe('Timer compensation contract', () => {
    it('does not count paused wall-clock time when stopped', () => {
        const time = new FakeTimeSource();
        const timer = new Timer(1000, { timeSource: time });

        timer.start();
        time.advance(400);
        timer.pause();

        time.advance(5000);
        timer.stop();

        expect(timer.state).toBe<TimerState>('idle');
        expect(timer.elapsed).toBe(400);
    });

    it('resumes using the remaining part of the interrupted interval', () => {
        const time = new FakeTimeSource();
        const tick = jest.fn();
        const timer = new Timer(1000, { timeSource: time });
        timer.on('tick', tick);

        timer.start();
        time.advance(400);
        timer.pause();

        time.advance(300);
        timer.resume();

        time.advance(599);
        jest.advanceTimersByTime(599);
        expect(tick).toHaveBeenCalledTimes(0);

        time.advance(1);
        jest.advanceTimersByTime(1);
        expect(tick).toHaveBeenCalledTimes(1);
        expect(tick.mock.calls[0][0]).toEqual({ elapsed: 1000, delta: 1000 });
    });

    it('resets into a clean new run after stop', () => {
        const time = new FakeTimeSource();
        const timer = new Timer(1000, { timeSource: time });

        timer.start();
        time.advance(1000);
        jest.advanceTimersByTime(1000);
        timer.stop();

        expect(timer.elapsed).toBe(1000);

        timer.start();
        expect(timer.elapsed).toBe(0);
        expect(timer.state).toBe('running');
    });
});
