import "./app.css";
import { Display } from "./components/display";
import { Keypad } from "./components/keypad";
import { MachineWrapper } from "./controller";

export function App() {
  return (
    <MachineWrapper>
      <main>
        <Display />
        <Keypad />
      </main>
    </MachineWrapper>
  );
}
