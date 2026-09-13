import Piece from "../piece";
import type {MoveConditionFunction, Move} from "../types";

// 'self' is implied for 'this' keyword here
const LeftSideEnPassant: MoveConditionFunction = (self, board, pos) => {
    return !(pos.y === 0 || board[pos.y][pos.x-1]?.name !== "pawn");
}

const RightSideEnPassant: MoveConditionFunction = (self, board, pos) => {
    return true;
}

const DoubleStepMove: MoveConditionFunction = (self, board, pos) => {
    return !(self.isMoved || board[pos.y+1][pos.x] !== null || board[pos.y+2][pos.x] !== null)
}


/* Todo (After game object is made)
    1. Add En Passant
    */

const PawnMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: false },
    { vec: { dx:  0, dy:  2 }, isSliding: false, condition: DoubleStepMove }, // Double Step Move

    { vec: { dx: -1, dy:  1 }, isSliding: false, condition: RightSideEnPassant }, // Left EnPassant
    { vec: { dx:  1, dy:  1 }, isSliding: false, condition: LeftSideEnPassant }, // Right EnPassant
];

class Pawn extends Piece
{
    moves = PawnMoves;
}

export default Pawn;