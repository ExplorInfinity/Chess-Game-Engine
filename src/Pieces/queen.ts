import Piece from "../piece";
import type {Move, PieceColor} from "../types";

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

    constructor(color: PieceColor)
    {
        super(color, "queen");
    }
}

export { Queen };