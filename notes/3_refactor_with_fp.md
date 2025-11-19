# javascript-racing-8
2주차에 진행했던 레이싱 게임을 함수형 패러다임으로 리팩토링 해보겠습니다. 실제 웹 기술이나 프레임워크에 적용된 기술들을 직접 구현해보고 적용해보는 데에 목적이 있습니다.

### immutability 준수 리팩토링
useStateContainer
  - React의 useState는 핵심은 '상태를 보관하고, 변경 시 리렌더링'이지만, 리렌더링이 필요하지 않기에 '상태를 한 곳에 모아두고 교체를 통해서 다루는 컨테이너'의 역할을 하는 버전을 만들어보겠습니다.
```js
export function useStateContainer(initialState) {
  let state = initialState; // 클로저 안에 상태 저장

  const getState = () => state; // 리렌더링이 없기 떄문에 함수로 값 호출

  const setStateContainer = (nextState) => { // 상태 교체
    state = nextState;
  }

  return [getState, setStateContainer];
}
``` 
  - 컨테이너는 상태를 `전역 변수`가 아닌 `클로저`에 감추고 상태를 저장, 읽기, 쓰기가 가능하게 합니다.
  - 컨테이너를 사용한다고 해서 불변성이 보장되는 것이 아닙니다. 목적은 상태 교체 방식을 강제하기 때문에 "새로운 객체나 배열을 만들어서 setState"로 변경한다라는 불변성을 유지하는데에 도움이 됩니다.

불변 데이터 적용하기
  - 컨테이너를 사용하여 레이스에 사용되는 상태들을 분리하고, 데이터들이 불변성을 유지할 수 있도록 리팩토링 해보겠습니다. (이렇게 보니 상태들의 변경을 추적하는 기능에 대해서도 생각해보아야 할 것 같네요)
  - 사용하는 데이터 중 상태가 `변하거나 추후 변할 가능성`이 있는 것만 모아 객체로 만들어 보겠습니다.
    - 입력값(자동차명, 라운드 수)
    - 현재 라운드
    - 레이스 히스토리
    ```js
    const [getRaceState, setRaceState] = useStateContainer({ // 상태 보관
      carNames,
      totalLaps,
      currentLap: 0,
      scores: Array(carNames.length).fill(0),
    });
    ```

