"use client"
import { ChesspieceProps, ChesspieceCoord, ChesspieceElementProps } from "@/utils/types";
import { useState, useEffect, useCallback } from "react";

const Chesspiece: React.FC<ChesspieceElementProps> = ({
    id,
    color,
    type,
    rank: initialRank,
    file: initialFile,
    boardDivRef,
    chessPieces,
    setChessPieces,
    // isLegal,
}) => {
    const [rank, setRank] = useState(initialRank);
    const [file, setFile] = useState(initialFile);
    const [translation, setTranslation] = useState({ x: (initialFile - 1) * 100, y: (8 - initialRank) * 100 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ offsetX: number; offsetY: number } | null>(null);
    
    const getIndexOfPieceAt = useCallback((coord: ChesspieceCoord) => {
        const pieceIndex = chessPieces.findIndex((chessProps: ChesspieceProps) => {
            return chessProps.rank == coord.rank && chessProps.file == coord.file;
        });
        return pieceIndex;
    }, [chessPieces]);

    const isMoveValid = useCallback((prevCoord: ChesspieceCoord, newCoord: ChesspieceCoord) => {
        
        const prevRank = prevCoord.rank;
        const prevFile = prevCoord.file;
        const newRank = newCoord.rank;
        const newFile = newCoord.file;
    
        if (type === "p") {
            // TODO: Check to see if pawn is pinned
            if (color === "w") {
                console.log("white pawn move")
                console.log(prevRank, prevFile, newRank, newFile)
                if (prevFile === newFile && newRank === prevRank + 1) {
                    console.log("pawn moved one forward")
                    return true
                }; // Move forward
                if (prevFile === newFile && prevRank === 2 && newRank === 4) {
                    // TODO: check if piece is in front like `getIndexOfPieceAt({rank: rank, file: newFile}) != -1`
                    return true
                }; // Initial double move
                if (Math.abs(prevFile - newFile) === 1 && newRank === prevRank + 1) return true; // Capture
            } else {
                if (prevFile === newFile && newRank === prevRank - 1) return true; // Move forward
                if (prevFile === newFile && prevRank === 7 && newRank === 5) return true; // Initial double move
                if (Math.abs(prevFile - newFile) === 1 && newRank === prevRank - 1) return true; // Capture
            }
        } else if (type === "n") {
            const rankDiff = Math.abs(newRank - prevRank);
            const fileDiff = Math.abs(newFile - prevFile);
            if ((rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2)) {
            return true;
            }
        } else if (type === "b") {
            const rankDiff = Math.abs(newRank - prevRank);
            const fileDiff = Math.abs(newFile - prevFile);
            if (rankDiff === fileDiff) {
                return true;
            } 
        } else if (type === "r") {
            const rankDiff = Math.abs(newRank - prevRank);
            const fileDiff = Math.abs(newFile - prevFile);
            if (rankDiff === 0 || fileDiff === 0) {
                return true;
            }
        } else if (type === "q") {
            const rankDiff = Math.abs(newRank - prevRank);
            const fileDiff = Math.abs(newFile - prevFile);
            if (rankDiff === 0 || fileDiff === 0 || rankDiff === fileDiff) {
                return true;
            } 
        } else if (type === "k") {
            const rankDiff = Math.abs(newRank - prevRank);
            const fileDiff = Math.abs(newFile - prevFile);
            if ((rankDiff === 1 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 0) || (rankDiff === 0 && fileDiff === 1)) {
                return true;
            }
        }
        return false;
    }, [color, type]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !dragStart) return;

            const board = boardDivRef.current; // Use the board ref
            if (!board) return;

            const rect = board.getBoundingClientRect();
            const x = ((e.clientX - rect.left - dragStart.offsetX) / rect.width) * 800;
            const y = ((e.clientY - rect.top - dragStart.offsetY) / rect.height) * 800;

            if (x < -50 || x > 750 || y < -50 || y > 750) { // if drag leaves board
                setTranslation({ x: (file - 1) * 100, y: (8 - rank) * 100 });
                setDragging(false);
                setDragStart(null);
            } else {
                setTranslation({ x, y });
            }
        };

        const handleMouseUp = () => {
            if (!dragging) return;

            setDragging(false);

            // Snap to the nearest square
            const snappedX = Math.round(translation.x / 100) * 100;
            const snappedY = Math.round(translation.y / 100) * 100;

            const newTranslation = {
                x: Math.max(0, Math.min(700, snappedX)), // Clamp within bounds
                y: Math.max(0, Math.min(700, snappedY)),
            };
            console.log(newTranslation)
            let newRank = newTranslation.y / 100 + 1;
            newRank = 9 - newRank;
            const newFile = newTranslation.x / 100 + 1;

            console.log("piece:", type);
            console.log("rank:", rank);
            console.log("file:", "abcdefgh".charAt(file - 1))
            console.log("to")
            console.log("rank:", newRank);
            console.log("file:", "abcdefgh".charAt(newFile - 1))

            if (isMoveValid({rank: rank, file: file}, {rank: newRank, file: newFile})) {
                console.log("move is valid")
                // removes the chess
                const newChessPieces = chessPieces.filter((chessProps) => {
                    return chessProps.rank != rank || chessProps.file != file;
                });
                newChessPieces.push({
                    id: id,
                    color: color,
                    type: type,
                    rank: newRank,
                    file: newFile
                })
                setChessPieces([
                    ...newChessPieces,
                ])
                setTranslation(newTranslation);
                setRank(newRank);
                setFile(newFile);
            } else {
                console.log("move is invalid")
                setTranslation({ x: (file - 1) * 100, y: (8 - rank) * 100 });
            }
            setDragging(false);
            setDragStart(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, dragStart, translation, file, rank, boardDivRef, isMoveValid, getIndexOfPieceAt, chessPieces, setChessPieces, id, color, type]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (dragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setDragStart({ offsetX, offsetY });
        setDragging(true);
    };

    return (
        <div
            className="absolute w-[12.5%] h-[12.5%] bg-no-repeat bg-contain cursor-grab touch-none"
            style={{
                backgroundImage: `url('/${color + type}.svg')`,
                transform: `translate(${translation.x}%, ${translation.y}%)`,
                zIndex: dragging ? 10 : 1
            }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => e.preventDefault()}
        ></div>
    );
};

export default Chesspiece;