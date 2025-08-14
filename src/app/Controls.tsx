import { DIFFICULTIES } from "./constants";

type ControlsProps = {
  difficulty: keyof typeof DIFFICULTIES;
  changeDifficulty: (diff: keyof typeof DIFFICULTIES) => void;
  resetBoard: () => void;
};

export function Controls({
  difficulty,
  changeDifficulty,
  resetBoard,
}: ControlsProps) {
  return (
    <div className="flex justify-between items-center mb-4 ">
      <div className="flex items-center gap-2">
        <label>Difficulty:</label>
        <select
          className="px-2 py-1 rounded bg-slate-700 text-white"
          value={difficulty}
          onChange={(e) =>
            changeDifficulty(e.target.value as keyof typeof DIFFICULTIES)
          }
        >
          {Object.keys(DIFFICULTIES).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          className="ml-2 px-3 py-1 bg-emerald-500 text-white rounded shadow hover:brightness-90"
          onClick={resetBoard}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
