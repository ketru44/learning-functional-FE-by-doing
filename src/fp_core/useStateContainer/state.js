export function useStateContainer(initialState) {
  let state = initialState; // 상태 저장

  const getState = () => state; // 리렌더링이 없기 떄문에 함수로 값 호출

  const setStateContainer = (nextState) => {
    if (typeof nextState === "function") {
      state = nextState(state);
      return;
    }
    state = nextState;
  }

  return [getState, setStateContainer];
}