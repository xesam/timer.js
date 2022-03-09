const {Timer} = require('../index');
jest.useFakeTimers('modern');

function init() {
    const startCallback = jest.fn();
    const pauseCallback = jest.fn();
    const resumeCallback = jest.fn();
    const stopCallback = jest.fn();
    const tickCallback = jest.fn();
    const defaultCallback = jest.fn();
    const timer = new Timer(1000, event => {
        defaultCallback();
        if (event.type === 'start') {
            startCallback();
        } else if (event.type === 'stop') {
            stopCallback();
        } else if (event.type === 'pause') {
            pauseCallback();
        } else if (event.type === 'resume') {
            resumeCallback();
        } else if (event.type === 'tick') {
            tickCallback();
        }
    });
    timer.setInterval(1000);
    return {
        timer,
        startCallback,
        pauseCallback,
        resumeCallback,
        stopCallback,
        tickCallback,
        defaultCallback
    };
}

describe('test Timer callback', () => {

    it('init -> start', () => {
        const {timer, startCallback, defaultCallback} = init();
        timer.start();
        expect(startCallback).toBeCalledTimes(1);
        expect(defaultCallback).toBeCalledTimes(1);
    });

    it('init -> stop', () => {
        const {timer, stopCallback} = init();
        timer.stop();
        expect(stopCallback).not.toBeCalled();
    });

    it('init -> pause', () => {
        const {timer, pauseCallback} = init();
        timer.pause();
        expect(pauseCallback).not.toBeCalled();
    });

    it('init -> resume', () => {
        const {timer, resumeCallback} = init();
        timer.resume();
        expect(resumeCallback).not.toBeCalled();
    });

    it('init -> start -> start', () => {
        const {timer, startCallback} = init();
        timer.start();
        timer.start();
        expect(startCallback).toBeCalledTimes(1);
    });

    it('init -> start -> stop', () => {
        const {timer, stopCallback} = init();

        timer.start();
        expect(stopCallback).not.toBeCalled();

        timer.stop();
        expect(stopCallback).toBeCalledTimes(1);
    });

    it('init -> start -> pause', () => {
        const {timer, pauseCallback} = init();

        timer.start();
        expect(pauseCallback).not.toBeCalled();

        timer.pause();
        expect(pauseCallback).toBeCalledTimes(1);
    });

    it('init -> start -> resume', () => {
        const {timer, resumeCallback} = init();

        timer.start();
        expect(resumeCallback).not.toBeCalled();

        timer.resume();
        expect(resumeCallback).not.toBeCalled();
    });

    it('init -> start -> stop -> stop', () => {
        const {timer, stopCallback} = init();

        timer.start();
        expect(stopCallback).not.toBeCalled();

        timer.stop();
        timer.stop();
        expect(stopCallback).toBeCalledTimes(1);
    });

    it('init -> start -> stop -> start', () => {
        const {timer, startCallback} = init();

        timer.start();
        timer.stop();
        timer.start();
        expect(startCallback).toBeCalledTimes(2);
    });

    it('init -> start -> pause -> resume', () => {
        const {timer, pauseCallback, resumeCallback} = init();

        timer.start();
        expect(pauseCallback).not.toBeCalled();
        expect(resumeCallback).not.toBeCalled();

        timer.pause();
        expect(pauseCallback).toBeCalledTimes(1);

        timer.resume();
        expect(resumeCallback).toBeCalledTimes(1);
    });
})

describe('test Timer', () => {

    it('start', () => {
        const {timer, tickCallback, defaultCallback} = init();
        timer.start();

        jest.advanceTimersByTime(500);
        expect(tickCallback).toBeCalledTimes(0);
        expect(defaultCallback).toBeCalledTimes(1);

        jest.advanceTimersByTime(500);
        expect(tickCallback).toBeCalledTimes(1);
        expect(defaultCallback).toBeCalledTimes(2);

        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(6);
        expect(defaultCallback).toBeCalledTimes(7);
    });

    it('start stop', () => {
        const {timer, tickCallback} = init();
        timer.start();
        timer.stop();

        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(0);
    });

    it('start pause', () => {
        const {timer, tickCallback} = init();
        timer.start();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(0);
    });

    it('start pause resume', () => {
        const {timer, tickCallback} = init();
        timer.start();
        timer.pause();
        timer.resume();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(5);
    });

    it('start pause resume pause', () => {
        const {timer, tickCallback} = init();
        timer.start();
        timer.pause();
        timer.resume();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(0);
    });

    it('start pause resume stop', () => {
        const {timer, tickCallback} = init();
        timer.start();
        timer.pause();
        timer.resume();
        timer.stop();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toBeCalledTimes(0);
    });
})
