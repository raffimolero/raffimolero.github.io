// @ts-check

const log = console.log;
/**
 * @param {any} x
 * @returns {any}
 */
function dbg(x) {
    log(x);
    return x;
}

function gen_kick_table_srs_plus() {
    return {}; // TODO
}

const srs_plus = gen_kick_table_srs_plus();

/** @type {Keybinds} */
const binds_rsb = {
    KeyA: 'Hold',
    KeyS: 'RotCc',
    KeyD: 'Rot180',
    KeyF: 'RotCw',
    Space: 'MoveL',
    Numpad4: 'MoveL',
    ArrowRight: 'MoveR',
    Numpad5: 'MoveR',
    Numpad6: 'DropH',
    NumpadAdd: 'DropS',
    Numpad0: 'Retry',
};

/** @type {Handling} */
const handling_rsb = {
    das: 200,
    arr: 0,
    sdf: -1,
    retry_delay: 500,
};

let options = {
    kicks: srs_plus,
    binds: binds_rsb,
    handling: handling_rsb,
};

const sleep = async (/** @type {number} */ ms) =>
    await new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    let grid = new Grid(10, 20);
    grid.set_tile(2, 7, 5);
    log(grid.str());

    const replay = new Replay({
        seed: 1737846550,
    });
    const recorder = new InputRecorder(replay);
    recorder.ontrigger = () => {
        const last =
            recorder.replay.actions[recorder.replay.actions.length - 1];

        console.log(last);
        if (last.keycode === 'Numpad0') {
            console.log(recorder.replay.actions);
        }
    };
}

main();
