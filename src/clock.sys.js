export class Clock {
    constructor() {
    }

    getElapsed() {
        return Date.now();
    }

    setTimeout(handler, mills) {
        return setTimeout(handler, mills);
    }

    clearTimeout(id) {
        clearTimeout(id);
    }
}
