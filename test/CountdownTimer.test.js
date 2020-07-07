const {CountdownTimer} = require('../index');
jest.useFakeTimers('modern');

describe('test CountdownTimer', () => {
    let timer;
    beforeEach(() => {

    });

    it('normal start', () => {
        const startCallback = jest.fn();
        timer = new CountdownTimer(10000, 1000, {
            onStart: startCallback
        });
        expect(startCallback).not.toBeCalled();
        timer.start();
        jest.advanceTimersByTime(1000);
        expect(startCallback).toBeCalled();
    });

    it('start tick finish', () => {
        const tickCallback = jest.fn();
        const finishCallback = jest.fn();
        timer = new CountdownTimer(10000, 1000, {
            onTick: tickCallback,
            onFinish: finishCallback
        });
        expect(tickCallback).not.toBeCalled();
        expect(finishCallback).not.toBeCalled();
        timer.start();
        jest.advanceTimersByTime(10000);
        expect(tickCallback.mock.calls.length).toBe(10);
        expect(finishCallback.mock.calls.length).toBe(1);
    });
});


