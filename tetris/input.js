// @ts-check
// NOTE: i should really just use proper typescript at this point

/**
 * @typedef {(
 * | 'Down'
 * | 'Up'
 * )} InputTrigger
 *
 * @typedef {{
 *  time: number, // ms since start,
 *  trigger: InputTrigger,
 *  keycode: string,
 * }} Input
 */

class Replay {
    /** @type {Setup} */
    setup;
    /** @type {Input[]} */
    actions;

    /**
     * @param {Setup} setup
     */
    constructor(setup) {
        this.setup = setup;
        this.actions = [];
    }

    /**
     * @param {Input} input
     */
    push(input) {
        this.actions.push(input);
    }
}

class InputRecorder {
    /** @type {number} */
    start;
    /** @type {Replay} */
    replay;
    /** @type {Set<string>} */
    held;
    /** @type {((input: Input) => void) | null} */
    ontrigger;

    /**
     * @param {Replay} replay
     */
    constructor(replay) {
        this.start = Date.now();
        this.replay = replay;
        this.held = new Set();
        this.ontrigger = null;
        document.addEventListener('keydown', (e) => this.keydown(e));
        document.addEventListener('keyup', (e) => this.keyup(e));
    }

    /**
     * @param {InputTrigger} trigger
     * @param {string} keycode
     */
    trigger(trigger, keycode) {
        const input = {
            time: Date.now() - this.start,
            trigger: trigger,
            keycode: keycode,
        };
        this.replay.push(input);
        if (this.ontrigger) {
            this.ontrigger(input);
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    keydown(e) {
        if (!this.held.has(e.code)) {
            this.held.add(e.code);
            this.trigger('Down', e.code);
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    keyup(e) {
        if (this.held.delete(e.code)) {
            this.trigger('Up', e.code);
        }
    }
}
