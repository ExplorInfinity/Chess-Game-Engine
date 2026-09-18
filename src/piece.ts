import type {PieceColor, PieceName, Move} from './types';

abstract class Piece
{
    isMoved: boolean = false;

    protected constructor(
        public readonly color: PieceColor,
        public readonly name: PieceName
    ) {}

    abstract getMoves(): readonly Move[];
}

export default Piece;