export function getNumberOrNull(x?: number | string | null): number | null {
  if (typeof x == 'number') {
    return x;
  }

  if (!x) {
    return null;
  }

  return Number(x) ? +x : null;
}
