import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();
  return logSpy;
};

describe("woowacourse/mission-utils api 테스트", () => {
  let app;
  beforeEach(() => {
    app = new App();
  })

  test.each([
    ["경주할 자동차 이름을 입력해주세요.", "a,b,c"],
    ["경주할 자동차의 이름을 입력해주십쇼.","hihi, woowa, pre"],
    ["시도할 횟수는 몇 회인가요?", "5"]
  ])("readLineAsync가 입력값(자동차명 or 랩 수)을 정상적으로 처리되어 가져온다.", async (question, answer) => {
    mockQuestions([answer]);
    const userReply = await app.readInputAsyncUsingWoowaMissionApi(question);
    expect(MissionUtils.Console.readLineAsync).toHaveBeenCalledWith(question);
    expect(userReply).toBe(answer);
  });

  test("Random.pickNumberInRange를 사용해 0 이상 9 이하의 정수를 생성한다", () => {
    const results = Array.from({ length: 100 }, () =>
      app.pickRandomNumberInRangeUsingWoowaMissionApi(0, 9)
    );

    for (const num of results) {
      expect(Number.isInteger(num)).toBe(true);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(9);
    }
  });

  test("Console.print를 사용해 레이스의 히스토리를 출력한다.", () => {
    const logs = ["a : -", "b : ", "a : --", "a : --\nb : -\nc : -"]
    const logSpy = getLogSpy();
    app.printHistoryOfRace([[1, 0, 1], [1, 1, 1], [2, 1, 1]], ["a", "b", "c"]);
    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test("Console.print를 사용해 우승자를 출력한다.", () => {
    const log = "최종 우승자 : a, b";
    const logSpy = getLogSpy();
    app.printWinnerOfRace(["a", "b"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
  })
})