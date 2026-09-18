import type {IsValidMove, LegalPosition, PieceColor, PieceName, PiecePositionMap, Position} from "./types";
import {Board} from "./board";
import {Game, GameResult} from "./game";

// todo: shift this function to a utility file
function switchColor(color: PieceColor): PieceColor
{
    return color === "white" ? "black" : "white";
}

class ChessRuleSet
{
    private constructor() {}

    private static findPiece(game: Game, pieceColor: PieceColor, pieceName: PieceName): Position
    {
        const piecePos = game.board.findPiece(pieceColor, pieceName);
        if (!piecePos)
        {
            throw Error(`[Not Found] ${pieceColor} ${pieceName} is missing from board!`);
        }

        return piecePos;
    }

    private static markAttackedSquares(game: Game, piecePos: Position, attackedSquares: boolean[][]): void
    {
        const { board } = game;
        const { positionMap } = board;

        const piece = board.getAtPos(piecePos);
        if (!piece) return;

        for (const move of piece.getMoves()) {
            if (move.condition && !move.condition(game.board, piece, piecePos))
                continue;

            const dx = move.vec.dx;
            const dy = move.vec.dy * (piece.color === "white" ? -1 : 1);
            let { x: currX, y: currY } = piecePos;

            do {
                currX += dx; currY += dy;
                if (currX < 0 || currY < 0 ||
                    currX >= positionMap.length ||
                    currY >= positionMap[0].length ||
                    (!move.canAttack && positionMap[currY][currX]) ||
                    positionMap[currY][currX]?.color === piece.color)
                {
                    break;
                }

                attackedSquares[currY][currX] = true;

            } while(move.isSliding && !positionMap[currY][currX]);
        }
    }

    private static getAttackedSquaresByColor(game: Game, color: PieceColor): boolean[][]
    {
        const { board } = game;
        const { boardSize, positionMap } = board;

        const attackedSquares: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

        for (let y = 0; y < boardSize; ++y)
            for (let x = 0; x < boardSize; ++x)
                if (positionMap[y][x]?.color === color)
                    ChessRuleSet.markAttackedSquares(game, { x, y }, attackedSquares);

        return attackedSquares;
    }

    private static getPseudoLegalMoves(board: Board, pos: Position): LegalPosition[]
    {
        const piece = board.getAtPos(pos);
        if (!piece)
            throw Error(`Invalid try to get legal moves, no piece at position (${pos.x}, ${pos.y})!`);

        const pseudoLegalMoves: LegalPosition[] = [];
        const { boardSize, positionMap: piecePositionMap } = board;

        for (const move of piece.getMoves()) {
            if (move.condition && !move.condition(board, piece, pos))
                continue;

            const dx = move.vec.dx;
            const dy = move.vec.dy * (piece.color === "white" ? -1 : 1);
            let { x: currX, y: currY } = pos;

            do {
                currX += dx; currY += dy;
                if (currX < 0 || currY < 0 || currX >= boardSize || currY >= boardSize ||
                    (!move.canAttack && piecePositionMap[currY][currX]) ||
                    piecePositionMap[currY][currX]?.color === piece.color)
                {
                    break;
                }

                pseudoLegalMoves.push({ x: currX, y: currY, onMove: move.specialAction ?? undefined });

            } while(move.isSliding && !piecePositionMap[currY][currX]);
        }

        return pseudoLegalMoves;
    }

    public static checkStatus(game: Game): GameResult
    {
        return GameResult.PENDING;
    }

    public static isKingInCheck(game: Game, color: PieceColor): boolean
    {
        const kingPos = ChessRuleSet.findPiece(game, color, "king");
        const enemyAttackedSquares = ChessRuleSet.getAttackedSquaresByColor(game, switchColor(color));

        return enemyAttackedSquares[kingPos.y][kingPos.x];
    }

    public static isCheckmated(game: Game): boolean
    {
        return ChessRuleSet.isKingInCheck(game, game.currentTurnColor) && !ChessRuleSet.hasPlayerAnyLegalMove(game);
    }

    public static isDrawByStalemate(game: Game): boolean
    {
        return !ChessRuleSet.isKingInCheck(game, game.currentTurnColor) && !ChessRuleSet.hasPlayerAnyLegalMove(game);
    }

    public static isDrawByThreeFoldRepetition(game: Game): boolean
    {
        return false;
    }

    public static isDrawByFiftyMoveRule(game: Game): boolean
    {
        return false;
    }

    public static isDrawByInsufficientMaterial(game: Game): boolean
    {
        return false;
    }

    public static getLegalMoves(game: Game, piecePos: Position): LegalPosition[]
    {
        const pseudoLegalMoves = ChessRuleSet.getPseudoLegalMoves(game.board, piecePos);

        const { currentTurnColor } = game;
        return pseudoLegalMoves.filter(move => {
            const moveRecord = game.makeMove({ from: piecePos, to: move });
            if (move.onMove) move.onMove(game.board, moveRecord);

            const isKingInCheck = ChessRuleSet.isKingInCheck(game, currentTurnColor);
            game.undoMove();

            return !isKingInCheck;
        });
    }

    public static hasPlayerAnyLegalMove(game: Game): boolean
    {
        const { board, currentTurnColor: color } = game;
        const { boardSize } = board;

        for (let y = 0; y < boardSize; ++y)
            for (let x = 0; x < boardSize; ++x)
                if (board.positionMap[y][x]?.color === color && ChessRuleSet.getLegalMoves(game, { x, y }).length > 0)
                    return true;

        return false;
    }

    public static validateMove(game: Game, from: Position, to: Position): IsValidMove
    {
        const legalMoves = ChessRuleSet.getLegalMoves(game, from);
        const foundMove = legalMoves.find(move => move.x === to.x && move.y === to.y);

        return { valid: foundMove !== undefined, onMove: foundMove?.onMove };
    }

}

export { ChessRuleSet };