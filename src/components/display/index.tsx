import { useCalcState } from "../../controller";
import style from "./index.module.css";

export function Display() {
  const state = useCalcState();
  // console.log("Display", state.stack);
  return (
    <div class={style.main}>
      <div>{state.stack[state.stack.length - 3] ?? "0"}</div>
      <div>{state.stack[state.stack.length - 2] ?? "0"}</div>
      <div><span class={style.label}>y:</span><span>{state.stack[state.stack.length - 1] ?? "0"}</span></div>
      <div><span class={style.label}>x:</span><span>{state.front}</span></div>
    </div>
  );
}
