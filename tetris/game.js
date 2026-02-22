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

class InputRecorder {
    /** @type {number} */
    start;
    /** @type {Keybinds} */
    binds;
    /** @type {Input[]} */
    inputs;
    /** @type {Set<string>} */
    held;

    /**
     * @param {Keybinds} binds
     */
    constructor(binds) {
        this.start = Date.now();
        this.binds = binds;
        this.inputs = [];
        this.held = new Set();
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
        this.inputs.push(input);
        console.log(this.inputs[this.inputs.length - 1]);
    }

    /**
     * @param {KeyboardEvent} e
     */
    keydown(e) {
        if (e.key in this.binds && !this.held.has(e.key)) {
            this.held.add(e.key);
            this.trigger('Down', e.key);
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    keyup(e) {
        if (e.key in this.binds && this.held.delete(e.key)) {
            this.trigger('Up', e.key);
        }
    }
}
