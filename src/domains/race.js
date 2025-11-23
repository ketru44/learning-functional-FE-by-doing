export const meetMoveCondition = (number, threshold = 4) => number >= threshold; // 요구사항: 4이상이면 전진, 아니면 정지

export function runEntireRace(arrOfCarNames, cntOfLaps, randomTape) {
  let randomNumbers = randomTape.slice(); // 불변성 방지 복사
  let scoreAfterCurrentLap = Array(arrOfCarNames.length).fill(0);
  const raceHistoryByLap = []; // 최종결과(마지막랩)로 쉽게 활용할 수 있도록 랩을 기준으로 데이터 저장
  for(let currentLap = 0 ; currentLap < cntOfLaps ; currentLap++) {
    scoreAfterCurrentLap = scoreAfterCurrentLap.slice().map(prev => {
      if(meetMoveCondition(randomNumbers.shift())) return prev + 1;
      return prev;
    });
    raceHistoryByLap.push(scoreAfterCurrentLap.slice());
  }
  return raceHistoryByLap;
};

export function runSingleLap(prevState, raceResultNumber) {
  const currentScore = prevState.scores;
  const nextScores = currentScore.map((prevScore, idx) => {
    const raceResult = raceResultNumber[idx];
    if(meetMoveCondition(raceResult)) return prevScore + 1;
    return prevScore
  })
  return {
    ...prevState,
    currentLap: prevState.currentLap + 1,
    scores: nextScores,
  };
}
