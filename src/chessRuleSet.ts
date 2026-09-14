import type {PiecePositionMap, Position} from "./types";
import {Board} from "./board";
import Game, {GameResultType} from "./game";


class ChessRuleSet
{
    private constructor() {}

    public static checkStatus(board: Board): GameResultType
    {
        return GameResultType.PENDING;
    }

    public static isKingInCheck(board: Board): boolean
    {
        return false;
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


    public static getLegalMoves(piecePosMap: PiecePositionMap , pos: Position): Position[]
    {
        const piece = piecePosMap[pos.y][pos.x];
        if (!piece)
            throw Error("Invalid try to get valid No Piece at Pos!");

        const legalMoves: Position[] = [];

        for (const move of piece.moves) {
            if (move.condition && !move.condition(piece, piecePosMap, pos))
                continue;

            const { dx, dy } = move.vec;
            let { x: currX, y: currY } = pos;

            while (true) {
                currX += dx; currY += dy;
                if (currX < 0 || currY < 0 || currX >= piecePosMap.length || currY >= piecePosMap[0].length)
                    break;

                legalMoves.push({ x: currX, y: currY });

                if (!move.isSliding || piecePosMap[currY][currX])
                    break;
            }
        }

        return legalMoves;
    }

}

export default ChessRuleSet;