// convert Pokemon's id into a hash id number
// for example:
// 1 => #0001
// 450 => #0450
export const getPokemonHashNumber = (id: number) => {
  return '#' + id.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false });
};
