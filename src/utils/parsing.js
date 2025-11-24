export function parseByComma(input) {
  return input.split(",").map(n => n.trim());
}

export function parseToHistoryFormat(oneRoundHistory, name) { // [1,1,1] ["a","b","c"]
  return oneRoundHistory
    .map((result, idx) => `${name[idx]} : ${"-".repeat(result)}`)
    .join("\n");
}

export function parserToWinnerFormat(winner) {
  return `최종 우승자 : ${winner.join(", ")}`;
}