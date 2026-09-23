import type {PieceColor, PieceName} from "../types/piece";
import type {Move} from "../types";

abstract class Piece
{
    isMoved: boolean = false;

    protected constructor(
        public readonly color: PieceColor,
        public readonly name: PieceName
    ) {}

    abstract getMoves(): readonly Move[];
}

export { Piece };