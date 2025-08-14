import type { Cell } from "./types";

type CellButtonProps = {
  cell: Cell;
  r: number;
  c: number;
  revealCell: (r: number, c: number) => void;
  toggleFlag: (r: number, c: number) => void;
};

export function CellButton({
  cell,
  r,
  c,
  revealCell,
  toggleFlag,
}: CellButtonProps) {
  return (
    <button
      onMouseDown={(e) => {
        if (e.button === 0) revealCell(r, c);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleFlag(r, c);
      }}
      className={`w-10 h-10 flex items-center justify-center select-none transition-all
        ${getCellBg(cell)}`}
    >
      {cell.revealed ? (
        cell.isMine ? (
          <MinedCell />
        ) : cell.adjacent > 0 ? (
          <NumberedCell cell={cell} />
        ) : (
          <EmptyCell />
        )
      ) : cell.flagged ? (
        <FlaggedCell />
      ) : (
        <EmptyCell />
      )}
    </button>
  );
}

function EmptyCell() {
  return <></>;
}

function FlaggedCell() {
  return <span className="text-xl">🚩</span>;
}

function MinedCell() {
  return <span className="text-xl">💣</span>;
}

function NumberedCell({ cell }: { cell: Cell }) {
  return (
    <span className={`font-extrabold text-3xl ${getCellNumberColor(cell)}`}>
      {cell.adjacent}
    </span>
  );
}

function getCellNumberColor(cell: Cell) {
  const colors: Record<number, string> = {
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-red-500",
    4: "text-purple-800",
    5: "text-red-900",
    6: "text-cyan-600",
    7: "text-black",
    8: "text-gray-500",
  };

  return colors[cell.adjacent] || "text-black";
}

function getCellBg(cell: Cell) {
  if (cell.revealed && cell.isGameOverMine) return "bg-red-400";
  if (cell.flagged && !cell.revealed) return "bg-yellow-500";

  return cell.revealed
    ? "bg-slate-200 text-slate-900"
    : "bg-slate-700 text-white hover:brightness-110";
}
