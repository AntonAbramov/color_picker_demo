export const insert = <T>(arr: T[], index: number, newItem: T) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];
