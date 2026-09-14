import {BoardLayout, Position, MoveRecord, PiecePositionMap} from "./types";
import Piece from "./piece";
import {Board, DefaultBoard} from "./board";

const enum GameStatus {NOT_STARTED, ACTIVE, WHITE_WON, BLACK_WON, DRAW}
const enum GameResultType {PENDING = -1, ABORT, RESIGN, CHECKMATE, TIMEOUT, ABANDONED, STALEMATE, THREE_FOLD_DRAW, FIFTY_MOVE_RULE, DRAW_BY_AGREEMENT, DRAW_BY_INSUFFICIENT_MATERIAL}

class Game
{
    private readonly board: Board = new Board();
    private moveHistory: MoveRecord[] = [];

    public readonly currentState: GameStatus = GameStatus.NOT_STARTED;

    public getBoardState(): Readonly<PiecePositionMap>
    {
        return this.board.positionMap;
    }

    public clearBoard()
    {
        this.board.clearBoard();
    }

    public setBoardLayout(layout: BoardLayout = DefaultBoard)
    {
        if (this.board.isValidLayout(layout)) {
            this.board.applyLayout(layout);
            return true;
        }

        return false;
    }

    public makeMove(piece: Piece, from: Position, to: Position)
    {

    }

    public undoMove()
    {

    }

}

export default Game;
export { GameStatus, GameResultType };