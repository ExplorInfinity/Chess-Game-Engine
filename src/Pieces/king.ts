import Piece from "../piece";
import type {BoardState, Move, Position} from "../types";
import {MoveConditionFunction} from "../types/move";

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
    { vec: { dx:  0, dy:  1 }, isSliding: false },
    { vec: { dx:  0, dy: -1 }, isSliding: false },
    { vec: { dx:  1, dy:  0 }, isSliding: false },
    { vec: { dx: -1, dy:  0 }, isSliding: false },
    { vec: { dx:  1, dy:  1 }, isSliding: false },
    { vec: { dx: -1, dy:  1 }, isSliding: false },
    { vec: { dx: -1, dy: -1 }, isSliding: false },
    { vec: { dx:  1, dy: -1 }, isSliding: false },

    { vec: { dx:  2, dy:  0 }, isSliding: false, condition: ShortCastleCondition }, // Short Castle
    { vec: { dx: -2, dy:  0 }, isSliding: false, condition: LongCastleCondition }, // Long Castle
];

class King extends Piece
{
    moves = KingMoves;
}

export default King;