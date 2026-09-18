import {BoardLayout, Position, MoveRecord, MoveQuery, PieceColor, MoveRemark, BoardChange, PieceCode, PiecePositionMap} from "./types";
import {Board} from "./board";
import {ChessRuleSet} from "./chessRuleSet";

const enum GameStatus {NOT_STARTED, ACTIVE, WHITE_WON, BLACK_WON, DRAW}
const enum GameResultType {PENDING = -1, ABORT, RESIGN, CHECKMATE, TIMEOUT, ABANDONED, STALEMATE, THREE_FOLD_DRAW, FIFTY_MOVE_RULE, DRAW_BY_AGREEMENT, DRAW_BY_INSUFFICIENT_MATERIAL}

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

class Game
{
    private moveHistory: MoveRecord[] = [];
    private currentTurn: PieceColor = "white";

    public readonly board: Board = new Board(BoardSize);
    public readonly currentState: GameStatus = GameStatus.NOT_STARTED;
    public readonly currentResult: GameResultType = GameResultType.PENDING;

    public getBoardPositionMap()
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

    public makeMove(moveQuery: MoveQuery)
    {
        const piece = this.board.getAtPos(moveQuery.from);
        if (!piece)
            throw Error("[Fatal] Invalid call to makeMove!");

        const { from, to } = moveQuery;

        // Create Move Record for add to history
        const changes: BoardChange[] = [];
        const moveRecord: MoveRecord = { from, changes };
        this.moveHistory.push(moveRecord);

        changes.push({ type: "move", piece, from, to });

        const capture = this.board.getAtPos(to);
        if (capture) changes.push({ type: "capture", piece: capture, from: to });

        // Apply changes to board
        this.board.setAtPos(from, null);
        this.board.setAtPos(to, piece);

        return moveRecord;
    }

    public undoMove()
    {
        const moveRecord = this.moveHistory.pop();
        if (!moveRecord) return false;

        for (const change of moveRecord.changes)
        {
            switch (change.type)
            {
                case "move":
                    this.board.setAtPos(change.from, change.piece);
                    this.board.setAtPos(change.to, change.piece);
                    break;
                case "promotion":
                    this.board.setAtPos(change.to, null);
                    break;
                case "capture":
                    this.board.setAtPos(change.from, change.piece);
                    break;
            }
        }

        return true;
    }

    public simulateMoveAndCheckFor(move: MoveQuery, fn: (game: Game) => any)
    {
        this.makeMove(move);
        const res = fn(this);
        this.undoMove();
        return res;
    }

    public playMove(moveQuery: MoveQuery): MoveRemark
    {
        const { from, to } = moveQuery;
        const piece = this.board.getAtPos(from);

        if (!piece)
            return { result: "Invalid Move", executed: false, remark: `No piece at position (${from.x},${from.y})` };

        if (piece?.color !== this.currentTurn)
            return { result: "Invalid Turn", remark: `Wait for ${this.currentTurn}'s turn!`, executed: false };

        const move = ChessRuleSet.validateMove(this.board, from, to);
        if (!move.valid) return { result: "Illegal Move", executed: false };

        // Apply changes to board
        const moveRecord = this.makeMove(moveQuery);

        // Calling onMove function
        if(move.onMove) move.onMove(this.board, moveRecord);

        return { result: "Legal Move", executed: true };
    }

}

export { Game, GameStatus, GameResultType, BoardSize, DefaultBoard };