
export interface ChesspieceElementProps extends ChesspieceProps {
    boardDivRef: React.RefObject<HTMLDivElement | null>;
    chessPieces: ChesspieceProps[];
    setChessPieces: React.Dispatch<ChesspieceProps[]>
}

export interface ChesspieceProps {
    id: number
    color: "w" | "b",
    type: "p" | "n" | "b" | "r" | "q" | "k" | null,
    rank: number,
    file: number,
}

export interface ChesspieceCoord {
    rank: number,
    file: number
}


export interface ChessBoard {
    pieces: ChesspieceProps[],
    activeColor: string,
    castlingRights: string,
    enPassentTarget: string,
    halfMoveClock: number,
    fullMoveClock: number,
}