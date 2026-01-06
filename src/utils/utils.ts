export function getExample(level: number, prevResult?: number) {
    const maxNum = parseInt(`9${'0'.repeat(level + 1)}`)
    const length = level < 2 ? level : level - 2
    const minNum = parseInt(`1${'0'.repeat(length)}`)

    const num1 = prevResult
      ? prevResult
      : Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

    const operation = prevResult
      ? '+'
      : Math.random() < 0.5 && num1 > num2 ? '–' : '+';

    return {
      num1: num1,
      num2: num2,
      answer: operation === '+' ? num1 + num2 : num1 - num2,
      operation: operation,
    };
  }
  
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num);
};

export const formatDigit = (rowNumber: number): string => {
  const result = `x1${'0'.repeat(rowNumber-1)}`;
  return rowNumber < 5 ? result :  rowNumber < 7 ? `${result.slice(0, -3)}\u00A0тыс.` : `${result.slice(0, -6)}\u00A0млн.`;
} 