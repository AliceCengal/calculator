import { useEffect } from "preact/hooks";
import { MachineAction, MachineState, useCalcDispatch, useCalcState } from "../../controller";
import style from "./index.module.css";

// TODO: deg/rad , swap, pop

export function Keypad() {
  useKeyboardControl();

  return (
    <div class={style.main}>
      <Key label="log" op="log" />
      <Key label="exp" op="exp" />
      <Key label="x^y" op="expn" />
      <Key label="x^2" op="square" />
      <Key label="x^3" op="cube" />

      <ToggleKey label="arc" op="arc" check_key="mode_arc" />
      <ToggleKey label="hyp" op="hyp" check_key="mode_hyp" />
      <ToggleKey label="deg" op="deg" check_key="mode_deg" />
      <Key label="1/x" op="inv" />
      <Key2 label={"\u221A"} op="sqrt" />

      <Key label="sin" op="sin" />
      <Key label="cos" op="cos" />
      <Key label="tan" op="tan" />
      <Key2 label={"\u{1d70f}"} op="tau" />
      <Key2 label={"\u{1d70b}"} op="pi" />

      <Key label="7" op="7" />
      <Key label="8" op="8" />
      <Key label="9" op="9" />
      <Key label="POP" op="pop" />
      <Key label="SWP" op="swap" />

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
      <Key2 label="." op="decimal" />
      <Key label="PUSH" op="push" />
    </div>
  );
}

function Key({ label, op }: { label: string; op: MachineAction }) {
  const dispatch = useCalcDispatch();
  return (
    <button
      onClick={(e) => {
        buzz();
        dispatch(op);
      }}
      class={style.key}
    >
      {label}
    </button>
  );
}

function Key2({ label, op }: { label: string; op: MachineAction }) {
  const dispatch = useCalcDispatch();
  return (
    <button
      onClick={(e) => {
        buzz();
        dispatch(op);
      }}
      class={style.key2}
    >
      {label}
    </button>
  );
}

function ToggleKey({ label, op, check_key }: { label: string; op: MachineAction, check_key: keyof MachineState }) {
  const dispatch = useCalcDispatch();
  const state = useCalcState()

  return (
    <button
      onClick={(e) => {
        buzz();
        dispatch(op);
      }}
      class={`${style.key} ${state[check_key] ? style.key_active : ""}`}
    >
      {label}
    </button>
  );
}

const buzz =
  typeof navigator !== "undefined" && typeof navigator.vibrate !== "undefined"
    ? () => navigator.vibrate(10)
    : () => { };

function useKeyboardControl() {
  const dispatch = useCalcDispatch();

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      // console.log("useKeyboardControl", e.key);
      const command = KEY_MAP[e.key];
      if (command != null) {
        dispatch(command);
      }
    };
    window.addEventListener("keyup", f);
    return () => {
      window.removeEventListener("keyup", f);
    };
  }, []);
}

const KEY_MAP: Record<string, MachineAction> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "0": "0",
  "+": "plus",
  "-": "minus",
  "*": "multiply",
  "/": "divide",
  Enter: "push",
  Backspace: "back",
  ".": "decimal",
};
