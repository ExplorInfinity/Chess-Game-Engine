import Piece from "../piece";
import type {Move, PieceColor} from "../types";

const BishopMoves: Move[] = [
    { vec: { dx:  1, dy:  1 }, isSliding: true, canAttack: true },
    { vec: { dx: -1, dy:  1 }, isSliding: true, canAttack: true },
    { vec: { dx: -1, dy: -1 }, isSliding: true, canAttack: true },
    { vec: { dx:  1, dy: -1 }, isSliding: true, canAttack: true }
];

class Bishop extends Piece
{
    static readonly moves = BishopMoves;

    constructor(color: PieceColor)
    {
        super(color, "bishop");
    }

    public getMoves(): readonly Move[]
    {
        return Bishop.moves;
    }
}

export { Bishop };