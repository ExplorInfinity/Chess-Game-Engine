import Piece from "../piece";
import type { Move } from "../types";

const RookMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: true },
    { vec: { dx:  0, dy: -1 }, isSliding: true },
    { vec: { dx:  1, dy:  0 }, isSliding: true },
    { vec: { dx: -1, dy:  0 }, isSliding: true }
];

class Rook extends Piece
{
    moves = RookMoves;
}

export default Rook;