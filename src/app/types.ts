export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isGameOverMine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
};
