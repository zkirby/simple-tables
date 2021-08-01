export function compact(x) {
  if (!Array.isArray(x)) {
    return [];
  }
  return x.filter(value => Boolean(value));
}

export function some(x, pred) {
  if (!Array.isArray(x)) {
    return [];
  }
  return x.some(pred);
}

