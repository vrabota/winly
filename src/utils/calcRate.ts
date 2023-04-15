export const calcRate = (x: number, y: number) => {
  const rate = x / y || 0;
  return `${Math.round((rate === Infinity ? 0 : rate) * 100)} %`;
};
