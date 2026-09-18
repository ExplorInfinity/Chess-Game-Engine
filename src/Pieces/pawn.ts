import Piece from "../piece";
import type {MoveConditionFunction, Move, PieceColor} from "../types";

// 'self' is implied for 'this' keyword here
const LeftCapture: MoveConditionFunction = (self, board, pos) => {
    return true;
}

const RightCapture: MoveConditionFunction = (self, board, pos) => {
    return true;
}

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
    1. Add Sideways Capture
    2. Add En Passant
    */

const PawnMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: false, canAttack: false },
    { vec: { dx:  0, dy:  2 }, isSliding: false, canAttack: false, condition: DoubleStepMove }, // Double Step Move

    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: true, condition: LeftCapture }, // Left Capture
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: true, condition: RightCapture }, // Right Capture

    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: false, condition: LeftSideEnPassant }, // Left EnPassant
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: false, condition: RightSideEnPassant }, // Right EnPassant
];

class Pawn extends Piece
{
    static readonly moves = PawnMoves;

    constructor(color: PieceColor)
    {
        super(color, "pawn");
    }

    public getMoves(): readonly Move[]
    {
        return Pawn.moves;
    }
}

export { Pawn };