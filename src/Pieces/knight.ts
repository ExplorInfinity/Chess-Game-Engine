import Piece from "../piece";
import type {Move, PieceColor} from "../types";

const KnightMoves: Move[] = [
    { vec: { dx:  1, dy:  2 }, isSliding: false },
    { vec: { dx: -1, dy:  2 }, isSliding: false },
    { vec: { dx:  1, dy: -2 }, isSliding: false },
    { vec: { dx: -1, dy: -2 }, isSliding: false },
    { vec: { dx:  2, dy:  1 }, isSliding: false },
    { vec: { dx: -2, dy:  1 }, isSliding: false },
    { vec: { dx:  2, dy: -1 }, isSliding: false },
    { vec: { dx: -2, dy: -1 }, isSliding: false }
];

class Knight extends Piece
{
    moves = KnightMoves;

    constructor(color: PieceColor)
    {
        super(color, "knight");
    }
}

export { Knight };