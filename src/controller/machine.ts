import { useReducer } from "preact/hooks";

type Mode = "steady" | "input" | "decimal";

const INITIAL_STATE = {
  stack: [] as number[],
  front: "0",
  mode: "input" as Mode,
  mode_arc: false,
  mode_hyp: false,
};

export type MachineState = typeof INITIAL_STATE;

export type MachineAction =
  | "push"
  | "back"
  | "delete"
  | "clear"
  | "decimal"
  | "negate"
  | "plus"
  | "minus"
  | "multiply"
  | "divide"
  | "inv"
  | "sin"
  | "cos"
  | "tan"
  | "arc"
  | "hyp"
  | "square"
  | "cube"
  | "sqrt"
  | "cbrt"
  | "exp"
  | "log"
  | "expn"
  | "e"
  | "pi"
  | "0"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1"
  | "NOOP";

function processTrig(num: number, op: string, arc: boolean, hyp: boolean) {
  if ((op == "cos" || op == "sin") && arc) {
    if (num >= 1 || num <= -1) return num.toString();
  }
  let op2 = `${arc ? "a" : ""}${op}${hyp ? "h" : ""}`
  return (Math as any)[op2](num).toString() as string
}

function reducer(s: MachineState[], a: MachineAction): MachineState[] {
  const prev = s[s.length - 1];
  switch (a) {
    case "cos":
    case "tan":
    case "sin": {
      const result = processTrig(Number(prev.front), a, prev.mode_arc, prev.mode_hyp)
      return s.concat({
        stack: prev.stack.slice(),
        front: result,
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "arc": {
      return s.concat({
        ...prev,
        mode_arc: !prev.mode_arc
      })
    }
    case "hyp": {
      return s.concat({
        ...prev,
        mode_hyp: !prev.mode_hyp
      })
    }
    case "square": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), 2).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      })
    }
    case "cube": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), 3).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      })
    }
    case "sqrt": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.sqrt(Math.abs(Number(prev.front))).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "cbrt": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.cbrt(Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "exp": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.exp(Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "log": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.log(Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "expn": {
      const top = prev.stack.pop()
      if (top == null) return s;
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), top).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "multiply": {
      const top = prev.stack.pop();
      if (top == null) return s;
      return s.concat({
        stack: prev.stack.slice(),
        front: (Number(prev.front) * top).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "divide": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (top / Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "inv": {
      return s.concat({
        stack: prev.stack.slice(),
        front: (1 / Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "plus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (Number(prev.front) + top).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "minus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (top - Number(prev.front)).toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "push": {
      return s.concat({
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: "0",
        mode: "input",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "back": {
      if (s.length > 1) {
        return s.slice(0, s.length - 1);
      }
      return s;
    }
    case "clear": {
      return [INITIAL_STATE];
    }
    case "decimal": {
      if (prev.mode === "steady") {
        return s.concat({
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: "0.",
          mode: "input",
          mode_arc: prev.mode_arc,
          mode_hyp: prev.mode_hyp,
        });
      }
      if (!prev.front.includes(".")) {
        return s.concat({
          ...prev,
          front: prev.front + ".",
        });
      }
      return s;
    }
    case "negate": {
      if (prev.front.startsWith("-")) {
        return s.concat({
          ...prev,
          front: prev.front.slice(1),
        });
      }
      return s.concat({
        ...prev,
        front: "-" + prev.front,
      });
    }
    case "e": {
      return s.concat({
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: Math.E.toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "pi": {
      return s.concat({
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: Math.PI.toString(),
        mode: "steady",
        mode_arc: prev.mode_arc,
        mode_hyp: prev.mode_hyp,
      });
    }
    case "NOOP": {
      return s;
    }
    default: {
      if (prev.mode === "steady") {
        return s.concat({
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: a,
          mode: "input",
          mode_arc: prev.mode_arc,
          mode_hyp: prev.mode_hyp,
        });
      }
      return s.concat({
        ...prev,
        front: prev.front === "0" ? a : prev.front + a,
      });
    }
  }
}

export function useMachine() {
  return useReducer(reducer, [INITIAL_STATE]);
}
