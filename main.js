function randomWhole(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
}

function blockIndex(index) {
    const by = Math.floor(index / 27) * 27;
    const bx = Math.floor((index % 9) / 3) * 3;
    return by + bx;
}

function allowed(squares, index) {
    if (squares[index] !== null) return null;
    let out = Array(9).fill(true);

    // check column
    for (let i = index % 9; i < 81; i += 9)
        if (squares[i] !== null) out[squares[i]] = false;

    // check row
    const rowIndex = Math.floor(index / 9) * 9;
    for (let i = rowIndex; i < rowIndex + 9; i++)
        if (squares[i] !== null) out[squares[i]] = false;

    // check block
    const bi = blockIndex(index);
    for (let ri = bi; ri < bi + 27; ri += 9)
        for (let i = ri; i < ri + 3; i++)
            if (squares[i] !== null) out[squares[i]] = false;

    return out;
}

function take(arr, i) {
    let val = arr.pop();
    if (arr.length === i) return val;
    let out = arr[i];
    arr[i] = val;
    return out;
}

// removes and returns a random element
function takeRandom(arr) {
    const val = take(arr, randomWhole(arr.length));
    return val === undefined ? null : val;
}

function arrayRange(end) {
    return [...Array(end).entries()].map(kv => kv[0]);
}

function emptySpaceIndices(arr) {
    return [...arr.entries()].filter(kv => kv[1] === null).map(kv => kv[0]);
}

// credit: https://www.codeproject.com/Articles/23206/Sudoku-Algorithm-Generates-a-Valid-Sudoku-in-0-018
// had to port from VB.NET to JavaScript, then make a couple modifications
function solveTable(squares = Array(81).fill(null), hole = null) {
    let spaces = emptySpaceIndices(squares).map(index => {
        const allowed_tiles = allowed(squares, index);
        let baseline = arrayRange(9).filter(x => allowed_tiles[x]);
        return {
            index,
            baseline,
            available: [...baseline],
        };
    });

    // sneakily insert a new hole but disallow the true value
    if (hole !== null) {
        const true_val = squares[hole];
        squares[hole] = null;
        let allowed_tiles = allowed(squares, hole);
        allowed_tiles[true_val] = false;
        let baseline = arrayRange(9).filter(x => allowed_tiles[x]);
        spaces.push({
            index: hole,
            baseline,
            available: [...baseline],
        });
    }
    console.log(spaces);

    let curIdx = 0;
    let current = spaces[curIdx];

    let iterations = 0;
    while (curIdx !== spaces.length) {
        const testNum = takeRandom(current.available);
        if (testNum !== null) {
            if (allowed(squares, current.index)[testNum]) {
                squares[current.index] = testNum;
                curIdx++;
                current = spaces[curIdx];
            }
        } else {
            current.available = [...current.baseline];
            curIdx--;
            if (curIdx < 0) return null;
            current = spaces[curIdx];
            squares[current.index] = null;
        }
        iterations++;
        // if (iterations > 8192) {
        //     if (hole === null) {
        //         alert('that took a little too many attempts. try again.');
        //         return squares;
        //     } else {
        //         return null;
        //     }
        // }
    }

    console.log(`iters: ${iterations}`);
    return squares;
}

function gridStr(squares) {
    let grid = '';
    for (let y = 0; y < 9; y++) {
        let row = '';
        for (let x = 0; x < 9; x++) {
            row += squares[y * 9 + x] + ' ';
        }
        grid += row + '\n';
    }
    return `grid:\n${grid}`;
}

function pokeHoles(grid, target) {
    if (target > 50) {
        alert("don't generate more than 50 holes. It takes too long.");
        return;
    }
    let filled = arrayRange(81);
    for (let count = 0; count < target; ) {
        const idx = takeRandom(filled);
        if (idx === null) {
            alert(`could only generate ${count} out of ${target} holes.`);
            return;
        }
        const testSolve = solveTable([...grid], idx);
        if (testSolve !== null) {
            if (count > 60) alert(count, gridStr(testSolve));
            // alert('nonnull');
            continue;
        }
        grid[idx] = null;
        count++;
    }
}

const memberLinks = [
    '2022/04/%E3%83%AA%E3%82%B9-1.png', // risu
    '2022/04/%E3%83%A0%E3%83%BC%E3%83%8A-1.png', // moona
    '2022/04/%E3%82%A4%E3%82%AA%E3%83%95%E3%82%A3-1.png', // iofi
    '2021/11/kureiji_ollie_thumb-2.png.png', // ollie, yes there are 2 .png's
    '2021/11/anya_melfissa_thumb-2.png.png', // anya, 2 .png's again
    // and now this is getting out of hand
    '2021/11/pavolia_reine_thumb-2.png.png.png', // reine
    '2022/03/1_%E3%83%99%E3%82%B9%E3%83%86%E3%82%A3%E3%82%A2%E3%83%BB%E3%82%BC%E3%83%BC%E3%82%BF.png', // zeta uses so many unicode characters in her link dude
    '2022/03/2_%E3%82%AB%E3%82%A8%E3%83%A9%E3%83%BB%E3%82%B3%E3%83%B4%E3%82%A1%E3%83%AB%E3%82%B9%E3%82%AD%E3%82%A2.png', // kaela...
    '2022/03/3_%E3%81%93%E3%81%BC%E3%83%BB%E3%81%8B%E3%81%AA%E3%81%88%E3%82%8B.png', // kobo pls why is your gen so unicode
];

function getMemberImgUrl(id) {
    return id === null
        ? 'https://static.wikia.nocookie.net/fc620067-166e-48d9-baa7-44abee59e6e1/scale-to-width/755'
        : `https://hololive.hololivepro.com/wp-content/uploads/${memberLinks[id]}`;
}

function makeHoloTile(data, click) {
    let tile = document.createElement('div');
    tile.style.backgroundImage = `url("${getMemberImgUrl(data)}")`;
    tile.classList.add('tile');
    if (data === null) {
        tile.classList.add('clickable');
        tile.onclick = click;
    }
    return tile;
}

// dear matsuri
function makeTable(tableData, click) {
    const board = document.getElementById('board');
    if (board.children[0]) board.removeChild(board.children[0]);

    let blockTable = document.createElement('table');
    for (let by = 0; by < 3; by++) {
        let blockRow = document.createElement('tr');
        for (let bx = 0; bx < 3; bx++) {
            let blockTile = document.createElement('td');
            let table = document.createElement('table');
            for (let y = 0; y < 3; y++) {
                let row = document.createElement('tr');
                for (let x = 0; x < 3; x++) {
                    const tileIdx = by * 27 + bx * 3 + y * 9 + x;
                    let tile = document.createElement('td');
                    tile.appendChild(
                        makeHoloTile(tableData[tileIdx], click(tileIdx))
                    );
                    row.appendChild(tile);
                }
                table.appendChild(row);
            }
            blockTile.appendChild(table);
            blockRow.appendChild(blockTile);
        }
        blockTable.appendChild(blockRow);
    }
    board.appendChild(blockTable);
}

function generate() {
    let table = solveTable();
    console.log(gridStr(table));
    const holeCount = document.getElementById('holeCount').value;
    pokeHoles(table, holeCount);
    console.log(gridStr(table));
    makeTable(table, idx => e => {
        alert(`clicked ${idx}`);
    });
    // console.log(gridStr(solveGrid(grid)));
}
generate();
