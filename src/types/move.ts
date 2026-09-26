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

interface MoveQuery<T extends Position | LegalPosition> {
    from: T;
    to: T;
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

interface LegalMoveRemark {
    result: "Legal Move";
    executed: true;
}

interface InvalidMoveRemark {
    result: "Invalid Move";
    remark?: string;
    executed: false;
}

interface IllegalMoveRemark {
    result: "Illegal Move";
    remark?: string;
    executed: false;
}

interface InvalidTurnRemark {
    result: "Invalid Turn";
    remark?: `Wait for ${PieceColor}'s turn!`;
    executed: false;
}

type MoveRemark = LegalMoveRemark | InvalidMoveRemark | IllegalMoveRemark | InvalidTurnRemark;

interface ValidMove {
    valid: false;
}

interface InvalidMove {
    valid: true;
    move: LegalPosition;
}

type IsValidMove = ValidMove | InvalidMove;

export type { Position, LegalPosition, MoveVec2, MoveConditionFunction, OnMove, Move, MoveQuery, MoveRecord, MoveRemark, ValidMove, InvalidMove, IsValidMove };