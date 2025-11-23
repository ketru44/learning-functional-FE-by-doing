export function createReadLineEffect(questionStr) {
  return {
    type: "readline",
    questionStr,
  }
};
export function createPrintEffect(printStr) {
  return {
    type: "print",
    printStr,
  }
};
export function createRandomNumberInRangeEffect(min, max) {
  return {
    type: "random_single",
    min,
    max,
  }
};