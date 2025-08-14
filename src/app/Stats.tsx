type StatsProps = {
  flagsLeft: number;
  time: number;
  gameOver: boolean;
  won: boolean;
};

export function Stats({ flagsLeft, time, gameOver, won }: StatsProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-3xl">{getFace({ gameOver, won })}</span>
        <span>Mines: {flagsLeft}</span>
      </div>
      <span>Time: {time}</span>
    </div>
  );
}

function getFace({ gameOver, won }: { gameOver: boolean; won: boolean }) {
  if (won) return "🤩";
  if (gameOver) return "😵";
  return "🙂";
}
