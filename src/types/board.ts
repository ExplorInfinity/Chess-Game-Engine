import Piece from "../piece";
import {PieceLayoutCode} from "./piece";

type PiecePositionMap = (Piece | null)[][];

type BoardLayout =
    (null | PieceLayoutCode)[][];

export type { PiecePositionMap, BoardLayout };