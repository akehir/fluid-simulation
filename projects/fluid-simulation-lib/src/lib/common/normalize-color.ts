export function normalizeColor(input) {
  const output = {
    r: input.r / 255,
    g: input.g / 255,
    b: input.b / 255
  };
  return output;
}
