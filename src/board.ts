import {PiecePositionMap, BoardLayout, ColorPrefix, PieceCode, PieceColor, Position, PieceName} from "./types";
import {Bishop, King, Knight, Pawn, Queen, Rook} from "./Pieces";
import Piece from "./piece";

type PieceConstructor = new (color: PieceColor) => Piece;
const pieceClassMap: Record<PieceCode, PieceConstructor> = { "P": Pawn, "N": Knight, "B": Bishop, "R": Rook, "Q": Queen, "K": King };

class Board
{
    public readonly positionMap: PiecePositionMap;

    constructor(
        public readonly boardSize: number
    ) {
        this.positionMap = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
    }

    public isValidLayout(layout: (string | null)[][])
    {
        // Checking size of board
        if (layout.length !== this.boardSize)
            return false;

        for (let row of layout) {
            if (row.length !== this.boardSize)
                return false;
        }

        // Checking if representation is correct
        for (let row = 0; row < this.boardSize; ++row) {
            for (let col = 0; col < this.boardSize; ++col) {
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
        for (let row = 0; row < this.boardSize; ++row) {
            for (let col = 0; col < this.boardSize; ++col) {
                const val = layout[row][col];
                this.positionMap[row][col] =
                    val ? new pieceClassMap[val[1] as PieceCode](val[0] as ColorPrefix === "w" ? "white" : "black") : null;
            }
        }
    }

    public clearBoard()
    {
        for (let row = 0; row < this.boardSize; ++row)
            for (let col = 0; col < this.boardSize; ++col)
                this.positionMap[row][col] = null;
    }

    public setAtPos(pos: Position, piece: Piece | null)
    {
        this.positionMap[pos.y][pos.x] = piece;
    }

    public getAtPos(pos: Position)
    {
        return this.positionMap[pos.y][pos.x];
    }

    public findPiece(color: PieceColor, name: PieceName): Position | null
    {
        for (let y = 0; y < this.boardSize; ++y)
            for (let x = 0; x < this.boardSize; ++x)
                if (this.positionMap[y][x]?.color === color && this.positionMap[y][x]?.name === name)
                    return { x, y };

        return null;
    }
}

export { Board };