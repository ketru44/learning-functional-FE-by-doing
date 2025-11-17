import { MissionUtils } from "@woowacourse/mission-utils";
import { parseByComma, parseToHistoryFormat, parserToWinnerFormat } from "./utils/parsing";
import { runEntireRace } from "./domains/race";
import { determineWinnerOfRace } from "./domains/queries";
import { validateCarNameRule, validateLapNumberRule } from "./utils/validator";

class App {
  async run() {
    // 입력(자동차명, 횟수)
    const stringOfCarNamesUserRequest = await this.readInputAsyncUsingWoowaMissionApi("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)");
    const arrayOfCarNamesUserRequest = parseByComma(stringOfCarNamesUserRequest);
    validateCarNameRule(arrayOfCarNamesUserRequest);  
    const stringOfLapUserRequest = await this.readInputAsyncUsingWoowaMissionApi("시도할 횟수는 몇 회인가요?");
    const countOfLapUserRequest = Number(stringOfLapUserRequest);
    validateLapNumberRule(countOfLapUserRequest);
    // 레이스 진행
    const randomNumberTape = this.makeRandomNumbersTape(arrayOfCarNamesUserRequest, countOfLapUserRequest);
    const historyOfRace = runEntireRace(arrayOfCarNamesUserRequest, countOfLapUserRequest, randomNumberTape);
    const namesOfWinner = determineWinnerOfRace(arrayOfCarNamesUserRequest, historyOfRace[historyOfRace.length -1]);
    // 결과 출력(레이스 히스토리, 우승자)
    this.printHistoryOfRace(historyOfRace, arrayOfCarNamesUserRequest);
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
