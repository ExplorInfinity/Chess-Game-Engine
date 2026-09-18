import Piece from "../piece";
import type {Move, PieceColor, MoveConditionFunction} from "../types";

// 'self' is implied for 'this' keyword here
const ShortCastleCondition: MoveConditionFunction = (self, board, pos) => {
    const rook = board[pos.y][board[0].length-1];
    return !(self.isMoved || rook?.name !== "rook" || rook?.isMoved);
}

const LongCastleCondition: MoveConditionFunction = (self, board, pos) => {
    const rook = board[pos.y][0];
    return !(self.isMoved || rook?.name !== "rook" || rook?.isMoved);
}


/* Todo (After game object is made)
    1. Check if path is clear between king and rook before castling
    2. Check if king will be in check if moved through that path before castling
    */

const KingMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx:  0, dy: -1 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy:  0 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy:  0 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy: -1 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy: -1 }, isSliding: false, canAttack: true },

    { vec: { dx:  2, dy:  0 }, isSliding: false, canAttack: false, condition: ShortCastleCondition }, // Short Castle
    { vec: { dx: -2, dy:  0 }, isSliding: false, canAttack: false, condition: LongCastleCondition }, // Long Castle
];

class King extends Piece
{
    static readonly moves= KingMoves;

    constructor(color: PieceColor)
    {
        super(color, "king");
    }

    public getMoves(): readonly Move[]
    {
        return King.moves;
    }
}

export { King };