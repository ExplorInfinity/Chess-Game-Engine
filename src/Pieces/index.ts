export { Piece } from './piece'
export { Pawn } from './pawn'
export { Knight } from './knight'
export { Bishop } from './bishop'
export { Rook } from './rook'
export { Queen } from './queen'
export { King } from './king'

export enum PieceType  { pawn = 0, knight = 1, bishop = 2, rook = 3, queen = 4, king = 5 }
export enum PieceValue { pawn = 1, knight = 3, bishop = 3, rook = 5, queen = 9, king = 0 }

export type { PieceColor, PieceName, PieceColorCode, PieceNameCode, PieceLayoutCode } from "../types/piece";