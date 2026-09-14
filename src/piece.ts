import type {PieceColor, PieceName, Move} from './types';

abstract class Piece
{
    abstract moves: Move[];

    isMoved: boolean = false;

    protected constructor(
        public readonly color: PieceColor,
        public readonly name: PieceName
    ) {}
}

export default Piece;