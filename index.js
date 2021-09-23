'use strict';

const LOWER = [...'abcdefghijklmnopqrstuvwxyz'];
const UPPER = LOWER.map((c) => c.toUpperCase());
const ALPHA = [...LOWER, ...UPPER];
const DIGIT = [...'0123456789'];
const SYMBOL = ['$', '_'];

function range(min, max) {
  let list = [];
  for (let i = min; i <= max; i++) {
    list.push(i);
  }
  return list;
}

function chr(c) {
  return String.fromCharCode(c);
}

const ASCII = [0x09, 0x0A, 0x0D, ...range(0x20, 0x7E)].map(chr);

const UNICODE = [
  ...ASCII,
  ...[...range(0x0080, 0xD7FF), ...range(0xE000, 0xFFFF)].map(chr)
];

function pick(list) {
  let index = Math.floor(Math.random() * list.length);
  return list[index];
}

function wrap(source) {
  if (source && typeof source.gen === 'function') {
    return source;
  } else {
    return { gen: () => source };
  }
}

function any(sources) {
  sources = sources.map((src) => wrap(src));

  return {
    gen() {
      return pick(sources).gen();
    }
  };
}

function weighted(sources) {
  sources = sources.flatMap(([src, n]) => range(1, n).map(() => src));
  return any(sources);
}

function bool() {
  return {
    gen() {
      return pick([true, false]);
    }
  };
}

function intOpts(opts) {
  opts = opts || {};

  if (typeof opts === 'number') {
    return { min: opts, max: opts };
  } else {
    return { min: 0, max: Number.MAX_SAFE_INTEGER, ...opts };
  }
}

function int(opts) {
  let { min, max } = intOpts(opts);

  return {
    gen() {
      return min + Math.floor(Math.random() * (1 + max - min));
    }
  }
}

function string(opts, chars) {
  let length = int(opts);

  return {
    gen() {
      let n = length.gen();
      let str = '';
      while (n--) {
        str += pick(chars);
      }
      return str;
    }
  };
}

function ascii(opts) {
  return string(opts, ASCII);
}

function unicode(opts) {
  return string(opts, UNICODE);
}

function symbol(opts) {
  let { min, max } = intOpts(opts);
  let first = [...ALPHA, ...SYMBOL];
  let rest = string({ min: min - 1, max: max - 1 }, [...first, ...DIGIT]);

  return {
    gen() {
      return pick(first) + rest.gen();
    }
  };
}

function array(length, values) {
  length = int(length);
  values = wrap(values);

  return {
    gen() {
      return range(1, length.gen()).map(() => values.gen());
    }
  };
}

function object(opts) {
  let width = int(opts.width);
  let keys = wrap(opts.keys);
  let values = wrap(opts.values);

  return {
    gen() {
      let entries = range(1, width.gen()).map(() => [keys.gen(), values.gen()]);
      return Object.fromEntries(entries);
    }
  };
}

module.exports = {
  any,
  weighted,
  bool,
  int,
  ascii,
  unicode,
  symbol,
  array,
  object
};
