import { useContext } from "react";
import { GameContext } from "./game";

export const useGame = () => {
  return useContext(GameContext);
};
