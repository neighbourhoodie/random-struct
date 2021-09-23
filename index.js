'use strict';

function pick(list) {
  let index = Math.floor(Math.random() * list.length);
  return list[index];
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

module.exports = {
  bool,
  int
};
