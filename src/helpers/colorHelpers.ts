export const rgbaToHex = (r: number, g: number, b: number) => {
  const red = r.toString(16).padStart(2, "0");
  const green = g.toString(16).padStart(2, "0");
  const blue = b.toString(16).padStart(2, "0");

  const hex = `#${red}${green}${blue}`;

  return hex.toUpperCase();
};
