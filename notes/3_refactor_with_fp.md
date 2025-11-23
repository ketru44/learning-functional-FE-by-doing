# javascript-racing-8
2주차에 진행했던 레이싱 게임을 함수형 패러다임으로 리팩토링 해보겠습니다. 실제 웹 기술이나 프레임워크에 적용된 기술들을 직접 구현해보고 적용해보는 데에 목적이 있습니다.

### immutability 리팩토링
#### useStateContainer
  - React의 useState는 핵심은 '상태를 보관하고, 변경 시 리렌더링'이지만, 리렌더링이 필요하지 않기에 '상태를 한 곳에 모아두고 교체를 통해서 다루는 컨테이너'의 역할을 하는 버전을 만들어보겠습니다.
```js
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
``` 
  - 컨테이너는 상태를 `전역 변수`가 아닌 `클로저`에 감추고 상태를 저장, 읽기, 쓰기가 가능하게 합니다.
  - 컨테이너를 사용한다고 해서 불변성이 보장되는 것이 아닙니다. 목적은 상태 교체 방식을 강제하기 때문에 "새로운 객체나 배열을 만들어서 setState"로 변경한다라는 불변성을 유지하는데에 도움이 됩니다.
  - 매번 상태를 사용할때마다 getter함수로 불러와야 한다는 불편함이 있습니다. 아예 setState 호출 시 새로 변경 된 상태 값을 반환하도록 구현을 할까 고민했지만 setState는 변경, state는 현재 시점의 스냅샷을 읽어온다는 것을 유지하기 위해서 이렇게 구현하였습니다.

#### 불변 데이터 적용하기
  - 컨테이너를 사용하여 레이스에 사용되는 상태들을 분리하고, 데이터들이 불변성을 유지할 수 있도록 리팩토링 해보겠습니다. (이렇게 보니 상태들의 변경을 추적하는 기능에 대해서도 생각해보아야 할 것 같네요)
  - 사용하는 데이터 중 `상태가 변하거나 어떤 상태인지 나타내는 것`만 모아 객체로 만들어 보겠습니다.
    - 입력값(자동차명, 라운드 수)
    - 현재 라운드
    - 레이스 히스토리
    - 스코어
    ```js
    const [getRaceState, setRaceState] = useStateContainer({ // 상태 보관
      currentLap: 0,
      scores: Array(carNames.length).fill(0),
    });
    ```
  - 현재 코드를 보면 App.run()에서 runEntireRace라는 함수를 호출해 해당 함수에서 전체 레이스를 진행합니다. 
    ```js
    const historyOfRace = runEntireRace(raceState.carNames, raceState.totalLaps, randomNumberTape);
    ```
    runEntireRace 안에서 새로운 상태를 만들고 라운드를 진행하게 됩니다. setState를 활용하기 위해서 코드 구조를 변경했습니다.

### 순수함수 리팩토링

#### runEffect
- 기본적으로 미션을 시작할 때 입력, 출력, 랜덤 생성과 같은 액션을 분리하여 순수함수로 구현해보자는 틀을 만들었기 때문에 현재 함수들이 순수함수로 잘 구현되어 있습니다. 액션을 분리하면서 어디에 두어야 할 지 고민이 되었습니다. 계산에 영향을 주지 않기 위해 최상단인 app.run()에 자연스레 몰아 넣게 되었죠. 그래서 명시적으로 부수효과들을 분리하여 모아두면 좋겠다는 생각을 하게 되었습니다. 
- 그리고 모아두는 것 뿐 아니라 Redux에서 아이디어를 얻어서 `액션을 데이터로 추상화`해서 액션을 더욱더 경계에 몰아두려고 합니다. App.run()에서 Mission 유틸을 직접 호출하지 않도록 액션을 `설명하는 데이터`로 바꿔 보겠습니다.
  ```js
    export function createReadLineEffect(questionStr) {
      return {
        type: "readline",
        questionStr,
      }
    };
    export function createPrintEffect(printStr) {
      return {
        type: "print",
        printStr,
      }
    };
    export function createRandomNumberInRangeEffect(min, max) {
      return {
        type: "random_single",
        min,
        max,
      }
    }
  ```
- 이렇게 만들어진 객체는 액션이 아니라 `액션을 요청하기 위한 데이터`가 됩니다. 그리고 이 데이터를 읽고 runEffect에서 액션을 모아 수행함으로써 도메인 로직(액션)가 강하게 분리됩니다. 결과적으로 액션이 일어나는 곳은 runEffect로 제한하여 관리할 수 있게 됩니다. 모든 액션을 이 방식으로 관리를 한다면 `의도치 않거나 존재하면 안되는 부수효과`를 막고 예방할 수 있습니다!!
  ```js
  export async function runEffect(effect) {
    if(effect.type === "readline")  
      return await MissionUtils.Console.readLineAsync(effect.questionStr);
    if(effect.type === "print")
      return MissionUtils.Console.print(effect.printStr);
    if(effect.type === "random_single")
      return MissionUtils.Random.pickNumberInRange(effect.min, effect.max);
  
    throw new Error(`존재하지 않는 effect입니다. (${effect.type})`);
  };
  ```

### 상태 변경을 한곳으로 모으기
지금까지 useContainer를 사용해서 상태를 클로저 안에 모아 다루는 경험을 해보았고, 분리한 부수효과 아무 곳에 서나 일어나지 않도록 추상화 해보았습니다. 이번에 redux의 아이디어를 활용해 상태 변경까지 한 곳에 모으는 구조를 만들어보겠습니다. store와 reducer 개념을 사용해서 상태 변경에 대한 관리를 해보는 것이 목표입니다.

#### 1. store : 상태를 보관하고 변경을 알리는 곳
중요한 구조는 처음에 만들어 보았던 useStateContainer와 다르지 않지만 여기에 상태가 바뀌면 listener에게 알리는 기능을 추가했습니다.
```js
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
```

레이싱 게임에서는 라운드 상태를 출력하는 기능이 구독자가 되어서 상태를 변경합니다.
```js
store.dispatch(raceOneLap(randomNumbersForLap)); // 한 라운드 진행
```

#### 2. raceReducer : 상태 전이 순수함수
레이스를 한 번 진행했을 때 상태가 어디서 어떻게 바뀌는지(스코어가 어떻게 증가하는지, 현재 라운드가 어떻게 증가하는지)를 모아놓는 곳입니다. 상태와 액션(`redux에서 말하는 action은 부수효과가 아닌 상태 전이를 위한 계산을 뜻합니다!!!`) 받아 변경될 상태의 값을 계산해 반환하는 순수함수입니다.
```js
export function raceReducer(state, action) {
  if(action.type === RACE_INIT) {
    ...
  };
  if(action.type === RACE_ONE_LAP) {
    ...
  };
  return state;
}
```

### 정리
리팩토링의 목적은

- 상태가 어디서, 어떻게 바뀌는지를 raceReducer 하나에 모으고,
- 실제 콘솔 출력/입력/랜덤 같은 액션은 runEffect 쪽으로 몰아두고,
- 나머지 도메인 로직은 순수 함수와 불변 데이터로 유지해보는 실험이었습니다.

거창한 프레임워크를 쓴 건 아니지만, fp에 대해 공부한 내용을 바탕으로 “상태는 store에 모으고, 변경은 reducer에서만, 액션은 경계에서만”이라는 FP + Redux 스타일의 설계 철학을 작은 프로젝트 위에서 직접 느껴보는 데 의미가 있었다고 생각합니다. 