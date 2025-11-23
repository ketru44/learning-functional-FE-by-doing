import { MissionUtils } from "@woowacourse/mission-utils";
import { parseByComma, parseToHistoryFormat, parserToWinnerFormat } from "./utils/parsing";
import { runSingleLap } from "./domains/race";
import { determineWinnerOfRace } from "./domains/queries";
import { validateCarNameRule, validateLapNumberRule } from "./utils/validator";
import { useStateContainer } from "./fp_core/useStateContainer/state";
import { createReadLineEffect, createPrintEffect, createRandomNumberInRangeEffect } from "./fp_core/effect/effectData";
import { runEffect } from "./fp_core/effect/effectRunner";
import { createStore } from "./fp_core/customRedux/store";
import { raceReducer, raceInit, raceOneLap } from "./fp_core/customRedux/raceReducer";

class App {
  async run() {
    // 입력(자동차명, 횟수)
    const rawCarNamesUserRequest = await runEffect(
      createReadLineEffect("경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)")
    );
    const carNames = parseByComma(rawCarNamesUserRequest);
    validateCarNameRule(carNames);

    const rawLapUserRequest = await runEffect(
      createReadLineEffect("시도할 횟수는 몇 회인가요?")
    );
    const totalLaps = Number(rawLapUserRequest);
    validateLapNumberRule(totalLaps);

    // // useStateContainer 사용 버전
    // const [getRaceState, setRaceState] = useStateContainer({ // 상태 보관
    //   currentLap: 0,
    //   scores: Array(carNames.length).fill(0),
    // });
    // const raceState = getRaceState();
    // const historyOfRace = [[...raceState.scores]]; // score 상태의 스냅샷을 기록

    // const carCount = carNames.length;
    // // 레이스 진행
    // const randomNumberTape = await this.makeRandomNumbersTape(carNames, totalLaps);
    // for(let lp = 0 ; lp < totalLaps ; lp++ ) {
    //   const offset = lp * carCount;
    //   const randomNumbersForLap = randomNumberTape.slice(
    //     offset,
    //     offset + carCount
    //   );

    //   setRaceState(prev => runSingleLap(prev, randomNumbersForLap));

    //   const { scores } = getRaceState();
    //   historyOfRace.push([...scores]);
    // }
    // const finalScoreState = getRaceState().scores;
    // const namesOfWinner = determineWinnerOfRace(carNames, finalScoreState);

    // historyOfRace.forEach((log) => {
    //   const msg = parseToHistoryFormat(log, carNames);
    //   runEffect(createPrintEffect(msg));
    // });

    // runEffect(createPrintEffect(parserToWinnerFormat(namesOfWinner)));

    const store = createStore(raceReducer, {});
    store.dispatch(raceInit(carNames, totalLaps));
    const stateAfterInit = store.getState();
    const carCount = stateAfterInit.carNames.length;

    const randomNumberTape = await this.makeRandomNumbersTape(
      stateAfterInit.carNames,
      stateAfterInit.totalLaps
    );

    // 라운드 진행 + 매 라운드마다 출력
    for (let lap = 0; lap < stateAfterInit.totalLaps; lap++) {
      const offset = lap * carCount;
      const randomNumbersForLap = randomNumberTape.slice(offset, offset + carCount);

      store.dispatch(raceOneLap(randomNumbersForLap)); // 한 라운드 진행

      const state = store.getState(); // 최신 상태
      const line = parseToHistoryFormat(state.scores, state.carNames);
      await runEffect(createPrintEffect(line)); 
    }

    const finalState = store.getState();
    const namesOfWinner = determineWinnerOfRace(
      finalState.carNames,
      finalState.scores
    );
    await runEffect(
      createPrintEffect(parserToWinnerFormat(namesOfWinner))
    );

  }
  
  async readInputAsyncUsingWoowaMissionApi(questionStr) {
    return await MissionUtils.Console.readLineAsync(questionStr);
  }
  async makeRandomNumbersTape(cars, laps) { // 부수효과를 없애기 위해 필요한 만큼의 난수를 만들고 레이스 진행
    let numberTape = [];
    const countOfNeededNumber = cars.length * laps;
    for(let cnt = 0; cnt < countOfNeededNumber; cnt++) {
      const random = await runEffect(
        createRandomNumberInRangeEffect(0, 9)
      )
      numberTape.push(random);
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
      runEffect(
        createPrintEffect((parseToHistoryFormat(log, name)))
      )
    })
  }
  printWinnerOfRace(winner) {
    runEffect(
      createPrintEffect((parserToWinnerFormat(winner)))
    );
  }
};
export default App;
