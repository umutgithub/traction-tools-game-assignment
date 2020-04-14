import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getRandomInt, getEmptySquares, isEmpty } from './utils';
import { GAME_MODES } from "./constants";

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
  const threeDimensionWinningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // const fourDimensionWinningLines = [
  //   [0, 1, 2, 3],
  //   [4, 5, 6, 7],
  //   [8, 9, 10, 11],
  //   [12, 13, 14, 15],
  //   [0, 4, 8, 12],
  //   [1, 5, 9, 13],
  //   [2, 6, 10, 14],
  //   [3, 7, 11, 15],
  //   [0, 5, 10, 15],
  //   [3, 6, 9, 12]
  // ];

  for (let i = 0; i < threeDimensionWinningLines.length; i += 1) {
    const [a, b, c] = threeDimensionWinningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerRow: threeDimensionWinningLines[i] };
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
  //move state
  const [nextMove, setNextMove] = useState(1);

  //player state
  const [players, setPlayers] = useState({ human: 1, computer: 2 });

  //difficulty select state
  const [difficulty, setDifficulty] = useState('Easy');

  // current states
  const history = useSelector(getHistory);
  const currentStepNumber = useSelector(getCurrentStepNumber);
  const xIsNext = useSelector(getxIsNext);
  
  //dispatcher
  const dispatch = useDispatch();

  /**
   * Human Move Click Handler
   * @param {*} index (index) 
   */
  function humanMove(index) {
    move(index);
    setNextMove(players.computer);
  }
  
  /**
   * Computer Move useEffect Handler
   * @param {*} index 
   */
  function computerMove(){
    const mostRecentGrid = history[history.length - 1].squares;
    console.info('mostRecentGrid', mostRecentGrid);
    const emptyIndices = getEmptySquares(mostRecentGrid);
    console.info('emptyIndices', emptyIndices);

    let index;
    switch (difficulty) { // switch (mode) {
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;
    }

    move(index);
    setNextMove(players.human);
  }

  function move(index){
    if (nextMove === players.human) {
      // ensure to work with copy of history object, before mutating the state.
      const historyDeepCopy = history.slice(0, currentStepNumber + 1);
      const newCurrent = historyDeepCopy[historyDeepCopy.length - 1];
      const squares = newCurrent.squares.slice();

      if (calculateWinner(squares).winner || squares[index]) {
        return;
      }

      squares[index] = 'X';

      const finalHistory = historyDeepCopy.concat([
        {
          squares,
          currentLocation: getLocation(index),
          stepNumber: historyDeepCopy.length,
        },
      ]);

   
      dispatch(setCurrentStepNumber());
      dispatch(setxIsNext(!xIsNext));
      dispatch(setHistory(finalHistory));   
    }
    else if (nextMove === players.computer) {
      const historyDeepCopy = [...history].slice(0, currentStepNumber + 1);
      const newCurrent = historyDeepCopy[historyDeepCopy.length - 1];
      const squares = newCurrent.squares.slice();

      if (calculateWinner(squares).winner || squares[index]) {
        return;
      }

      squares[index] = 'O';

      const finalHistory = historyDeepCopy.concat([
        {
          squares,
          currentLocation: getLocation(index),
          stepNumber: historyDeepCopy.length,
        },
      ]);
      
      dispatch(setCurrentStepNumber());
      dispatch(setxIsNext(!xIsNext));
      dispatch(setHistory(finalHistory));   
    }

  }

  /**
   * Make computer move when it's computer's turn
   */
  useEffect(() => {
    let timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer
      // gameState !== GAME_STATES.over
    ) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 200);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove]);


  const current = history[history.length - 1];
  const { winnerRow } = calculateWinner(current.squares);
  const handleDifficultyChange = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
      <div className="game">
        <div className="game-board">
          <div>
              <select name="difficulty" value={difficulty} onChange={event => handleDifficultyChange(event.target.value)}>
                <option id="0">Easy</option>
                <option id="1">Medium</option>
                <option id="1">Hard</option>
              </select>
          </div>

          <br></br> 
          
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={i => humanMove(i)}
          />
        </div>
      </div>
    );

}