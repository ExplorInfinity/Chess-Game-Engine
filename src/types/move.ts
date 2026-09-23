import type {BoardChange} from "./board";
import {PieceColor} from "./piece";
import {Game} from "../game";
import {Piece} from "../Pieces";

type MoveConditionFunction = (game: Game, pos: Position) => boolean;
type OnMove = (game: Game, moveRecord: MoveRecord) => void;

interface Position {
    x: number;
    y: number;
}

interface LegalPosition extends Position {
    onMove?: OnMove;
}

interface MoveVec2 {
    dx: number;
    dy: number;
}

interface MoveQuery {
    from: Position;
    to: Position;
}

interface MoveRecord {
    from: Position;
    to: Position;
    piece: Piece;
    changes: BoardChange[];
}

interface Move {
    vec: MoveVec2;
    isSliding: boolean;
    canAttack: boolean;
    condition?: MoveConditionFunction;
    onMove?: OnMove;
}

interface LegalMove {
    result: "Legal Move";
    executed: true;
}

interface InvalidMove {
    result: "Invalid Move";
    remark?: string;
    executed: false;
}

interface IllegalMove {
    result: "Illegal Move";
    remark?: string;
    executed: false;
}

interface InvalidTurn {
    result: "Invalid Turn";
    remark?: `Wait for ${PieceColor}'s turn!`;
    executed: false;
}

type MoveRemark = LegalMove | InvalidMove | IllegalMove | InvalidTurn;

interface IsValidMove {
    valid: boolean;
    onMove?: OnMove;
}

export type { Position, LegalPosition, MoveVec2, MoveConditionFunction, OnMove, Move, MoveQuery, MoveRecord, MoveRemark, IsValidMove };