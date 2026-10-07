import type {PieceName, PieceNameCode} from "../types/piece";
import {Piece, Bishop, King, Knight, Pawn, Queen, Rook} from "../pieces";

const PieceType = { pawn: 0, knight: 1, bishop: 2, rook: 3, queen: 4, king: 5 } as const satisfies Record<PieceName, number>;
const PieceMaterialValue  = { king: 0, pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9 } as const satisfies Record<PieceName, number>;

const PieceCode = { pawn: "P", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K" } as const satisfies Record<PieceName, PieceNameCode>;
const PieceClassMap = { P: Pawn, B: Bishop, N: Knight, R: Rook, Q: Queen, K: King } as const satisfies Record<PieceNameCode, typeof Piece>;

export { PieceType, PieceMaterialValue, PieceCode, PieceClassMap };