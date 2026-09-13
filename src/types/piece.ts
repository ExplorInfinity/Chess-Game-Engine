import type { Move } from './move';

type PieceColors = "white" | "black";
type PieceNames = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

type PieceData = {
    color: PieceColors;
    name: PieceNames;
    isSliding: boolean;
    canJump: boolean;
    moves: Move[];
}

export type { PieceColors, PieceNames, PieceData };