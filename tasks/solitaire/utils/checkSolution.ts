import { TGrid } from "../types/card";

export function getDistanceBySolution(solution: TGrid[]) {
  try {
    let result = 0;
    solution.forEach((grid, i, arr) => {
      if (i + 1 === arr.length) return;

      const nextGrid = arr[i + 1];

      const moveCellId = grid?.findIndex((cell, i) => {
        return cell.find((card, j) => {
          return card?.key !== nextGrid?.[i]?.[j]?.key;
        });
      });

      const toMoveCell = nextGrid.findIndex((cell, i) => {
        return cell.find((card, j) => {
          return card.key !== grid[i][j]?.key;
        });
      });

      result += Math.abs(moveCellId - (toMoveCell || 0));
    });
    return result;
  } catch (e) {
    console.error(e);
  }
}

export function getDropsBySolution(solution: TGrid[]) {
  try {
    let result = 0;
    solution.forEach((grid, i, arr) => {
      if (i + 1 === arr.length) return;

      const nextGrid = arr[i + 1];

      const toMoveCell = nextGrid.findIndex((cell, i) => {
        return cell.find((card, j) => {
          return card.key !== grid[i][j]?.key;
        });
      });
      result += +!(grid[toMoveCell]?.length || 1);
    });
    return result;
  } catch (e) {
    console.error(e);
  }
}
