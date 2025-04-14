/**
 * @typedef {{
 *     start: number,
 *     end: number,
 *     replacement: string,
 * }} Change
 * 
 * @typedef {Change[]} Changes
 * 
 * @typedef {{
 *     change: Change,
 *     history: History,
 * }} Branch
 */

class History {
    /** @type {Branch[]} */
    branches = [];
}

class Buffer {
    /** @type {string} */
    data = '';

    /**
     * @param {string} data 
     */
    constructor(data) {
        this.data = data
    }

    /**
     * @param {Changes} changes
     * @returns {Changes} the changes that would undo the current change
     */
    apply_changes(changes) {
        let buf = '';
        let pre_cursor = 0;
        let post_cursor = 0;
        const undo = [];
        for (const { start, end, replacement } of changes) {
            const pre_len = end - start;
            const post_len = replacement.length;
            // equivalent to pre_cursor += (start - pre_cursor) + (end - start);
            pre_cursor = end;
            post_cursor += (start - pre_cursor) + replacement.length;

            buf += this.data.slice(pre_cursor, start) + replacement;
            undo.push({
                start: post_cursor,
                end: post_cursor + replacement.length,
                replacement: this.data.slice(start, end),
            });
        }
        this.data = buf + this.data.slice(pre_cursor);
        return undo;
    }
}

const buf = new Buffer('hello my name is raffi');
console.log(buf);
const undo = buf.apply_changes([
    { start: 0, end: 5, replacement: 'hi' },
    { start: 17, end: 22, replacement: 'molero' },
]);
console.log(buf);
console.log(undo);
const redo = buf.apply_changes(undo);
console.log(buf);
buf.apply_changes(redo);
console.log(buf);



