import { MissionUtils } from "@woowacourse/mission-utils";
import { parseByComma, parseToHistoryFormat, parserToWinnerFormat } from "./utils/parsing";
import { runSingleLap } from "./domains/race";
import { determineWinnerOfRace } from "./domains/queries";
import { validateCarNameRule, validateLapNumberRule } from "./utils/validator";
import { useStateContainer } from "./fp_core/state";

class App {
  async run() {
    // 입력(자동차명, 횟수)
    const rawCarNamesUserRequest = await this.readInputAsyncUsingWoowaMissionApi("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)");
    const carNames = parseByComma(rawCarNamesUserRequest);
    validateCarNameRule(carNames);  
    const rawLapUserRequest = await this.readInputAsyncUsingWoowaMissionApi("시도할 횟수는 몇 회인가요?");
    const totalLaps = Number(rawLapUserRequest);
    validateLapNumberRule(totalLaps);

    const [getRaceState, setRaceState] = useStateContainer({ // 상태 보관
      currentLap: 0,
      scores: Array(carNames.length).fill(0),
    });
    const raceState = getRaceState();
    const historyOfRace = [[...raceState.scores]]; // score 상태의 스냅샷을 기록
    const carCount = carNames.length;

    // 레이스 진행
    const randomNumberTape = this.makeRandomNumbersTape(carNames, totalLaps);
    for(let lp = 0 ; lp < totalLaps ; lp++ ) {
      const offset = lp * carCount;
      const randomNumbersForLap = randomNumberTape.slice(
        offset,
        offset + carCount
      );

      setRaceState(prev => runSingleLap(prev, randomNumbersForLap));

      const { scores } = getRaceState();
      historyOfRace.push([...scores]);
    }
    console.log(historyOfRace);
    const finalScoreState = getRaceState().scores;
    const namesOfWinner = determineWinnerOfRace(carNames, finalScoreState);
    // 결과 출력(레이스 히스토리, 우승자)
    this.printHistoryOfRace(historyOfRace, carNames);
    this.printWinnerOfRace(namesOfWinner);
  }
  
  async readInputAsyncUsingWoowaMissionApi(questionStr) {
    return await MissionUtils.Console.readLineAsync(questionStr);
  }
  makeRandomNumbersTape(cars, laps) { // 부수효과를 없애기 위해 필요한 만큼의 난수를 만들고 레이스 진행
    let numberTape = [];
    const countOfNeededNumber = cars.length * laps;
    for(let cnt = 0; cnt < countOfNeededNumber; cnt++) {
      numberTape.push(this.pickRandomNumberInRangeUsingWoowaMissionApi(0, 9))
    }
    return numberTape;
  } 
  pickRandomNumberInRangeUsingWoowaMissionApi(min, max) {
    return MissionUtils.Random.pickNumberInRange(min, max);
  }
  printOutputUsingWoowaMissionApi(output) {
    MissionUtils.Console.print(output);
  }
  printHistoryOfRace(history, name) {
    history.forEach(log => {
      this.printOutputUsingWoowaMissionApi(parseToHistoryFormat(log, name))
    })
  }
  printWinnerOfRace(winner) {
    this.printOutputUsingWoowaMissionApi(parserToWinnerFormat(winner));
  }
};
export default App;
