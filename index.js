'use strict';

function range(min, max) {
  let list = [];
  for (let i = min; i <= max; i++) {
    list.push(i);
  }
  return list;
}

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

module.exports = {
  any,
  weighted,
  bool,
  int
};
