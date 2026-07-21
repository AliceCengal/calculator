import { useReducer } from "preact/hooks";

type Mode = "steady" | "input" | "decimal";

const INITIAL_STATE = {
  stack: [] as number[],
  front: "0",
  mode: "input" as Mode,
  mode_arc: false,
  mode_hyp: false,
  mode_deg: false,
};

export type MachineState = typeof INITIAL_STATE;

export type MachineAction =
  | "push"
  | "pop"
  | "swap"
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
  | "deg"
  | "square"
  | "cube"
  | "sqrt"
  | "cbrt"
  | "exp"
  | "log"
  | "expn"
  | "tau"
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

function processTrig(num: number, op: string, hyp: boolean, deg: boolean) {
  const input = deg ? Math.PI * num / 180 : num
  const op2 = hyp ? op + "h" : op
  const result = (Math as any)[op2](input).toString() as string
  return result
}

function processArcTrig(num: number, op: string, hyp: boolean, deg: boolean) {
  if (op == "cos" || op == "sin" && !hyp) {
    if (num > 1 || num < -1) return num.toString();
  }
  let op2 = `a${op}${hyp ? "h" : ""}`
  const result = (Math as any)[op2](num) as number
  return (deg ? Math.PI * result / 180 : result).toString() as string
}

function reducer(s: MachineState, a: MachineAction): MachineState {
  const prev = s;
  switch (a) {
    case "cos":
    case "tan":
    case "sin": {
      const result = prev.mode_arc ? processArcTrig(Number(prev.front), a, prev.mode_hyp, prev.mode_deg) : processTrig(Number(prev.front), a, prev.mode_hyp, prev.mode_deg)
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: result,
        mode: "steady",
      };
    }
    case "arc": {
      return {
        ...prev,
        mode_arc: !prev.mode_arc
      }
    }
    case "hyp": {
      return {
        ...prev,
        mode_hyp: !prev.mode_hyp
      }
    }
    case "deg": {
      return {
        ...prev,
        mode_deg: !prev.mode_deg
      }
    }
    case "square": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), 2).toString(),
        mode: "steady",
      }
    }
    case "cube": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), 3).toString(),
        mode: "steady",
      }
    }
    case "sqrt": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.sqrt(Math.abs(Number(prev.front))).toString(),
        mode: "steady",
      };
    }
    case "cbrt": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.cbrt(Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "exp": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.exp(Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "log": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.log(Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "expn": {
      const top = prev.stack.pop()
      if (top == null) return s;
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: Math.pow(Number(prev.front), top).toString(),
        mode: "steady",
      };
    }
    case "multiply": {
      const top = prev.stack.pop();
      if (top == null) return s;
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: (Number(prev.front) * top).toString(),
        mode: "steady",
      };
    }
    case "divide": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: (top / Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "inv": {
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: (1 / Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "plus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: (Number(prev.front) + top).toString(),
        mode: "steady",
      };
    }
    case "minus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return {
        ...prev,
        stack: prev.stack.slice(),
        front: (top - Number(prev.front)).toString(),
        mode: "steady",
      };
    }
    case "push": {
      return {
        ...prev,
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: "0",
        mode: "input",
      };
    }
    case "pop": {
      const top = prev.stack.pop()
      if (top == null) return {
        ...prev,
        front: "0",
        mode: "steady"
      };
      return {
        ...prev,
        front: top.toString(),
        mode: "steady"
      }
    }
    case "swap": {
      const top = prev.stack.pop() ?? 0
      const front = Number.parseFloat(prev.front)
      return {
        ...prev,
        stack: prev.stack.concat(front),
        front: top.toString(),
        mode: "steady",
      }
    }
    case "back": {
      // if (s.length > 1) {
      //   return s.slice(0, s.length - 1);
      // }
      return s;
    }
    case "clear": {
      return INITIAL_STATE;
    }
    case "decimal": {
      if (prev.mode === "steady") {
        return {
          ...prev,
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: "0.",
          mode: "input",
        };
      }
      if (!prev.front.includes(".")) {
        return {
          ...prev,
          front: prev.front + ".",
        };
      }
      return s;
    }
    case "negate": {
      if (prev.front.startsWith("-")) {
        return {
          ...prev,
          front: prev.front.slice(1),
        };
      }
      return {
        ...prev,
        front: "-" + prev.front,
      };
    }
    case "tau": {
      return {
        ...prev,
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: (Math.PI * 2).toString(),
        mode: "steady",
      };
    }
    case "pi": {
      return {
        ...prev,
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: Math.PI.toString(),
        mode: "steady",
      };
    }
    case "NOOP": {
      return s;
    }
    default: {
      if (prev.mode === "steady") {
        return {
          ...prev,
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: a,
          mode: "input",
        };
      }
      return {
        ...prev,
        front: prev.front === "0" ? a : prev.front + a,
      };
    }
  }
}

export function useMachine() {
  return useReducer(reducer, INITIAL_STATE);
}
