import type {Move, MoveConditionFunction, Position, OnMove, MoveRecord} from "../types";
import {Game} from "../game";
import {ChessRuleSet} from "../chessRuleSet";
import type {PieceColor} from "../types/piece";
import {Piece} from "./piece";

const ShortCastleCondition: MoveConditionFunction = (game: Game, pos: Position) => {
    const { board } = game;
    const king = board.getAtPos(pos);
    const rook = board.positionMap[pos.y][board.boardSize-1];

    if (!king || king.isMoved || king.name !== "king" ||
        !rook || rook.isMoved || rook.name !== "rook" ||
        rook.color !== king.color ||
        ChessRuleSet.isKingInCheck(game, king.color) ||
        !ChessRuleSet.canSeeEachOther(game, pos, { x: board.boardSize-1, y: pos.y }))
    {
        return false;
    }

    for(let dx = 1; dx <= 2; ++dx) {
        const isKingInCheck = game.evaluateAndBacktrack(
            { from: pos, to: { x: pos.x + dx, y: pos.y } },
            (game: Game): boolean => ChessRuleSet.isKingInCheck(game, king.color)
        );

        if (isKingInCheck) return false;
    }

    return true;
}

const LongCastleCondition: MoveConditionFunction = (game: Game, pos: Position) => {
    const { board } = game;
    const king = board.getAtPos(pos);
    const rook = board.positionMap[pos.y][0];

    if (!king || king.isMoved || king.name !== "king" ||
        !rook || rook.isMoved || rook.name !== "rook" ||
        rook.color !== king.color ||
        ChessRuleSet.isKingInCheck(game, king.color) ||
        !ChessRuleSet.canSeeEachOther(game, pos, { x: 0, y: pos.y }))
    {
        return false;
    }

    for(let dx = -1; dx >= -2; --dx) {
        const isKingInCheck = game.evaluateAndBacktrack(
            { from: pos, to: { x: pos.x + dx, y: pos.y } },
            (game: Game): boolean => ChessRuleSet.isKingInCheck(game, king.color)
        );

        if (isKingInCheck) return false;
    }

    return true;
}

const OnShortCastle: OnMove = (game: Game, moveRecord: MoveRecord) => {
    const { from: startKingPos, to: endKingPos } = moveRecord;

    game.makeMove({
        from: { x: game.board.boardSize-1, y: startKingPos.y },
        to:   { x: endKingPos.x-1, y: endKingPos.y }
    }, moveRecord);
}

const OnLongCastle: OnMove = (game: Game, moveRecord: MoveRecord) => {
    const { from: startKingPos, to: endKingPos } = moveRecord;

    game.makeMove({
        from: { x: 0, y: startKingPos.y },
        to:   { x: endKingPos.x+1, y: endKingPos.y }
    }, moveRecord);
}

const KingMoves: Move[] = [
    { vec: { dx:  0, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx:  0, dy: -1 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy:  0 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy:  0 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy:  1 }, isSliding: false, canAttack: true },
    { vec: { dx: -1, dy: -1 }, isSliding: false, canAttack: true },
    { vec: { dx:  1, dy: -1 }, isSliding: false, canAttack: true },

    { vec: { dx:  2, dy:  0 }, isSliding: false, canAttack: false, condition: ShortCastleCondition, onMove: OnShortCastle }, // Short Castle
    { vec: { dx: -2, dy:  0 }, isSliding: false, canAttack: false, condition: LongCastleCondition, onMove: OnLongCastle }, // Long Castle
];

class King extends Piece
{
    static readonly moves= KingMoves;

    constructor(color: PieceColor)
    {
        super(color, "king");
    }

    public getMoves(): readonly Move[]
    {
        return King.moves;
    }
}

export { King };