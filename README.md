# 함수형 패러다임 이해하기
## 프로젝트 개요
이 프로젝트는 `함수형 패러다임이 웹 개발이라는 환경에서 어떻게 활용되는가`와 `함수형 사고를 중심으로 프리코스를 진행하면서 겪었던 문제`에 대한 개인적인 탐구입니다.

지난 3주 동안 정해진 프리코스 미션을 수행하며 함수형 패러다임을 일부 적용해보았습니다. 하지만 현대 웹은 본질적으로 비동기 이벤트, 상태, DOM 조작과 같은 부수효과 없인 존재할 수 없습니다. 이 둘은 섞일 수 없는 개념들처럼 보입니다. 어떻게 FP가 `프론트엔드 개발에 필요한 이유`와 `적용되고 있는 방식`에 대해서 알아봅니다.

이러한 개념들을 바탕으로 'learning by doing'을 통해서 직접 구현해보며 프리코스를 진행하면서 겪었던 함수형 패러다임에 대한 궁금증들을 해결해보려고 합니다.

## 목표
`부수효과로 가득한 웹 환경에서 어떻게 그리고 왜 함수형 패러다임이 적용되고 있는지 이해해 봅니다.`

## 차례
- 1. [FP_or_Web](./notes/1_FP_or_Web.md)
- 2. [FP_and_Web](./notes/2_FP_and_Web.md)
- 3. [refactor_with_fp](./notes/3_refactor_with_fp.md)
  - src/fp_core
- 4. [conclusion](./notes/4_conclusion.md)

## 리팩토링 포인트
### 1. `useStateContainer` - 상태를 한 곳으로 모으기
- React의 `useState`에서 “상태를 외부에서 직접 건드리지 않고, 교체로만 다룬다”는 아이디어를 가져와,`클로저 안에 상태를 숨긴 컨테이너`로 구현
### 2. `runEffect` - 액션을 추상화
- 입력/출력/랜덤 같은 액션을 바로 호출하지 않고, 먼저 “무엇을 하고 싶은지”를 데이터로 만든 후, 마지막에 한 번에 실행
### 3. `store + raceReducer` - 상태 변경
- 상태 변경을 하나의 경로로만 가능하게 하여 상태가 추적 가능해지고 아무곳에서나 상태를 건드리는 것을 방어

## 폴더 구조
```txt
src/
  App.js
  domains/
    queries.js
    race.js
  fp_core/
    useStateContainer/
      state.js
    effect/
      effectData.js
      effectRunner.js
    customRedux/
      store.js
      raceReducer.js
```
## 실행 방법
```bash
# 설치
npm install

# 실행
npm start 
  # 또는
npm src/index.js

# 테스트
npm test
```

### 참고 자료
https://alfy.blog/2025/10/04/how-functional-programming-shaped-modern-frontend.html

https://ko.react.dev/

https://medium.com/@taljoffe/functional-programming-with-react-redux-6228906edbe3

https://github.com/reduxjs/redux

https://pitayan.com/posts/redux-fp-design/