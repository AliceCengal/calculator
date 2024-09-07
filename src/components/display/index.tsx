import { useCalcState } from "../../controller";
import style from "./index.module.css";

export function Display() {
  const state = useCalcState();

  return (
    <div class={style.main}>
      <div>{state.stack[2] ?? "0"}</div>
      <div>{state.stack[1] ?? "0"}</div>
      <div>{state.stack[0] ?? "0"}</div>
      <div>{state.front}</div>
    </div>
  );
}
