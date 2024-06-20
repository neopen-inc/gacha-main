
export function formatNumberToLocaleString(nullableNumber: number | string | null | undefined) {
  if (nullableNumber === null || nullableNumber === undefined) {
    return '';
  }
  return Number(nullableNumber).toLocaleString();
}
