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
 *  key: string,
 * }} Input
 *
 * @typedef {(
 * | 'Hold'
 * | 'RotCc'
 * | 'Rot180'
 * | 'RotCw'
 * | 'MoveL'
 * | 'MoveR'
 * | 'DropH'
 * | 'DropS'
 * | 'Retry'
 * )} Action
 *
 * @typedef {(
 * | 'MoveL'
 * | 'MoveR'
 * | 'DropS'
 * | 'Retry'
 * )} HoldableAction
 *
 * @typedef {(
 * | { kind: 'Down', action: Action }
 * | { kind: 'Repeat', action: HoldableAction }
 * )} BoardEvent
 *
 * @typedef {Record<string, Action>} Keybinds
 * @typedef {{
 *  das: number, // delayed auto shift
 *  arr: number, // auto repeat rate
 *  sdf: number, // soft drop factor
 *  retry_delay: number,
 * }} Handling
 */

class Replay {
    /** @type {Keybinds} */
    binds;
    /** @type {Input[]} */
    inputs;

    /**
     * @param {Keybinds} binds
     */
    constructor(binds) {
        this.binds = binds;
        this.inputs = [];
    }

    /**
     * @param {Input} input
     */
    input(input) {
        this.inputs.push(input);
    }
}

class InputRecorder {
    /** @type {number} */
    start;
    /** @type {Set<string>} */
    held;
    /** @type {(() => void) | null} */
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
     * @param {string} key
     */
    trigger(trigger, key) {
        const input = {
            time: Date.now() - this.start,
            trigger: trigger,
            key: key,
        };
        this.replay.input(input);
        if (this.ontrigger) {
            this.ontrigger();
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    keydown(e) {
        if (e.key in this.replay.binds && !this.held.has(e.key)) {
            this.held.add(e.key);
            this.trigger('Down', e.key);
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    keyup(e) {
        if (e.key in this.replay.binds && this.held.delete(e.key)) {
            this.trigger('Up', e.key);
        }
    }
}
