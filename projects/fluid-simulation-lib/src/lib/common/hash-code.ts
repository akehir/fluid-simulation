export function hashCode(s) {
  if (s.length === 0) { return 0; }
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i); // tslint:disable-line:no-bitwise
    hash |= 0; // tslint:disable-line:no-bitwise (convert to 32 bit int)
  }
  return hash;
}
