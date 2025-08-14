import React from "react";
import { CellButton } from "./Cell";
import type { Cell } from "./types";

type BoardProps = {
  board: Cell[][];
  setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  mines: number;
  revealCell: (r: number, c: number) => void;
  toggleFlag: (r: number, c: number) => void;
};

export default function Board({ board, revealCell, toggleFlag }: BoardProps) {
  return (
    <div
      className="flex justify-center"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="grid gap-0.5 rounded w-[max-content]"
        style={{
          gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <CellButton
              key={`${r}-${c}`}
              cell={cell}
              r={r}
              c={c}
              revealCell={revealCell}
              toggleFlag={toggleFlag}
            />
          ))
        )}
      </div>
    </div>
  );
}
