import type {IsValidMove, LegalPosition, PieceColor, PiecePositionMap, Position} from "./types";
import {Board} from "./board";
import {Game, GameResultType} from "./game";

class ChessRuleSet
{
    private constructor() {}

    private static markAttackedSquares(attackedSquares: boolean[][], board: Board, pos: Position)
    {
        const piece = board.getAtPos(pos);
        if (!piece) return;

        const { positionMap } = board;

        for (const move of piece.getMoves()) {
            if (move.condition && !move.condition(piece, positionMap, pos))
                continue;

            const dx = move.vec.dx;
            const dy = move.vec.dy * (piece.color === "white" ? -1 : 1);
            let { x: currX, y: currY } = pos;

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

    private static getAttackedSquares(board: Board, color: PieceColor)
    {
        const { boardSize, positionMap } = board;
        const attackedSquares: boolean[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

        for (let y = 0; y < boardSize; ++y)
            for (let x = 0; x < boardSize; ++x)
                if (positionMap[y][x]?.color === color)
                    ChessRuleSet.markAttackedSquares(attackedSquares, board, { x, y });

        return attackedSquares;
    }

    public static checkStatus(board: Board): GameResultType
    {
        return GameResultType.PENDING;
    }

    public static isKingInCheck(board: Board, color: PieceColor): boolean
    {
        const enemyAttackedSquares = ChessRuleSet.getAttackedSquares(board, color === "white" ? "black" : "white");
        const kingPos = board.findPiece(color, "king");
        if (!kingPos)
            throw Error(`[Missing] Unable to find ${color}'s king!`);

        return enemyAttackedSquares[kingPos.y][kingPos.x];
    }

    public static isCheckmated(board: Board): boolean
    {
        return false;
    }

    public static isDrawByStalemate(board: Board): boolean
    {
        return false;
    }

    public static isDrawByThreeFoldRepetition(game: Game): boolean
    {
        return false;
    }

    public static isDrawByFiftyMoveRule(game: Game): boolean
    {
        return false;
    }

    public static isDrawByInsufficientMaterial(board: Board): boolean
    {
        return false;
    }

    public static getPseudoLegalMoves(positionMap: PiecePositionMap, pos: Position): LegalPosition[]
    {
        const piece = positionMap[pos.y][pos.x];
        if (!piece)
            throw Error(`Invalid try to get legal moves, no piece at position (${pos.x}, ${pos.y})!`);

        const pseudoLegalMoves: LegalPosition[] = [];

        for (const move of piece.getMoves()) {
            if (move.condition && !move.condition(piece, positionMap, pos))
                continue;

            const dx = move.vec.dx;
            const dy = move.vec.dy * (piece.color === "white" ? -1 : 1);
            let { x: currX, y: currY } = pos;

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

                pseudoLegalMoves.push({ x: currX, y: currY, onMove: move.specialAction ?? undefined });

            } while(move.isSliding && !positionMap[currY][currX]);
        }

        return pseudoLegalMoves;
    }

    public getLegalMoves(game: Game, pos: Position)
    {
        const pseudoLegalMoves = ChessRuleSet.getPseudoLegalMoves(game.getBoardPositionMap(), pos);
        // const legalMoves = pseudoLegalMoves.filter(move => );
    }

    public static validateMove(board: Board, from: Position, to: Position): IsValidMove
    {
        const pseudoLegalMoves = ChessRuleSet.getPseudoLegalMoves(board.positionMap, from);
        const foundMove = pseudoLegalMoves.find(move => move.x === to.x && move.y === to.y);

        if (!foundMove)
            return { valid: false };

        return { valid: true, onMove: foundMove.onMove };
    }

}

export {ChessRuleSet};