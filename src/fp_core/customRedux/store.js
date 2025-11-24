export function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action); // 새로운 상태 계산
    listeners.forEach((l) => l()); // 구독자들 호출
  };

  const subscribe = (listener) => {
    listeners.push(listener); // 리스너에 추가
    return () => {
      const idx = listeners.indexOf(listener);
      if(idx >= 0) listeners.splice(idx, 1);
    };
  };

  return {getState, dispatch, subscribe};
}