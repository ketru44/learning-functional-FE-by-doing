import { MissionUtils } from "@woowacourse/mission-utils";

export async function runEffect(effect) {
  if(effect.type === "readline")  
    return await MissionUtils.Console.readLineAsync(effect.questionStr);
  if(effect.type === "print")
    return MissionUtils.Console.print(effect.printStr);
  if(effect.type === "random_single")
    return MissionUtils.Random.pickNumberInRange(effect.min, effect.max);
  
  throw new Error(`존재하지 않는 effect입니다. (${effect.type})`);
};