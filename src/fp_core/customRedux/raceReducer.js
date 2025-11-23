import { runSingleLap } from "../../domains/race";

const RACE_INIT = "RACE_INIT";
const RACE_ONE_LAP = "RACE_ONE_LAP";

export function raceReducer(state, action) {
  if(action.type === RACE_INIT) {
    const { carNames, totalLaps } = action.payload;
    return {
      carNames,
      totalLaps,
      currentLap: 0,
      scores: Array(carNames.length).fill(0),
    };
  };
  if(action.type === RACE_ONE_LAP) {
    const { randomNumbersForLap } = action.payload;
    
    return runSingleLap(state, randomNumbersForLap);
  };
  return state;
}

export const raceInit = (carNames, totalLaps) => ({
  type: RACE_INIT,
  payload: { carNames, totalLaps },
});

export const raceOneLap = (randomNumbersForLap) => ({
  type: RACE_ONE_LAP,
  payload: { randomNumbersForLap },
});
