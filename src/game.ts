import type {Position, MoveRecord, MoveQuery, MoveRemark, LegalPosition, StaticMethodsMatching} from "./types";
import type {PieceColor} from "./types/piece";
import {Board, BoardChange, BoardStringLayout} from "./board";
import {ChessRuleSet} from "./chessRuleSet";
import {Piece} from "./Pieces";
import {switchColor} from "./utils/color";

enum GameStatus {NOT_STARTED, ACTIVE, WHITE_WON, BLACK_WON, DRAW}
enum GameResult {PENDING = -1, ABORT, RESIGN, CHECKMATE, TIMEOUT, ABANDONED, STALEMATE, THREE_FOLD_REPETITION, FIFTY_MOVE_RULE, DRAW_BY_AGREEMENT, DRAW_BY_INSUFFICIENT_MATERIAL}

interface GameOutcome {
    status: GameStatus;
    result: GameResult;
}

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
    private _currentStatus: GameStatus = GameStatus.NOT_STARTED;
    private _currentResult: GameResult = GameResult.PENDING;

    public readonly board: Board = new Board(BOARD_SIZE);


    public get lastMoveRecord(): Readonly<MoveRecord | null>
        { return this.moveHistory ? this.moveHistory[this.moveHistory.length-1] : null; }

    public get currentTurnColor(): PieceColor   { return this._currentTurnColor; }
    public get currentStatus(): GameStatus       { return this._currentStatus; }
    public get currentResult(): GameResult      { return this._currentResult; }

    private changeCurrentTurn()
    {
        this._currentTurnColor = this._currentTurnColor === "white" ? "black" : "white";
    }

    private evaluateStatus(): GameOutcome
    {
        if (ChessRuleSet.isCheckmated(this)) {
            const winner = switchColor(this.currentTurnColor);

            return {
                status: (winner === "white" ? GameStatus.WHITE_WON : GameStatus.BLACK_WON),
                result: GameResult.CHECKMATE
            };
        }

        const drawConditions: [StaticMethodsMatching<typeof ChessRuleSet, (game: Game) => boolean>, GameResult][] =
        [
            [ChessRuleSet.isDrawByStalemate,                GameResult.STALEMATE],
            [ChessRuleSet.isDrawByThreeFoldRepetition,      GameResult.THREE_FOLD_REPETITION],
            [ChessRuleSet.isDrawByInsufficientMaterial,     GameResult.DRAW_BY_INSUFFICIENT_MATERIAL],
            [ChessRuleSet.isDrawByFiftyMoveRule,            GameResult.FIFTY_MOVE_RULE],
        ];

        for(const [condition, result] of drawConditions) {
            if(condition(this))
                return { status: GameStatus.DRAW, result };
        }

        return { status: GameStatus.ACTIVE, result: GameResult.PENDING };
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

    public makeMove(moveQuery: MoveQuery<Position>, moveRecord: MoveRecord)
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

    public undoMove({ changeTurn = true } = {})
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

        --moveRecord.piece.movesPlayed;
        if(changeTurn) this.changeCurrentTurn();

        return true;
    }

    public evaluateAndBacktrack(moveQuery: MoveQuery<LegalPosition>, fn: (game: Game) => any) {
        const piece = this.board.getAtPos(moveQuery.from);
        if (!piece) return null;

        this.playMove(moveQuery, { changeGameOutcome: false });

        try     { return fn(this); }
        finally { this.undoMove(); }
    }

    public playMoveWithValidation(moveQuery: MoveQuery<Position>): MoveRemark
    {
        const { from, to } = moveQuery;
        const piece = this.board.getAtPos(from);

        if (!piece)
            return { result: "Invalid Move", executed: false, remark: `No piece at position (${from.x},${from.y})` };

        if (piece?.color !== this._currentTurnColor)
            return { result: "Invalid Turn", remark: `Wait for ${this._currentTurnColor}'s turn!`, executed: false };

        const validation = ChessRuleSet.validateMove(this, from, to);
        if (!validation.valid) return { result: "Illegal Move", executed: false };

        this.playMove({ from, to: validation.move })

        return { result: "Legal Move", executed: true };
    }

    public playMove(moveQuery: MoveQuery<LegalPosition>, { changeGameOutcome = true } = {})
    {
        const { from, to } = moveQuery;
        const piece = this.board.getAtPos(from);
        if (!piece)
            throw Error(`[Invalid Call] No piece at position (${from.x}, ${from.y}) at playMoveWithoutValidation`);

        // Create Move Record for add to history
        const changes: BoardChange[] = [];
        const moveRecord: MoveRecord = { from, to, piece, changes };
        this.moveHistory.push(moveRecord);

        // Apply changes to board
        ++piece.movesPlayed;
        this.makeMove(moveQuery, moveRecord);

        // Calling onMove function
        if(to.onMove) to.onMove(this, moveRecord);

        // Change Turn
        this.changeCurrentTurn();

        // Set results of game
        if (changeGameOutcome) {
            const { status, result } = this.evaluateStatus();
            this._currentStatus = status;
            this._currentResult = result;
        }
    }

}

export { Game, GameStatus, GameResult, GameOutcome, BOARD_SIZE, DefaultBoard };