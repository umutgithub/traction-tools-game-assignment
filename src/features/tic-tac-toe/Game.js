import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getHistory,
  getCurrentStepNumber,
  getxIsNext,
  setHistory,
  setCurrentStepNumber,
  setxIsNext
} from './tictactoeSlice';

import Board from './Board';

/**
 * 
 * @param {*} squares 
 */
const calculateWinner = (squares) => {
  // const threeDimensionWinningLines = [
  //   [0, 1, 2],
  //   [3, 4, 5],
  //   [6, 7, 8],
  //   [0, 3, 6],
  //   [1, 4, 7],
  //   [2, 5, 8],
  //   [0, 4, 8],
  //   [2, 4, 6],
  // ];

  const fourDimensionWinningLines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];

  for (let i = 0; i < fourDimensionWinningLines.length; i += 1) {
    const [a, b, c, d] = fourDimensionWinningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return { winner: squares[a], winnerRow: fourDimensionWinningLines[i] };
    }
  }

  return { winner: null, winnerRow: null };
};

/**
 * 
 * @param {*} move 
 */
const getLocation = (move) => {
  const locationMap = {
    0: 'row: 1, col: 1',
    1: 'row: 1, col: 2',
    2: 'row: 1, col: 3',
    3: 'row: 1, col: 4',
    4: 'row: 2, col: 1',
    5: 'row: 2, col: 2',
    6: 'row: 2, col: 3',
    7: 'row: 2, col: 4',
    8: 'row: 3, col: 1',
    9: 'row: 3, col: 2',
    10: 'row: 3, col: 3',
    11: 'row: 3, col: 4',
    12: 'row: 4, col: 1',
    13: 'row: 4, col: 2',
    14: 'row: 4, col: 3',
    15: 'row: 4, col: 4',
  };

  return locationMap[move];
};

export default function GameTicTacToe(){
  // current states
  const history = useSelector(getHistory);
  const currentStepNumber = useSelector(getCurrentStepNumber);
  const xIsNext = useSelector(getxIsNext);
  
  //dispatcher
  const dispatch = useDispatch();

  /**
   * Square Click Handler
   * @param {*} i (index) 
   */
  function handleClick(i) {
    // ensure to work with copy of history object, before mutating the state.
    const historyDeepCopy = [...history].slice(0, currentStepNumber + 1);
    const newCurrent = historyDeepCopy[historyDeepCopy.length - 1];
    const squares = newCurrent.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    const finalHistory = historyDeepCopy.concat([
      {
        squares,
        currentLocation: getLocation(i),
        stepNumber: historyDeepCopy.length,
      },
    ]);

    dispatch(setCurrentStepNumber(finalHistory.length - 1));
    dispatch(setxIsNext(!xIsNext));
    dispatch(setHistory(finalHistory));

  }


  const current = history[currentStepNumber];
  const { winnerRow } = calculateWinner(current.squares);

  return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={i => handleClick(i)}
          />
        </div>
      </div>
    );

}