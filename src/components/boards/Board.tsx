import { useEffect, useMemo, useRef } from "react";
import { useGame } from "../../context/game/game.hook";
import BoardLine from "../lines/Line";
import Pieces from "../Pieces/Pieces";
import Corners from "./../corners/Corners";
import { CheckWin } from "../../utils/game.utils";
import PlayersUI from "../player/player.ui";
import { PiecesData } from "../../context/game/game";

const Board = () => {
  const {
    turn,
    currentPlayer,
    setAllPiecesPlaced,
    pieces,
    setPieces,
    corners,
    setCorners,
    lines,
    setWin,
    playerStates,
    setPlayerStates,
    win: GameWon,
    setToast,
  } = useGame();

  useEffect(() => {
    let AllPlaced = true;

    pieces.forEach((p) => {
      if (p.corner !== 0 && !p.corner) {
        AllPlaced = false;
      }
    });
    setAllPiecesPlaced(AllPlaced);
  }, [pieces, setAllPiecesPlaced]);

  const TimeoutID = useRef(0);
  const PlayerLifeTimeoutID = useRef(0);

  useEffect(() => {
    if (GameWon.win || !corners.length || !lines.length || !pieces.length) return; // 🛑 STOP if already won
    clearTimeout(TimeoutID.current);

    const win = CheckWin(corners, lines);

    if (win.win) {
      if (win.who == "1") {
        setPlayerStates((s) => ({
          ...s,
          player1: {
            ...s.player2,
            score: s.player1.score + 1,
          },
        }));
      }

      if (win.who == "2") {
        setPlayerStates((s) => ({
          ...s,
          player2: {
            ...s.player2,
            score: s.player2.score + 1,
          },
        }));
      }

      setWin(win); // 🔒 lock
      setToast(`Player ${win.who} won 🎉`);

      TimeoutID.current = window.setTimeout(() => {
        setPieces(PiecesData);

        setCorners((Crns) =>
          Crns.map((C) => ({
            ...C,
            piece: null,
            player: null,
          })),
        );

        setAllPiecesPlaced(false);
        setWin({ win: false, who: undefined });
        setToast("");
      }, 4000);
    }

    return () => {};
  }, [corners, lines, GameWon.win, setToast]); // 👈 IMPORTANT deps

  useEffect(() => {
    clearTimeout(PlayerLifeTimeoutID.current);

    const TimeOut = () => {
      if (turn == currentPlayer) {
        PlayerLifeTimeoutID.current = setTimeout(() => {
          setPlayerStates((Ps) => {
            return {
              ...Ps,
              player1: {
                ...Ps.player1,
                lifes: Ps.player1.lifes - 1,
              },
            };
          });

          if (playerStates.player1.lifes - 1 == 0) {
            alert("All Lifes Gone");
          }

          if (turn == currentPlayer) {
            TimeOut();
          }
        }, 1000 * 15);
      }
    };
    TimeOut();

    return () => clearTimeout(PlayerLifeTimeoutID.current);
  }, [turn, currentPlayer]);

  const Render = useMemo(
    () => corners.length && lines.length && pieces.length,
    [corners, lines, pieces],
  );

  return (
    <div className="board">
      {Render && (
        <>
          <PlayersUI />
          <Pieces />
          <Corners />
          <BoardLine />
        </>
      )}
    </div>
  );
};

export default Board;
