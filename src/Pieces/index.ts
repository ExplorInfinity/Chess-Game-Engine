export { Piece } from './piece'
export { Pawn } from './pawn'
export { Knight } from './knight'
export { Bishop } from './bishop'
export { Rook } from './rook'
export { Queen } from './queen'
export { King } from './king'

export enum PieceType  { Pawn = 0, Knight = 1, Bishop = 2, Rook = 3, Queen = 4, King = 5 }
export enum PieceValue { Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9, King = 0 }

export type { PieceColor, PieceName, PieceColorCode, PieceNameCode, PieceLayoutCode } from "../types/piece";