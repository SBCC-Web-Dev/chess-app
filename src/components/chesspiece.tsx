"use client"
import { ChesspieceProps } from "@/utils/types";
import { useState } from "react";


const Chesspiece: React.FC<ChesspieceProps> = ({ color, type, rank: initialRank, file: initialFile }) => {
    const [rank, setRank] = useState(initialRank)
    const [file, setFile] = useState(initialFile)
    const [translation, setTranslation] = useState({ x: (initialFile - 1) * 100, y: (initialRank - 1) * 100 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ offsetX: number; offsetY: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (dragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setDragStart({ offsetX, offsetY });
        setDragging(true);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!dragging || !dragStart) return;

        const board = e.currentTarget.parentElement; // Reference to the chessboard
        if (!board) return;

        const rect = board.getBoundingClientRect();
        const x = ((e.clientX - rect.left - dragStart.offsetX) / rect.width) * 800;
        const y = ((e.clientY - rect.top - dragStart.offsetY) / rect.height) * 800;

        if (x < 0 || x > 700 || y < 0 || y > 700) { // if drag leaves board
            setTranslation({ x: (file - 1) * 100, y: (rank - 1) * 100 });
            setDragging(false);
            setDragStart(null);
        } else {
            setTranslation({ x, y });
        }
    };

    const handleMouseUp = () => {
        if (!dragging) return;

        setDragging(false);
        window.removeEventListener('mouseup', handleMouseUp);

        // Snap to the nearest square
        const snappedX = Math.round(translation.x / 100) * 100;
        const snappedY = Math.round(translation.y / 100) * 100;

        const newTranslation = {
            x: Math.max(0, Math.min(700, snappedX)), // Clamp within bounds
            y: Math.max(0, Math.min(700, snappedY)),
        };

        setTranslation(newTranslation);
        setRank(newTranslation.y / 100 + 1);
        setFile(newTranslation.x / 100 + 1);
        setDragStart(null);
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
        ></div>
    );
};

export default Chesspiece;
