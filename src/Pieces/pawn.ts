import {Game} from "../game";
import type {MoveConditionFunction, Move, Position, OnMove, MoveRecord} from "../types";
import {ChessRuleSet} from "../chessRuleSet";
import {getColorMultiplier} from "../utils/color";
import type {PieceColor} from "../types/piece";
import {Piece} from "./piece";

const DoubleStepMove: MoveConditionFunction = (game: Game, pos: Position) => {
    const pawn = game.board.getAtPos(pos);
    if (!pawn || pawn.name !== "pawn" || pawn.isMoved)
        return false;

    const multiplier = getColorMultiplier(pawn.color);
    return ChessRuleSet.isPathClear(game, pos, { x: pos.x, y: pos.y + 2 * multiplier });
}

const LeftCapture: MoveConditionFunction = (game: Game, pos: Position) => {
    const pawn = game.board.getAtPos(pos);
    if (!pawn || pawn.name !== "pawn" || pos.x === 0)
        return false;

    const y = pos.y + 1 * getColorMultiplier(pawn.color);
    const x = pos.x - 1;
    const capture = game.board.positionMap[y][x];
    return (capture !== null && capture.color !== pawn.color);
}

const RightCapture: MoveConditionFunction = (game: Game, pos: Position) => {
    const pawn = game.board.getAtPos(pos);
    if (!pawn || pawn.name !== "pawn" || pos.x === game.board.boardSize-1)
        return false;

    const y = pos.y + 1 * getColorMultiplier(pawn.color);
    const x = pos.x + 1;
    const capture = game.board.positionMap[y][x];
    return (capture !== null && capture.color !== pawn.color);
}

const LeftSideEnPassant: MoveConditionFunction = (game: Game, pos: Position) => {
    const pawn = game.board.getAtPos(pos);
    if (!pawn || pawn.name !== "pawn" || pos.x === 0)
        return false;

    const capturePawn = game.board.positionMap[pos.y][pos.x-1];
    if (!capturePawn || capturePawn.name !== "pawn" || capturePawn.color === pawn.color)
        return false;

    const lastMove = game.lastMoveRecord;
    return (lastMove !== null && lastMove.piece === capturePawn && Math.abs(lastMove.from.y - lastMove.to.y) === 2);
}

const RightSideEnPassant: MoveConditionFunction = (game: Game, pos: Position) => {
    const pawn = game.board.getAtPos(pos);
    if (!pawn || pawn.name !== "pawn" || pos.x === game.board.boardSize-1)
        return false;

    const capturePawn = game.board.positionMap[pos.y][pos.x+1];
    if (!capturePawn || capturePawn.name !== "pawn" || capturePawn.color === pawn.color)
        return false;

    const lastMove = game.lastMoveRecord;
    return (lastMove !== null && lastMove.piece === capturePawn && Math.abs(lastMove.from.y - lastMove.to.y) === 2);
}

const OnLeftSideEnPassant: OnMove = (game: Game, moveRecord: MoveRecord)=> {
    const { from } = moveRecord;
    const capturePawnPos: Position = { x: from.x - 1, y: from.y };
    game.makeCapture(capturePawnPos, moveRecord);
}

const OnRightSideEnPassant: OnMove = (game: Game, moveRecord: MoveRecord)=> {
    const { from } = moveRecord;
    const capturePawnPos: Position = { x: from.x + 1, y: from.y };
    game.makeCapture(capturePawnPos, moveRecord);
}

// todo: Handle pawn promotions
const HandlePromotion: OnMove = (game: Game, moveRecord: MoveRecord) => {

}

const PawnMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: false, canAttack: false, onMove: HandlePromotion },
    { vec: { dx:  0, dy:  2 }, isSliding: false, canAttack: false, condition: DoubleStepMove }, // Double Step Move

    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: true, condition: LeftCapture }, // Left Capture
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: true, condition: RightCapture }, // Right Capture

    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: false, condition: LeftSideEnPassant, onMove: OnLeftSideEnPassant }, // Left EnPassant
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: false, condition: RightSideEnPassant, onMove: OnRightSideEnPassant }, // Right EnPassant
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