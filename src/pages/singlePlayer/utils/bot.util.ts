import type {
  Corner,
  Line,
  PieceProps,
  PlayerProp,
  PossibleMoves,
} from "../../../context/game/game";
import { CheckWin } from "../../../utils/game.utils";

interface LegalMove {
  piece: PieceProps;
  corner: Corner;
}

export type Difficulty = "easy" | "medium" | "hard";

/** All corners that are actually empty (no player owns them). */
export function getEmptyCorners(corners: Corner[]): Corner[] {
  return corners.filter((c) => c.player == null);
}

function isAllPlaced(pieces: PieceProps[]): boolean {
  return pieces.every((p) => typeof p.corner === "number");
}

/**
 * Every legal (piece, corner) pair for placement — any of a player's
 * not-yet-placed pieces paired with any empty corner.
 */
export function getLegalPlacements(
  corners: Corner[],
  pieces: PieceProps[],
  player: PlayerProp,
): LegalMove[] {
  const unplaced = pieces.filter(
    (p) => p.player === player && typeof p.corner !== "number",
  );
  const emptyCorners = getEmptyCorners(corners);

  const moves: LegalMove[] = [];
  unplaced.forEach((piece) => {
    emptyCorners.forEach((corner) => moves.push({ piece, corner }));
  });
  return moves;
}

/**
 * Every legal (piece, corner) pair for movement — each of a player's
 * pieces paired with each of its empty neighbouring corners.
 */
export function getLegalMovements(
  possibleMoves: PossibleMoves,
  corners: Corner[],
  playerPieces: PieceProps[],
): LegalMove[] {
  const moves: LegalMove[] = [];

  playerPieces.forEach((piece) => {
    const neighbours = possibleMoves[piece.corner!] ?? [];
    neighbours.forEach((n) => {
      const corner = corners[n];
      if (corner.player == null) {
        moves.push({ piece, corner });
      }
    });
  });

  return moves;
}

/**
 * All legal moves for `player` in the current position, respecting
 * the placement/movement phase AND the "can't win while placing"
 * rule — a move that would complete a line during placement is
 * filtered out here so the search never considers it a real option.
 */
function getLegalMoves(
  corners: Corner[],
  pieces: PieceProps[],
  lines: Line[],
  possibleMoves: PossibleMoves,
  player: PlayerProp,
): LegalMove[] {
  const placing = !isAllPlaced(pieces);

  const raw = placing
    ? getLegalPlacements(corners, pieces, player)
    : getLegalMovements(
        possibleMoves,
        corners,
        pieces.filter((p) => p.player === player),
      );

  if (!placing) return raw;

  return raw.filter((move) => {
    const { corners: hypothetical } = applyMove(corners, pieces, move, player);
    return !CheckWin(hypothetical, lines).win;
  });
}

/** Returns a NEW corners/pieces state with `move` applied for `player`. Never mutates inputs. */
export function applyMove(
  corners: Corner[],
  pieces: PieceProps[],
  move: LegalMove,
  player: PlayerProp,
) {
  const fromIndex = move.piece.corner;

  const newCorners = corners.map((c) => {
    if (c.index === move.corner.index) {
      return { ...c, piece: move.piece.index, player };
    }
    if (typeof fromIndex === "number" && c.index === fromIndex) {
      return { ...c, piece: null, player: null };
    }
    return c;
  });

  const newPieces = pieces.map((p) =>
    p.index === move.piece.index
      ? {
          ...p,
          corner: move?.corner?.index || undefined,
          player,
          position: move.corner.position,
        }
      : p,
  );

  return { corners: newCorners, pieces: newPieces };
}

/**
 * Scores a board position from `aiPlayer`'s perspective.
 * Positive = good for the AI, negative = good for the human.
 * Blocking the opponent's near-win is weighted slightly above
 * building the AI's own, since letting a win slip past is worse
 * than missing a chance to build one.
 */
function evaluate(
  corners: Corner[],
  lines: Line[],
  aiPlayer: PlayerProp,
  humanPlayer: PlayerProp,
): number {
  const { win, who } = CheckWin(corners, lines);
  if (win) return who === aiPlayer ? 1000 : -1000;

  let score = 0;

  lines.forEach((L) => {
    const trio = [
      corners[L.startPieceIndex],
      corners[L.middlePieceIndex],
      corners[L.endPieceIndex],
    ];
    const aiCount = trio.filter((c) => c.player === aiPlayer).length;
    const humanCount = trio.filter((c) => c.player === humanPlayer).length;
    const emptyCount = trio.filter((c) => c.player == null).length;

    // Mixed lines (both players present) can never be won by either side — ignore them.
    if (aiCount > 0 && humanCount > 0) return;

    if (aiCount === 2 && emptyCount === 1) score += 10;
    if (humanCount === 2 && emptyCount === 1) score -= 12;
    if (aiCount === 1 && emptyCount === 2) score += 1;
    if (humanCount === 1 && emptyCount === 2) score -= 1;
  });

  return score;
}

