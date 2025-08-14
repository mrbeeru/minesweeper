import { useEffect, useRef, useState } from "react";
import type { Cell } from "./types";
import { DIFFICULTIES } from "./constants";

type GameStateProps = {};

export function useGameState({}: GameStateProps) {
  const [difficulty, setDifficulty] =
    useState<keyof typeof DIFFICULTIES>("Easy");
  const { rows, cols, mines } = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState<Cell[][]>(makeEmptyBoard(rows, cols));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flagsLeft, setFlagsLeft] = useState<number>(mines);
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    resetBoard();
  }, [difficulty]);

  // Start / stop timer
  useEffect(() => {
    if (!isFirstClick && !gameOver && !won) {
      timerRef.current = window.setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isFirstClick, gameOver, won]);

  function revealCell(r: number, c: number) {
    if (gameOver || won) return;
    let newBoard = cloneBoard(board);

    const cell = newBoard[r][c];
    if (cell.revealed || cell.flagged) return;

    // on first click, place mines ensuring first click safe area
    if (isFirstClick) {
      makeAndPlaceMines(newBoard, r, c);
      setIsFirstClick(false);
    }

    // If it's a mine -> reveal all mines, game over
    if (cell.isMine) {
      cell.isGameOverMine = true;
      // reveal all
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          if (newBoard[rr][cc].isMine) newBoard[rr][cc].revealed = true;
        }
      }
      cell.revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // flood-fill reveal zeros
    const toReveal: [number, number][] = [[r, c]];
    const visited = new Set<string>();
    while (toReveal.length) {
      const [cr, cc] = toReveal.pop()!;
      const key = `${cr},${cc}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const cur = newBoard[cr][cc];
      if (cur.flagged) continue;
      cur.revealed = true;
      if (cur.adjacent === 0 && !cur.isMine) {
        for (const [nr, nc] of neighbors(cr, cc, rows, cols)) {
          const neigh = newBoard[nr][nc];
          if (
            !neigh.revealed &&
            !neigh.flagged &&
            !visited.has(`${nr},${nc}`)
          ) {
            toReveal.push([nr, nc]);
          }
        }
      }
    }

    setBoard(newBoard);
    checkWin(newBoard);
  }

  function checkWin(b: Cell[][]) {
    // Win if all non-mine cells are revealed
    let allRevealed = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = b[r][c];
        if (!cell.isMine && !cell.revealed) {
          allRevealed = false;
          break;
        }
      }
      if (!allRevealed) break;
    }
    if (allRevealed) {
      // mark flags on mines (optional)
      const newBoard = cloneBoard(b);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) newBoard[r][c].flagged = true;
        }
      }
      setBoard(newBoard);
      setWon(true);
      setFlagsLeft(0);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  function makeAndPlaceMines(b: Cell[][], safeR: number, safeC: number) {
    // place mines and compute adjacents
    placeMines(b, mines, safeR, safeC);
  }

  function changeDifficulty(difficulty: keyof typeof DIFFICULTIES) {
    setDifficulty(difficulty);
  }

  function resetBoard() {
    setBoard(makeEmptyBoard(rows, cols));
    setIsFirstClick(true);
    setGameOver(false);
    setWon(false);
    setFlagsLeft(mines);
    setTime(0);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function toggleFlag(r: number, c: number) {
    if (gameOver || won) return;
    const newBoard = cloneBoard(board);
    const cell = newBoard[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    setBoard(newBoard);
    setFlagsLeft((prev) => (cell.flagged ? prev - 1 : prev + 1));
    // after toggling, check win condition
    checkWin(newBoard);
  }

  return {
    resetBoard,
    revealCell,
    toggleFlag,
    board,
    setBoard,
    difficulty,
    changeDifficulty,
    rows,
    cols,
    mines,
    flagsLeft,
    time,
    gameOver,
    won,
  };
}

function placeMines(
  seedBoard: Cell[][],
  mines: number,
  safeRow: number,
  safeCol: number
) {
  const rows = seedBoard.length;
  const cols = seedBoard[0].length;
  let placed = 0;
  // Avoid placing mines on the first-clicked cell and its neighbors (common improvement)
  const forbidden = new Set<string>();
  for (let r = safeRow - 1; r <= safeRow + 1; r++) {
    for (let c = safeCol - 1; c <= safeCol + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) forbidden.add(`${r},${c}`);
    }
  }

  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (forbidden.has(`${r},${c}`)) continue;
    if (!seedBoard[r][c].isMine) {
      seedBoard[r][c].isMine = true;
      placed++;
    }
  }

  // compute adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (seedBoard[r][c].isMine) {
        seedBoard[r][c].adjacent = -1;
        continue;
      }
      let adj = 0;
      for (let rr = r - 1; rr <= r + 1; rr++) {
        for (let cc = c - 1; cc <= c + 1; cc++) {
          if (rr === r && cc === c) continue;
          if (
            rr >= 0 &&
            rr < rows &&
            cc >= 0 &&
            cc < cols &&
            seedBoard[rr][cc].isMine
          )
            adj++;
        }
      }
      seedBoard[r][c].adjacent = adj;
    }
  }
}

function cloneBoard(board: Cell[][]) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function neighbors(r: number, c: number, rows: number, cols: number) {
  const list: [number, number][] = [];
  for (let rr = r - 1; rr <= r + 1; rr++) {
    for (let cc = c - 1; cc <= c + 1; cc++) {
      if (rr === r && cc === c) continue;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) list.push([rr, cc]);
    }
  }
  return list;
}

function makeEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      isMine: false,
      adjacent: 0,
      revealed: false,
      flagged: false,
      isGameOverMine: false,
    }))
  );
}
