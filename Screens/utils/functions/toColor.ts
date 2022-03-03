/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
export const toColor = (
  num: number,
  rgba: boolean = true,
) => {
  num >>>= 0;
  const b = num & 0xFF;
  const g = (num & 0xFF00) >>> 8;
  const r = (num & 0xFF0000) >>> 16;
  const a = ((num & 0xFF000000) >>> 24) / 255;
  if (rgba) {
    return `rgba(${[r, g, b, a].join(',')})`;
  }
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
};
