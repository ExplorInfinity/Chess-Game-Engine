type PieceColor = "white" | "black";
type PieceName = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

type ColorPrefix = "w" | "b";
type PieceCode = "P" | "N" | "B" | "R" | "Q" | "K";
type PieceLayoutCode = `${ColorPrefix}${PieceCode}`;

export type { PieceColor, PieceName, ColorPrefix, PieceCode, PieceLayoutCode };