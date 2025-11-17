export function validateCarNameRule(names) {
  if(new Set(names).size != names.length) throw new Error("[ERROR] : 중복된 이름을 사용할 수 없습니다.")
  names.forEach(n => {
    if(n.length > 5 || n.length === 0) throw new Error("[ERROR] : 자동차 명은 5자 이하여야 합니다.");
  });
}

export function validateLapNumberRule(lap) {
  if(lap <= 0 || !Number.isInteger(lap))
    throw new Error("[ERROR] : 횟수는 양의 정수이어야 합니다.")
}