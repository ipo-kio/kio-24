import { CARD_VALUES, MAX_CARD_VALUE } from "../constants/card";
import { IStats } from "../services/slices/cards";
import { TCell, TGrid } from "../types/card";

export function getStackById(grid: TGrid, id: string | number): null | TCell {
  const cell = grid.find(cell => cell.some(card => card.key === id));
  if (!cell) return null;
  const keyIndex = cell.findIndex(card => card.key === id);
  return [...cell].slice(keyIndex);
}

export function hasFullStack(cell: TCell): number {
  let stackCount = 0;
  let res = -1;
  cell.forEach((card, i) => {
    if (CARD_VALUES[card.title] === MAX_CARD_VALUE - stackCount) stackCount += 1;
    else return (stackCount = +(CARD_VALUES[card.title] === MAX_CARD_VALUE));
    if (stackCount === MAX_CARD_VALUE + 1) return (res = i - MAX_CARD_VALUE);
  });
  return res;
}

export function getProgress(grid: TGrid) {
  if (!grid) return Infinity;

  const res = grid.reduce((t, cell) => {
    if (!cell) return t;
    let result = 0;
    for (let i = 0; i < cell.length; i++) {
      for (let j = i; j < cell.length; j++) {
        if (CARD_VALUES[cell[i].title] <= CARD_VALUES[cell[j].title] && !cell[i].removed && !cell[j].removed) result++;
      }
    }
    return t + result;
  }, 0);
  return res;
}

export function checkReadyDeck(grid?: TGrid | null) {
  if (!grid) return false;
  if (grid.every(cell => !cell.length)) return true;
  let isReady = true;
  grid.forEach((cell, i) => {
    const findId = hasFullStack(cell);
    console.log("find", findId);
    if (findId === -1 && cell.length != 0) {
      isReady = false;
    }
  });
  return isReady;
}

export function filterSolutions(solution: TGrid[] | IStats[]) {
  // @ts-ignore
  return solution?.filter((el: TGrid | IStats, i: number, arr: TGrid[] | IStats[]) => {
    if (i >= arr.length - 1) return true;
    return JSON.stringify(el) !== JSON.stringify(arr[i + 1]);
  });
}
