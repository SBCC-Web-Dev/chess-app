"use client"
import React, { useState, useRef } from "react";
import Chesspiece from "./chesspiece";
import { fenToBoard } from "@/utils/fen";

const Chessboard: React.FC = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const boardState = fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    const [chessPieces, setChessPieces] = useState(boardState.pieces)

    return (
        <div ref={boardRef} className="relative bg-[url('/chessboard.svg')] w-[25rem] h-[25rem]">
            <div className="bg-[url('/coordinates.svg')] w-[25rem] h-[25rem] left-0 top-0 absolute select-none"></div>
            {/* Render chess pieces */}
            {boardState.pieces.map(({ id, type, color, rank, file }) => {
                return (
                    <Chesspiece
                        key={id}
                        id={id}
                        color={color}
                        type={type}
                        rank={rank}
                        file={file}
                        boardDivRef={boardRef}
                        chessPieces={chessPieces}
                        setChessPieces={setChessPieces}
                    />
                );
            })}
        </div>
    );
};

export default Chessboard;
