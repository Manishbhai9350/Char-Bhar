import type { Corner, PieceProps, PlayerProp, PossibleMoves } from "../../../context/game/game";

interface LegalMove {
  piece: PieceProps;
  corner: Corner;
}

/** All corners that are actually empty (no player owns them). */
export function getEmptyCorners(corners: Corner[]): Corner[] {
  return corners.filter((c) => c.player == null);
}

/**
 * Every legal (piece, corner) pair for placement — any of the AI's
 * not-yet-placed pieces paired with any empty corner.
 */
export function getLegalPlacements(corners: Corner[], pieces: PieceProps[], aiPlayer: PlayerProp): LegalMove[] {
  const unplaced = pieces.filter(
    (p) => p.player === aiPlayer && (p.corner == null || typeof p.corner !== "number"),
  );
  const emptyCorners = getEmptyCorners(corners);

  const moves: LegalMove[] = [];
  unplaced.forEach((piece) => {
    emptyCorners.forEach((corner) => moves.push({ piece, corner }));
  });
  return moves;
}

/**
 * Every legal (piece, corner) pair for movement — each AI piece
 * paired with each of its empty neighbouring corners.
 */
export function getLegalMovements(
  possibleMoves: PossibleMoves,
  corners: Corner[],
  aiPieces: PieceProps[],
): LegalMove[] {
  const moves: LegalMove[] = [];

  aiPieces.forEach((piece) => {
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

/** Chooser strategy — swap this out per difficulty later. */
export function chooseRandom(moves: LegalMove[]): LegalMove | null {
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function GetBotMove(
  corners: Corner[],
  pieces: PieceProps[],
  possibleMoves: PossibleMoves,
  aiPlayer: PlayerProp,
  allPlaced: boolean,
) {
  const aiPieces = pieces.filter((p) => p.player === aiPlayer);

  if (!allPlaced) {
    const legal = getLegalPlacements(corners, pieces, aiPlayer);
    const chosen = chooseRandom(legal);

    if (!chosen) return null; // no unplaced pieces or no empty corners — shouldn't happen mid-placement

    return { move: "place" as const, MoveCorner: chosen.corner, MovePiece: chosen.piece };
  }

  const legal = getLegalMovements(possibleMoves, corners, aiPieces);
  const chosen = chooseRandom(legal);

  if (!chosen) return null; // genuine stalemate — AI has no legal move at all

  return { move: "move" as const, MoveCorner: chosen.corner, MovePiece: chosen.piece };
}