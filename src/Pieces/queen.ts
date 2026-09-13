import Piece from "../piece";
import type { Move } from "../types";

const QueenMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: true },
    { vec: { dx:  0, dy: -1 }, isSliding: true },
    { vec: { dx:  1, dy:  0 }, isSliding: true },
    { vec: { dx: -1, dy:  0 }, isSliding: true },
    { vec: { dx:  1, dy:  1 }, isSliding: true },
    { vec: { dx: -1, dy:  1 }, isSliding: true },
    { vec: { dx: -1, dy: -1 }, isSliding: true },
    { vec: { dx:  1, dy: -1 }, isSliding: true }
];

class Queen extends Piece
{
    moves = QueenMoves;
}

export default Queen;