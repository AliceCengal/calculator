import { MachineAction, useCalcDispatch } from "../../controller";
import style from "./index.module.css";

// TODO: deg/rad,, hyperbolic trig, exp, inverse 1/x

export function Keypad() {
  return (
    <div class={style.main}>
      <Key label="asin" op="asin" />
      <Key label="acos" op="acos" />
      <Key label="atan" op="atan" />
      <Key2 label={"\u221A"} op="sqrt" />
      <Key2 label={"\u221B"} op="cbrt" />

      <Key label="sin" op="sin" />
      <Key label="cos" op="cos" />
      <Key label="tan" op="tan" />
      <Key label="e" op="e" />
      <Key2 label={"\u213c"} op="pi" />

      <Key label="7" op="7" />
      <Key label="8" op="8" />
      <Key label="9" op="9" />
      <Key label="C" op="back" />
      <Key label="CL" op="clear" />

      <Key label="4" op="4" />
      <Key label="5" op="5" />
      <Key label="6" op="6" />
      <Key2 label={"\u00d7"} op="multiply" />
      <Key2 label={"\u00f7"} op="divide" />

      <Key label="1" op="1" />
      <Key label="2" op="2" />
      <Key label="3" op="3" />
      <Key2 label={"\u002b"} op="plus" />
      <Key2 label={"\u002d"} op="minus" />

      <Key label="0" op="0" />
      <Key2 label={"\u00b1"} op="negate" />
      <Key label="." op="decimal" />
      <Key label="PUSH" op="push" />
    </div>
  );
}

function Key({ label, op }: { label: string; op: MachineAction }) {
  const dispatch = useCalcDispatch();
  return (
    <button onClick={(e) => dispatch(op)} class={style.key}>
      {label}
    </button>
  );
}

function Key2({ label, op }: { label: string; op: MachineAction }) {
  const dispatch = useCalcDispatch();
  return (
    <button onClick={(e) => dispatch(op)} class={style.key2}>
      {label}
    </button>
  );
}
