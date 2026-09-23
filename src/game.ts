import type {Position, MoveRecord, MoveQuery, MoveRemark} from "./types";
import type {PieceColor} from "./types/piece";
import {Board, BoardChange, BoardStringLayout} from "./board";
import {ChessRuleSet} from "./chessRuleSet";
import {Piece} from "./Pieces";

const enum GameStatus {NOT_STARTED, ACTIVE, WHITE_WON, BLACK_WON, DRAW}
const enum GameResult {PENDING = -1, ABORT, RESIGN, CHECKMATE, TIMEOUT, ABANDONED, STALEMATE, THREE_FOLD_DRAW, FIFTY_MOVE_RULE, DRAW_BY_AGREEMENT, DRAW_BY_INSUFFICIENT_MATERIAL}

const BOARD_SIZE = 8;

const DefaultBoard: BoardStringLayout = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
];

class Game
{
    private moveHistory: MoveRecord[] = [];

    private _currentTurnColor: PieceColor = "white";
    private _currentState: GameStatus = GameStatus.NOT_STARTED;
    private _currentResult: GameResult = GameResult.PENDING;

    public readonly board: Board = new Board(BOARD_SIZE);


    public get lastMoveRecord(): Readonly<MoveRecord | null>
        { return this.moveHistory ? this.moveHistory[this.moveHistory.length-1] : null; }

    public get currentTurnColor(): PieceColor   { return this._currentTurnColor; }
    public get currentState(): GameStatus       { return this._currentState; }
    public get currentResult(): GameResult      { return this._currentResult; }

    private changeCurrentTurn()
    {
        this._currentTurnColor = this._currentTurnColor === "white" ? "black" : "white";
    }

    public lastMovedPiece(): Piece | null
    {
        return this.lastMoveRecord ? this.board.getAtPos(this.lastMoveRecord.to) : null;
    }

    public setBoardLayout(layout: BoardStringLayout = DefaultBoard)
    {
        if (this.board.isValidLayout(layout)) {
            this.board.applyLayout(layout);
            return true;
        }

        return false;
    }

    public makeMove(moveQuery: MoveQuery, moveRecord: MoveRecord)
    {
        const { from, to } = moveQuery;
        const piece = this.board.getAtPos(from);
        if (!piece) {
            console.warn(`[Invalid Call] No piece at position (${from.x}, ${from.y}) at makeMove`);
            return;
        }

        moveRecord.changes.push({ type: "move", piece, from, to });

        const capture = this.board.getAtPos(to);
        if (capture) this.makeCapture(to, moveRecord);

        // Apply changes to board
        this.board.setAtPos(from, null);
        this.board.setAtPos(to, piece);

        return moveRecord;
    }

    public makeCapture(from: Position, moveRecord: MoveRecord)
    {
        const piece = this.board.getAtPos(from);
        if (!piece) {
            console.warn(`[Invalid Call] No piece at position (${from.x}, ${from.y}) at makeCapture`);
            return;
        }

        const change: BoardChange = { type: "capture", piece, from };
        moveRecord.changes.push(change);

        this.board.setAtPos(from, null);
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
                    this.board.setAtPos(change.to, null);
                    break;
                case "promotion":
                    this.board.setAtPos(change.to, null);
                    break;
                case "capture":
                    this.board.setAtPos(change.from, change.piece);
                    break;
            }
        }

        this.changeCurrentTurn();

        return true;
    }

    public evaluateAndBacktrack(moveQuery: MoveQuery, fn: (game: Game) => any) {
        const piece = this.board.getAtPos(moveQuery.from);
        if (!piece) return null;

        const moveRecord: MoveRecord = { piece, from: moveQuery.from, to: moveQuery.to, changes: [] };
        this.makeMove(moveQuery, moveRecord);

        const res = fn(this);
        this.undoMove();

        return res;
    }

    public simulateMoveAndCheckFor(moveQuery: MoveQuery, fn: (game: Game) => any)
    {
        const remark = this.playMove(moveQuery);
        if (!remark.executed)
            return null;

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

        if (piece?.color !== this._currentTurnColor)
            return { result: "Invalid Turn", remark: `Wait for ${this._currentTurnColor}'s turn!`, executed: false };

        const move = ChessRuleSet.validateMove(this, from, to);
        if (!move.valid) return { result: "Illegal Move", executed: false };

        // Create Move Record for add to history
        const changes: BoardChange[] = [];
        const moveRecord: MoveRecord = { from, to, piece, changes };
        this.moveHistory.push(moveRecord);

        // Apply changes to board
        this.makeMove(moveQuery, moveRecord);

        // Calling onMove function
        if(move.onMove) move.onMove(this, moveRecord);

        // Change Turn
        this.changeCurrentTurn();

        return { result: "Legal Move", executed: true };
    }

}

export { Game, GameStatus, GameResult, BOARD_SIZE, DefaultBoard };