import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GameProvider } from "./context/game/game.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <GameProvider>
    <App />
  </GameProvider>,
);
