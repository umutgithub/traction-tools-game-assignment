import { DIMS, DRAW } from "./constants";

export default class Board {
  constructor(grid) {
    this.grid = grid || new Array(DIMS ** 2).fill(null);
  }

  makeMove = (square, player) => {
    if (this.grid[square] === null) {
      this.grid[square] = player;
    }
  };

  getEmptySquares = (grid = this.grid) => {
    let squares = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  isEmpty = (grid = this.grid) => {
    return this.getEmptySquares(grid).length === DIMS ** 2;
  };

  getWinner = (grid = this.grid) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    let res = null;
    winningCombos.forEach((el, i) => {
      if (
        grid[el[0]] !== null &&
        grid[el[0]] === grid[el[1]] &&
        grid[el[0]] === grid[el[2]]
      ) {
        res = { res: grid[el[0]], winner: grid[el[0]], winnerRow: winningCombos[i] }
      } else if (res === null && this.getEmptySquares(grid).length === 0) {
        res = { res: DRAW, winner: null, winnerRow: null };
      }
    });
    return res;
  };

  clone = () => {
    return new Board(this.grid.concat());
  };
}
