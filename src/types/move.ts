import type { PiecePositionMap } from "./board";
import Piece from "../piece";

type Position = {
    x: number;
    y: number;
}

type MoveVec2 = {
    dx: number;
    dy: number;
}

type MoveConditionFunction = (piece: Piece, board: PiecePositionMap, pos: Position) => boolean;

type Move = {
    vec: MoveVec2;
    isSliding: boolean;
    condition?: MoveConditionFunction;
    specialAction?: (game: any) => void; // Todo: Implement Game Handler Class
}

type MoveRecord = {
    from: Position;
    to: Position;
    piece: Piece;
    capturedPiece?: Piece;
    promotedPiece?: Piece;
}

export type { Position, MoveVec2, MoveConditionFunction, Move, MoveRecord };