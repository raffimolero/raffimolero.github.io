const log = console.log;
function dbg(x) {
    log(x);
    return x;
}

function kick_table_srs_plus() {
    return {}; // TODO
}

const kick_tables = {
    None: {},
    'SRS+': kick_table_srs_plus(),
};

/** @type {Keybinds} */
const binds_rsb = {
    a: 'Hold',
    s: 'RotCc',
    d: 'Rot180',
    f: 'RotCw',
    4: 'MoveL',
    5: 'MoveL',
    6: 'MoveR',
    '+': 'MoveR',
    ' ': 'DropH',
    ArrowRight: 'DropS',
    0: 'Retry',
};

const handling_rsb = {
    das: 200,
    arr: 0,
    sdf: -1,
};

let options = {
    kick: 'SRS+',
    binds: binds_rsb,
    handling: handling_rsb,
};

class Grid {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        const row = Array(w).fill(0);
        this.grid = Array.from({ length: h }, (_) => [...row]);
    }

    get_tile(x, y) {
        return this.grid[y][x];
    }

    set_tile(x, y, v) {
        this.grid[y][x] = v;
    }

    str() {
        return this.grid
            .map((row) => row.map((tile) => `${tile} `).join(''))
            .join('\n');
    }
}

const sleep = async (/** @type {number} */ ms) =>
    await new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    let grid = new Grid(10, 20);
    grid.set_tile(2, 7, 5);
    log(grid.str());

    const replay = new Replay(binds_rsb);
    const recorder = new InputRecorder(replay);
    recorder.ontrigger = () => {
        console.log(recorder.replay.inputs[recorder.replay.inputs.length - 1]);
    };
}

main();