/**
 * Minimax with alpha-beta pruning. `isMaximizing` = true means it's
 * the AI's turn to move in this simulated branch; false means it's
 * the human's simulated turn. The AI assumes the human always plays
 * their best response, not a random one — that's what makes the
 * search meaningful rather than just "does this win against a fool."
 */
function minimax(
  corners: Corner[],
  pieces: PieceProps[],
  lines: Line[],
  possibleMoves: PossibleMoves,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: PlayerProp,
  humanPlayer: PlayerProp,
  alpha = -Infinity,
  beta = Infinity,
): number {
  if (CheckWin(corners, lines).win || depth === 0) {
    return evaluate(corners, lines, aiPlayer, humanPlayer);
  }

  const player = isMaximizing ? aiPlayer : humanPlayer;
  const moves = getLegalMoves(corners, pieces, lines, possibleMoves, player);

  if (moves.length === 0) {
    // Whoever is "on move" here with no legal moves is stuck.
    // Tune these numbers if your house rule treats this differently
    // (e.g. as an automatic loss rather than just "bad").
    return isMaximizing ? -900 : 900;
  }

  let best = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const { corners: nc, pieces: np } = applyMove(
      corners,
      pieces,
      move,
      player,
    );
    const score = minimax(
      nc,
      np,
      lines,
      possibleMoves,
      depth - 1,
      !isMaximizing,
      aiPlayer,
      humanPlayer,
      alpha,
      beta,
    );

    if (isMaximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) break; // prune — the rest of this branch can't change the outcome
  }

  return best;
}

/** Picks the move with the highest minimax score. Always plays its best option. */
function chooseBest(
  moves: LegalMove[],
  corners: Corner[],
  pieces: PieceProps[],
  lines: Line[],
  possibleMoves: PossibleMoves,
  aiPlayer: PlayerProp,
  humanPlayer: PlayerProp,
  depth: number,
): LegalMove | null {
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const { corners: nc, pieces: np } = applyMove(
      corners,
      pieces,
      move,
      aiPlayer,
    );
    const score = minimax(
      nc,
      np,
      lines,
      possibleMoves,
      depth - 1,
      false,
      aiPlayer,
      humanPlayer,
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/** Uniform-random choice among legal moves — the "easy" behaviour. */
export function chooseRandom(moves: LegalMove[]): LegalMove | null {
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Chooses a move according to difficulty:
 *  - easy: always random.
 *  - medium: mostly searches (shallow), sometimes plays random to stay beatable.
 *  - hard: always searches deep, always plays its best move.
 */
function decideMove(
  moves: LegalMove[],
  corners: Corner[],
  pieces: PieceProps[],
  lines: Line[],
  possibleMoves: PossibleMoves,
  aiPlayer: PlayerProp,
  humanPlayer: PlayerProp,
  difficulty: Difficulty,
): LegalMove | null {
  if (difficulty === "easy") {
    return chooseRandom(moves);
  }

  if (difficulty === "medium") {
    if (Math.random() < 0.35) return chooseRandom(moves);
    return chooseBest(
      moves,
      corners,
      pieces,
      lines,
      possibleMoves,
      aiPlayer,
      humanPlayer,
      2,
    );
  }

  return chooseBest(
    moves,
    corners,
    pieces,
    lines,
    possibleMoves,
    aiPlayer,
    humanPlayer,
    6,
  );
}

export function GetBotMove(
  corners: Corner[],
  pieces: PieceProps[],
  lines: Line[],
  possibleMoves: PossibleMoves,
  aiPlayer: PlayerProp,
  humanPlayer: PlayerProp,
  allPlaced: boolean,
  difficulty: Difficulty = "medium",
) {
  const legal = getLegalMoves(corners, pieces, lines, possibleMoves, aiPlayer);

  const chosen = decideMove(
    legal,
    corners,
    pieces,
    lines,
    possibleMoves,
    aiPlayer,
    humanPlayer,
    difficulty,
  );

  if (!chosen) return null; // genuine stalemate — no legal move at all

  return {
    move: allPlaced ? ("move" as const) : ("place" as const),
    MoveCorner: chosen.corner,
    MovePiece: chosen.piece,
  };
}
