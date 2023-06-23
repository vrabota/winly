export const calcRate = (x: number, y: number, withPercentage = true) => {
  const rate = x / y || 0;
  const rateValue = Math.round((rate === Infinity ? 0 : rate) * 100);
  return withPercentage ? `${rateValue} %` : rateValue;
};
