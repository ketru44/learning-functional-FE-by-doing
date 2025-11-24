import { runEntireRace } from "../src/domains/race";
import { determineWinnerOfRace, findMaxValue } from "../src/domains/queries";

describe("레이스 진행 도메인 테스트", () => {
  test.each([
    [["a", "b", "c"], 2, [4, 1, 2, 9, 0, 4], [[1, 0, 0], [2, 0, 1]]],
    [["red", "blue", "black"], 3, [5, 2, 4, 9, 5, 9, 9, 4, 6], [[1, 0, 1], [2, 1, 2], [3, 2, 3]]]
  ])("레이스 진행하여 전체 히스토리를 기록한다.", (carnames, laps, randomTape, raceHistory) => {
    const result = runEntireRace(carnames, laps, randomTape);
    expect(result).toStrictEqual(raceHistory);
  })
  test("숫자 배열에서 최댓값을 찾는다.", () => {
    expect(findMaxValue([2, 3, 8])).toBe(8);
  })
  test.each([
    [["a", "ab", "c"], [2, 5, 4], ["ab"]],
    [["red", "black", "blue"], [9, 19, 19], ["black", "blue"]]
  ])("최종 점수 배열에서 우승자를 선택한다.", (names, scores, expectWinner) => {
    const winner = determineWinnerOfRace(names, scores);
    expect(winner).toStrictEqual(expectWinner);
  })
})