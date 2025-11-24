import { MissionUtils } from "@woowacourse/mission-utils";
import { parseByComma, parseToHistoryFormat, parserToWinnerFormat } from "./utils/parsing.js";
import { determineWinnerOfRace } from "./domains/queries.js";
import { validateCarNameRule, validateLapNumberRule } from "./utils/validator.js";
import { runSingleLap } from "./domains/race.js";
import { useStateContainer } from "./fp_core/useStateContainer/state.js";
import { createReadLineEffect, createPrintEffect, createRandomNumberInRangeEffect } from "./fp_core/effect/effectData.js";
import { runEffect } from "./fp_core/effect/effectRunner.js";
import { createStore } from "./fp_core/customRedux/store.js";
import { raceReducer, raceInit, raceOneLap } from "./fp_core/customRedux/raceReducer.js";

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

    // store + reducer 사용 버전
    const store = createStore(raceReducer, {}); // store 생성

    // 상태가 변할 때마다 라운드 결과를 출력하도록 구독
    store.subscribe(() => {
      const state = store.getState();
      if (state.currentLap > 0) {
        const line = parseToHistoryFormat(state.scores, state.carNames);
        runEffect(createPrintEffect(line));
      }
    });

    store.dispatch(raceInit(carNames, totalLaps));
    const stateAfterInit = store.getState();
    const carCount = stateAfterInit.carNames.length;

    const randomNumberTape = await this.makeRandomNumbersTape(
      stateAfterInit.carNames,
      stateAfterInit.totalLaps
    );

    // 라운드 진행 + 매 라운드마다 출력
    for (let lap = 0; lap < totalLaps; lap++) {
      const offset = lap * carCount;
      const randomNumbersForLap = randomNumberTape.slice(offset, offset + carCount);
      store.dispatch(raceOneLap(randomNumbersForLap));
      // => 여기서 dispatch가 호출되면, subscribe 콜백이 불려 그 시점의 scores를 기반으로 한 줄 출력
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
