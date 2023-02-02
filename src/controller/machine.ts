import { useReducer } from "preact/hooks";

type Mode = "steady" | "input" | "decimal";

const initialState = {
  stack: [] as number[],
  front: "0",
  mode: "input" as Mode,
};

export type MachineState = typeof initialState;

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
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sqrt"
  | "cbrt"
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
  | "1";

function reducer(s: MachineState[], a: MachineAction): MachineState[] {
  const prev = s[s.length - 1];
  switch (a) {
    case "acos": {
      const num = Number(prev.front);
      if (num >= 1 || num <= -1) return s;
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.acos(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "atan": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.atan(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "asin": {
      const num = Number(prev.front);
      if (num >= 1 || num <= -1) return s;
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.asin(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "cos": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.cos(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "tan": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.tan(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "sin": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.sin(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "sqrt": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.sqrt(Math.abs(Number(prev.front))).toString(),
        mode: "steady",
      });
    }
    case "cbrt": {
      return s.concat({
        stack: prev.stack.slice(),
        front: Math.cbrt(Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "multiply": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (Number(prev.front) * top).toString(),
        mode: "steady",
      });
    }
    case "divide": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (top / Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "plus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (Number(prev.front) + top).toString(),
        mode: "steady",
      });
    }
    case "minus": {
      if (!prev.stack.length) return s;
      const top = prev.stack.pop() as number;
      return s.concat({
        stack: prev.stack.slice(),
        front: (top - Number(prev.front)).toString(),
        mode: "steady",
      });
    }
    case "push": {
      return s.concat({
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: "0",
        mode: "input",
      });
    }
    case "back": {
      if (s.length > 1) {
        return s.slice(0, s.length - 1);
      }
      return s;
    }
    case "clear": {
      return [initialState];
    }
    case "decimal": {
      if (prev.mode === "steady") {
        return s.concat({
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: "0.",
          mode: "input",
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
      });
    }
    case "pi": {
      return s.concat({
        stack: prev.stack.concat(Number.parseFloat(prev.front)),
        front: Math.PI.toString(),
        mode: "steady",
      });
    }
    default: {
      if (prev.mode === "steady") {
        return s.concat({
          stack: prev.stack.concat(Number.parseFloat(prev.front)),
          front: a,
          mode: "input",
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
  return useReducer(reducer, [initialState]);
}
