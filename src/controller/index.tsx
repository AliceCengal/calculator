import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { MachineAction, MachineState, useMachine } from "./machine";

export type { MachineAction, MachineState } from "./machine";

const CTX_S = createContext<MachineState>(null as any);
const CTX_D = createContext<(a: MachineAction) => void>((a) => {});

export function MachineWrapper({ children }: { children: ComponentChildren }) {
  const [state, dispatch] = useMachine();
  return (
    <CTX_S.Provider value={state[state.length - 1]}>
      <CTX_D.Provider value={dispatch}>{children}</CTX_D.Provider>
    </CTX_S.Provider>
  );
}

export function useCalcState() {
  return useContext(CTX_S);
}

export function useCalcDispatch() {
  return useContext(CTX_D);
}
