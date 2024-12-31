/// "We have react at home"

function Time(h, m, s, frac) {
    const ds = Math.round(frac * 10);
    const frac_str = ds === 0 ? '' : `.${ds}`;
    return `
\`${h.toString().padStart(2, '0')}\
:${m.toString().padStart(2, '0')}\
:${s.toString().padStart(2, '0')}\
${frac_str}\`
    `.trim();
}

function PlayTime(value) {
    let splits = value.split(':');
    const mins = parseInt(splits[0]);
    const secs = parseFloat(splits[1]);

    const input_secs = mins * 60 + secs;
    const SECS_PER_DAY = 24 * 60 * 60;
    let remaining = SECS_PER_DAY - input_secs;

    const out_frac = remaining % 1;
    remaining -= out_frac;
    const out_s = remaining % 60;
    remaining -= out_s;
    remaining /= 60;
    const out_m = remaining % 60;
    remaining -= out_m;
    remaining /= 60;
    const out_h = remaining % 24;
    remaining -= out_h;

    return Time(out_h, out_m, out_s, out_frac);
}

function Song(name, url) {
    return `**${name}:** ${url}`;
}

function Event(event, time) {
    return `- ${event} at \`${time}\` (play at ${PlayTime(time)})`;
}

function Header(year, index) {
    year = parseInt(year);
    return `
# New Year Timestamps ${year}-${year + 1}
Index: ${index}
Request any song to be added :SuiMochiStare: 

**USE THE SPACE BAR, CLICKING HAS A DELAY**
(fix offsets with \`Shift\`+\`<\` or \`>\` to slow or speed up the video. this is better than arrow keys.)
    `.trim();
}

/**
 * @typedef LineData
 * @property {String} keyword The keyword that this line starts with.
 * @property {[String]} args The arguments for this line.
 */

/**
 * Parses arguments like a CSV parser would.
 * @param {String} args The raw arguments in string form.
 */
function parse_args(args_raw) {
    const args = [];

    let in_quotes = false;
    for (let arg_raw of args_raw.split(' ')) {
        let arg = in_quotes ? args.pop() + ' ' : '';
        if (arg_raw.startsWith('"')) {
            arg_raw = arg_raw.slice(1);
            in_quotes = true;
        }
        if (arg_raw.endsWith('"')) {
            // TODO: better raw string support
            arg_raw = arg_raw.slice(0, arg_raw.length - 1);
            in_quotes = false;
        }
        arg += arg_raw;
        args.push(arg);
    }

    return args;
}

/**
 * Parses a line into a LineData type.
 * @param {String} line The line to parse.
 * @returns {LineData}
 */
function parse_line(line) {
    line = line.trim();
    const space = line.search(' ');
    const keyword = line.slice(0, space);
    const args_raw = line.slice(space + 1);
    const args = keyword === 'raw' ? [args_raw] : parse_args(args_raw);
    return { keyword, args };
}

function Line(line) {
    const parsed = parse_line(line);
    const keyword_to_function = {
        raw: s => s,
        header: Header,
        event: Event,
        song: Song,
    };
    const f = keyword_to_function[parsed.keyword];
    return f ? f(...parsed.args) : '';
}

function Lines(msg) {
    return msg.split('\n').map(Line).join('\n');
}

function update_output() {
    out_msg.value = Lines(in_msg.value);
    console.log('out');
}

// MAIN
update_output();
