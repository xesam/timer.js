const {CountdownTimer} = require('../index');
jest.useFakeTimers('modern');

describe('test CountdownTimer', () => {
    it('normal start', () => {
        const startCallback = jest.fn();
        const timer = new CountdownTimer(10000, 1000, {
            onStart: startCallback
        });
        expect(startCallback).not.toBeCalled();
        timer.start();
        expect(startCallback).toBeCalled();
    });

    it('start tick finish', () => {
        const tickCallback = jest.fn();
        const finishCallback = jest.fn();
        const timer = new CountdownTimer(10000, 1000, {
            onTick: tickCallback,
            onFinish: finishCallback
        });
        timer.start();
        expect(tickCallback).not.toBeCalled();
        expect(finishCallback).not.toBeCalled();
        jest.advanceTimersByTime(10000);
        expect(tickCallback).toBeCalledTimes(10);
        expect(finishCallback).toBeCalledTimes(1);
    });
});


