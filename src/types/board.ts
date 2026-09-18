import Piece from "../piece";
import {PieceLayoutCode} from "./piece";
import {Position} from "./move";

type PiecePositionMap = (Piece | null)[][];

type BoardLayout =
    (null | PieceLayoutCode)[][];

interface MoveChange {
    type: "move";
    piece: Piece;
    from: Position;
    to: Position;
}

interface PromotionChange {
    type: "promotion";
    piece: Piece;
    to: Position;
}

interface CaptureChange {
    type: "capture";
    piece: Piece;
    from: Position;
}

type BoardChange = MoveChange | PromotionChange | CaptureChange;

export type { PiecePositionMap, BoardLayout, MoveChange, PromotionChange, CaptureChange, BoardChange };