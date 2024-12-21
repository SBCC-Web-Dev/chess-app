import { ChesspieceProps, ChessBoard } from "./types";

export const fenToBoard = (fen: string): ChessBoard => {
    const pieceMap: Record<string, ChesspieceProps["type"]> = {
        p: "p",
        n: "n",
        b: "b",
        r: "r",
        q: "q",
        k: "k",
    };

    const splitData = fen.split(" ")
    const rows = splitData[0].split("/"); // Get board representation from FEN
    const activeColor = splitData[1]
    const castlingRights = splitData[2]
    const enPassentTarget = splitData[3]
    const halfMoveClock = parseInt(splitData[4], 10)
    const fullMoveClock = parseInt(splitData[5], 10)
    const pieces: ChesspieceProps[] = [];

    rows.forEach((row, rankIndex) => {
        let file = 0;
        for (const char of row) {
            if (/\d/.test(char)) {
                file += parseInt(char, 10);
            } else {
                const color = char === char.toUpperCase() ? "w" : "b";
                const type = pieceMap[char.toLowerCase()];

                if (type) {
                    const tempPeice: ChesspieceProps = {
                        type: type,
                        rank: rankIndex + 1,
                        file: file + 1,
                        color: color,
                    }
                    pieces.push(tempPeice);
                }
                file++;
            }
        }
    });
    return {
        pieces,
        activeColor,
        castlingRights,
        enPassentTarget,
        halfMoveClock,
        fullMoveClock,
    };
};