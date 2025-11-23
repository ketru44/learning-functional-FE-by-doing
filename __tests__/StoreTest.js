import { createStore } from "../src/fp_core/customRedux/store";
import { raceReducer, raceInit } from "../src/fp_core/customRedux/raceReducer";
import { raceOneLap } from "../src/fp_core/customRedux/raceReducer";

describe("createStore + raceReducer 통합 테스트", () => {
  test("초기 상태를 getState로 조회할 수 있다", () => {
    const initialState = {
      carNames: [],
      totalLaps: 0,
      currentLap: 0,
      scores: [],
    };

    const store = createStore(raceReducer, initialState);

    expect(store.getState()).toEqual(initialState);
  });

  test("raceInit, raceOneLap 디스패치로 상태가 올바르게 변경된다", () => {
    const initialState = undefined; // 처음엔 undefined 시작

    const store = createStore(raceReducer, initialState);

    store.dispatch(raceInit(["pobi", "woni"], 2)); // init

    expect(store.getState()).toEqual({
      carNames: ["pobi", "woni"],
      totalLaps: 2,
      currentLap: 0,
      scores: [0, 0],
    });

    store.dispatch( // 한라운드 진행 -> 상태 변경 발생
      raceOneLap([4, 3]) 
    );

    const stateAfterOneLap = store.getState();
    expect(stateAfterOneLap.currentLap).toBe(1);
    expect(stateAfterOneLap.scores).toEqual([1, 0]);
  });

  test("subscribe는 상태 변경 시 리스너를 호출하고, unsubscribe 후에는 호출하지 않는다", () => {
    const store = createStore(raceReducer, undefined);

    const listener = jest.fn();

    const unsubscribe = store.subscribe(listener);

    store.dispatch(raceInit(["pobi"], 1));
    expect(listener).toHaveBeenCalledTimes(1);

    store.dispatch(raceOneLap([5]));
    expect(listener).toHaveBeenCalledTimes(2);

    // 구독 해제
    unsubscribe();

    store.dispatch(raceOneLap([5]));
    expect(listener).toHaveBeenCalledTimes(2); // 더 이상 증가 X
  });
});