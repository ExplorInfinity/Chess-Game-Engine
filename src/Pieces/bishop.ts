import Piece from "../piece";
import type { Move } from "../types";

const BishopMoves: Move[] = [
    { vec: { dx:  1, dy:  1 }, isSliding: true },
    { vec: { dx: -1, dy:  1 }, isSliding: true },
    { vec: { dx: -1, dy: -1 }, isSliding: true },
    { vec: { dx:  1, dy: -1 }, isSliding: true }
];

class Bishop extends Piece
{
    moves = BishopMoves;
}

export default Bishop;