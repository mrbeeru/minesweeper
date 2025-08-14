import Board from "./Board";
import { Controls } from "./Controls";
import { Stats } from "./Stats";
import { useGameState } from "./useGameState";

export default function MinesweeperApp() {
  const {
    revealCell,
    toggleFlag,
    resetBoard,
    changeDifficulty,
    mines,
    board,
    setBoard,
    difficulty,
    flagsLeft,
    time,
    gameOver,
    won,
  } = useGameState({});

  return (
    <div className="min-h-screen min-w-full w-[max-content] flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-6">
      <div className="text-white items-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl font-semibold">Minesweeper</h1>
          <Controls
            difficulty={difficulty}
            changeDifficulty={changeDifficulty}
            resetBoard={resetBoard}
          />
        </div>
        <div className="flex flex-col bg-slate-800 py-4 px-2 gap-4 rounded-sm">
          <Stats
            flagsLeft={flagsLeft}
            time={time}
            gameOver={gameOver}
            won={won}
          />
          <Board
            board={board}
            setBoard={setBoard}
            mines={mines}
            revealCell={revealCell}
            toggleFlag={toggleFlag}
          />
        </div>
      </div>
    </div>
  );
}
