export const findMaxValue = (values) => Math.max(...values); // 명확성과 재사용성이 높아보여 분리

export function determineWinnerOfRace(carNames, finalScores) {
  const scoreOfWinner = findMaxValue(finalScores);
  const winner = carNames.filter((name, carIdx) => finalScores[carIdx] === scoreOfWinner)
  return winner;
}

