import type { BoardState, PieceColors, PieceNames, Move, Position } from './types';

abstract class Piece
{
    abstract moves: Move[];

    isMoved: boolean = false;

    constructor(
        public readonly color: PieceColors,
        public readonly name: PieceNames
    ) {}

    getValidMoves(board: BoardState , pos: Position): Position[] {
        const validMoves: Position[] = [];

        for (const move of this.moves) {
            if (move.condition && !move.condition(this, board, pos))
                continue;

            const { dx, dy } = move.vec;
            let { x: currX, y: currY } = pos;

            while (true) {
                currX += dx; currY += dy;
                if (currX < 0 || currY < 0 || currX >= board.length || currY >= board[0].length)
                    break;

                validMoves.push({ x: currX, y: currY });

                if (!move.isSliding || board[currY][currX])
                    break;
            }
        }

        return validMoves;
    }
}

export default Piece;