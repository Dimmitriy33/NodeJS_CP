export const getAvgNumValue = (arr: number[]) => {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
};
