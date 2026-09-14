import {PiecePositionMap, BoardLayout, ColorPrefix, PieceCode, PieceColor, PieceLayoutCode} from "./types";
import {Bishop, King, Knight, Pawn, Queen, Rook} from "./Pieces";
import Piece from "./piece";

const BoardSize = 8;

const DefaultBoard: BoardLayout = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bK", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wK", "wR"],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"]
];

type PieceConstructor = new (color: PieceColor) => Piece;
const pieceClassMap: Record<PieceCode, PieceConstructor> = { "P": Pawn, "N": Knight, "B": Bishop, "R": Rook, "Q": Queen, "K": King };

class Board
{
    public readonly positionMap: PiecePositionMap = Array.from({ length: BoardSize }, () => Array(BoardSize).fill(null));

    public isValidLayout(layout: (string | null)[][])
    {
        // Checking size of board
        if (layout.length !== BoardSize)
            return false;

        for (let row of layout) {
            if (row.length !== BoardSize)
                return false;
        }

        // Checking if representation is correct
        for (let row = 0; row < BoardSize; ++row) {
            for (let col = 0; col < BoardSize; ++col) {
                const val = layout[row][col];
                if ( val !== null &&
                    (val.length !== 2 ||
                    !["w", "b"].includes(val[0]) ||
                    !["P", "N", "B", "R", "Q", "K"].includes(val[1]))
                ) return false;
            }
        }

        return true;
    }

    public applyLayout(layout: BoardLayout)
    {
        for (let row = 0; row < BoardSize; ++row) {
            for (let col = 0; col < BoardSize; ++col) {
                const val = layout[row][col];
                this.positionMap[row][col] =
                    val ? new pieceClassMap[val[1] as PieceCode](val[0] as ColorPrefix === "w" ? "white" : "black") : null;
            }
        }
    }

    public clearBoard()
    {
        for (let row = 0; row < BoardSize; ++row)
            for (let col = 0; col < BoardSize; ++col)
                this.positionMap[row][col] = null;
    }

}

export { Board, DefaultBoard };