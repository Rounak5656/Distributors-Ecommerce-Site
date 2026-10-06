const util = require('util');

function safeMeta(meta) {
    try {
        return meta;
    } catch {
        return {};
    }
}

function format(level, msg, meta) {
    const out = {
        ts: new Date().toISOString(),
        level,
        msg: typeof msg === 'string' ? msg : util.inspect(msg),
        meta: safeMeta(meta)
    };
    return JSON.stringify(out);
}

module.exports = {
    info: (msg, meta = {}) => {
        console.log(format('info', msg, meta));
    },
    warn: (msg, meta = {}) => {
        console.warn(format('warn', msg, meta));
    },
    error: (msg, err = {}) => {
        const meta = typeof err === 'object' && err !== null
            ? { message: err.message || String(err) }
            : { error: String(err) };
        console.error(format('error', msg, meta));
    },
    debug: (msg, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(format('debug', msg, meta));
        }
    }
};
