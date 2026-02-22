// @ts-check

/**
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
 * @typedef {number} Tile
 * @typedef {'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'} Piece
 *
 * @typedef {{
 *  x: number,
 *  y: number,
 * }} Point
 *
 * @typedef {Point} Offset
 * @typedef {Record<Piece, Offset[]>} Kicks
 *
 * @typedef {{
 *  cw?: Kicks,
 *  cc?: Kicks,
 *  180?: Kicks,
 * }} KickTable
 *
 * @typedef {{
 *  kicks: KickTable,
 *  binds: Keybinds,
 *  handling: Handling,
 * }} Options
 *
 * @typedef {{
 *  seed: number, // strictly necessary
 * }} Setup
 *
 * @typedef {{
 *  next: () => number,
 *  nextFloat: () => number,
 *  shuffleArray: <T>(array: T[]) => T[],
 * }} Rng
 */

const PIECES = 'ZLOSIJT';

/**
 * https://github.com/lemoncove/tetrio-bot-docs/blob/master/Piece_RNG.md
 * @param {number} seed
 * @returns {Rng}
 */
function new_rng(seed) {
    let t = seed % 2147483647;

    if (t <= 0) {
        t += 2147483646;
    }

    return {
        next: function () {
            return (t = (16807 * t) % 2147483647);
        },
        nextFloat: function () {
            return (this.next() - 1) / 2147483646;
        },
        shuffleArray: function (array) {
            if (array.length == 0) {
                return array;
            }

            for (let i = array.length - 1; i != 0; i--) {
                const r = Math.floor(this.nextFloat() * (i + 1));
                [array[i], array[r]] = [array[r], array[i]];
            }

            return array;
        },
    };
}

/**
 * Tests whether the RNG matches Tetr.io
 */
function test_7bag() {
    // seed and first 2 bags taken from one of my replays
    const rng = new_rng(1737846550);
    const expected = ['TOSIJLZ', 'ISJOLZT'];

    let fail = false;
    for (let i = 0; i < expected.length; i++) {
        const shuffled = rng.shuffleArray([...PIECES]);
        if (expected[i] !== shuffled.join('')) {
            fail = true;
        }
    }
    if (fail) {
        console.log('7bag - FAILED');
    } else {
        console.log('7bag - PASSED');
    }
}
test_7bag();

class Game {
    // TODO: params
    /**
     * @param {Setup} setup
     */
    constructor({}) {}
}

class Grid {
    /** @type {number} */
    w;
    /** @type {number} */
    h;
    /** @type {Tile[][]} */
    grid;

    /**
     * @param {number} w
     * @param {number} h
     */
    constructor(w, h) {
        this.w = w;
        this.h = h;
        const row = Array(w).fill(0);
        this.grid = Array.from({ length: h }, (_) => [...row]);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    get_tile(x, y) {
        return this.grid[y][x];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {} v
     */
    set_tile(x, y, v) {
        this.grid[y][x] = v;
    }

    str() {
        return this.grid
            .map((row) => row.map((tile) => `${tile} `).join(''))
            .join('\n');
    }
}
