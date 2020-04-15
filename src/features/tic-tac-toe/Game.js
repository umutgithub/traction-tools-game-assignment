import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRandomInt } from "./utils";
import { minimax } from "./minimax";
import { GAME_MODES } from "./constants";
import BoardHelpers from "./BoardHelpers";

import {
  getHistory,
  getCurrentStepNumber,
  setHistory,
  setCurrentStepNumber,
  setWinnerScore,
  getPlayerScore_X,
  getPlayerScore_O,
  resetInitialState,
} from "./tictactoeSlice";

import Board from "./Board";

/**
 * Location Map
 * @param {*} move
 */
const getLocation = (move) => {
  const locationMap = {
    0: 'row: 1, col: 1',
    1: 'row: 1, col: 2',
    2: 'row: 1, col: 3',
    3: 'row: 2, col: 1',
    4: 'row: 2, col: 2',
    5: 'row: 2, col: 3',
    6: 'row: 3, col: 1',
    7: 'row: 3, col: 2',
    8: 'row: 3, col: 3',
  };

  return locationMap[move];
};

export default function GameTicTacToe() {

  // TicTacToe Game final App History and scores states (stored in redux)
  const history = useSelector(getHistory);
  const currentStepNumber = useSelector(getCurrentStepNumber);
  const playerScore_X = useSelector(getPlayerScore_X);
  const playerScore_O = useSelector(getPlayerScore_O);

  // ======= Rest of the app internal state uses hooks. =======
  //move state
  const [nextMove, setNextMove] = useState(1);

  //players state
  // eslint-disable-next-line
  const [players, setPlayers] = useState({ human: 1, computer: 2 });

  //difficulty select state
  const [difficulty, setDifficulty] = useState("Easy");

  //grid state
  const [grid, setGrid] = useState(history[history.length - 1].squares);
  
  //create a instance of Board Helpers. This will be used to control overall game.
  const board = new BoardHelpers(grid.concat());

  //dispatcher
  const dispatch = useDispatch();

  /**
   * Human Move Click Handler
   * @param {*} index (index)
   */
  function humanMove(index) {
    //Do not human to make another move if the game is over.
    if(board.getWinner()){
      return;
    }

    if (!grid[index]) {
      move(index, players.human);
      setNextMove(players.computer);
    }
  }

  /**
   * Computer Move useEffect Handler
   * @param {*} index
   */
  function computerMove() {
    // const mostRecentGrid = history[history.length - 1].squares;
    const board = new BoardHelpers(grid.concat());
    const emptyIndices = board.getEmptySquares(grid);

    let index;
    switch (difficulty) {
      //EASY
      case GAME_MODES.easy:
        do {
          index = getRandomInt(0, 8);
        } while (!emptyIndices.includes(index));
        break;

      //MEDIUM
      case GAME_MODES.medium:
        // Medium level is basically ~half of the moves are minimax and the other ~half random
        const smartMove = !board.isEmpty(grid) && Math.random() < 0.5;
        if (smartMove) {
          index = minimax(board, players.computer)[1];
        } else {
          do {
            index = getRandomInt(0, 8);
          } while (!emptyIndices.includes(index));
        }
        break;

      //HARD
      case GAME_MODES.hard:
      default:
        index = board.isEmpty(grid)
          ? getRandomInt(0, 8)
          : minimax(board, players.computer)[1];
    }

    if (!grid[index]) {
      move(index, players.computer);
      setNextMove(players.human);
    }
  }

  /**
   * Abstract Move function for both human and computer
   * @param {*} index
   * @param {*} player
   */
  function move(index, player) {
    // if the game is over don't make another move.
    if(board.getWinner()){
      return;
    }
    
    //update grid on every move.
    if (player) {
      setGrid((grid) => {
        const gridCopy = grid.concat();
        gridCopy[index] = player;
        return gridCopy;
      });
    }

    // ensure to work with copy of history object, before mutating the state.
    const historyDeepCopy = history.slice(0, currentStepNumber + 1);
    const newCurrent = historyDeepCopy[historyDeepCopy.length - 1];
    const squares = newCurrent.squares.slice();

    squares[index] = nextMove === players.human ? "X" : 'O';

    const finalHistory = historyDeepCopy.concat([
      {
        squares,
        currentLocation: getLocation(index),
        stepNumber: historyDeepCopy.length,
      },
    ]);

    dispatch(setCurrentStepNumber());
    dispatch(setHistory(finalHistory));
    
  }

  function reset() {
    setGrid([...Array(9).fill(null)]);
    dispatch(resetInitialState());
  }

  /**
   * Hook for computer's turn.
   */
  useEffect(() => {
    //if there is winner or draw, stop the game.
    if(board.getWinner() !== null){
      setNextMove(players.human);
      return;
    }
    let timeout;
    if (nextMove !== null && nextMove === players.computer) {
      // Delay computer moves to make them more natural
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
    // eslint-disable-next-line
  }, [nextMove]);

  /**
   * Use effect to dispatch user score.
   */
  useEffect(() => {
    if(board.getWinner() && board.getWinner().res){
      dispatch(setWinnerScore(board.getWinner().winner));
      return;
    }
    // eslint-disable-next-line
  }, [board.getWinner() && board.getWinner().winner]);

  const current = history[history.length - 1];
  const handleDifficultyChange = (difficulty) => {
    setDifficulty(difficulty);
    // reset game if difficulty changes.
    reset();
  };

  let status;
  let winner = null;
  let winnerRow = null;

  if(board.getWinner() && board.getWinner().winner){
    winner = board.getWinner().winner;
    winnerRow = board.getWinner().winnerRow;
  }

  if (winner) {
    status = `Winner ${winner}`;
  } else if (history.length === 10) {
    status = "Draw. No one won.";
  }

  return (
    <div className="game">
      <div>
        <select
          name="difficulty"
          value={difficulty}
          onChange={(event) => handleDifficultyChange(event.target.value)}
        >
          <option id="0">Easy</option>
          <option id="1">Medium</option>
          <option id="1">Hard</option>
        </select>
      </div>

      <br></br>

      <div className="game-board">
        <Board
          squares={current.squares}
          winnerSquares={winnerRow}
          onClick={(i) => humanMove(i)}
        />
        <div className="game-info">
          <button className="button button--new-game" onClick={() => reset()}>
            New game
          </button>
          <br></br>
          <div>{status}</div>
        </div>
      </div>

      <br></br>

      <div> PLAYER X: {playerScore_X} </div>
      <div> PLAYER O: {playerScore_O} </div>
    </div>
  );
}
