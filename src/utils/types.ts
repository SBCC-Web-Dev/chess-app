export interface ChesspieceProps {
    color: "w" | "b",
    type: "p" | "n" | "b" | "r" | "q" | "k" | null,
    rank: number,
    file: number,
}

export interface ChessBoard {
    pieces: ChesspieceProps[],
    activeColor: string,
    castlingRights: string,
    enPassentTarget: string,
    halfMoveClock: number,
    fullMoveClock: number,
}