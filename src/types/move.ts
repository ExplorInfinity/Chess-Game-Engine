import type { BoardState } from "./board";

type Position = {
    x: number;
    y: number;
}

type MoveVec2 = {
    dx: number;
    dy: number;
}

type Move = {
    vec: MoveVec2;
    isSliding: boolean;
    condition: (board: BoardState, pos: Position) => boolean;
}

export type { Position, MoveVec2, Move };