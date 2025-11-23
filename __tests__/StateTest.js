import { useStateContainer } from "../src/fp_core/useStateContainer/state";

describe("useState 연습 테스트", () => {
  test("문자열 데이터 container 테스트", () => {
    const initialValue = "fpfpfp";
    const [getValue, setValue] = useStateContainer(initialValue);

    expect(getValue()).toBe(initialValue);
  }),
  test("데이터 변경 테스트", () => {
    const initialValue = "fpfpfp";
    const [getValue, setValue] = useStateContainer(initialValue);

    const nextValue = "oopoop"
    setValue(nextValue);

    expect(getValue()).toBe(nextValue)
  })
})