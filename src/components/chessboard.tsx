import React from "react";
import Chesspiece from "./chesspiece";
// import { ChessBoard } from "@/utils/types";
import { fenToBoard } from "@/utils/fen";

const Chessboard: React.FC = () => {


    const pieces = fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").pieces

    return (
        <div className="relative bg-[url('/chessboard.svg')] w-[25rem] h-[25rem]">
            <div className="bg-[url('/coordinates.svg')] w-[25rem] h-[25rem] left-0 top-0 absolute select-none"></div>
            {/* Render chess pieces */}
            {pieces.map(({ type, color, rank, file, }) => {
                return (
                    <Chesspiece key={rank * 10 + file} color={color} type={type} rank={rank} file={file} />
                )
            })}
        </div>
    );
};

export default Chessboard;
