import type {PieceColor, PieceName} from "../types/piece";
import type {Move} from "../types";

abstract class Piece
{
    movesPlayed: number = 0;

    protected constructor(
        public readonly color: PieceColor,
        public readonly name: PieceName
    ) {}

    public get isMoved(): boolean { return this.movesPlayed !== 0; }

    abstract getMoves(): readonly Move[];
}

export { Piece };