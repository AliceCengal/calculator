import { useCalcState } from "../../controller";
import style from "./index.module.css";

export function Display() {
  const state = useCalcState();

  const stack_4 =
    state.stack.length > 2 ? state.stack[state.stack.length - 3] : "0";

  const stack_3 =
    state.stack.length > 1 ? state.stack[state.stack.length - 2] : "0";

  const stack_2 = state.stack.length
    ? state.stack[state.stack.length - 1]
    : "0";

  return (
    <div class={style.main}>
      <div>{stack_4}</div>
      <div>{stack_3}</div>
      <div>{stack_2}</div>
      <div>{state.front}</div>
    </div>
  );
}
