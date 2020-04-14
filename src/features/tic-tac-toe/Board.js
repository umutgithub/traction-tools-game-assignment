import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import {
  // getBoardSize,
  // getHistory,
  // getCurrentStepNumber,
} from './tictactoeSlice';
import Square from './Square';

export function Board(props){
  // const history = useSelector(getHistory);
  // const currentStepNumber = useSelector(getCurrentStepNumber);
  // const current = history[currentStepNumber];

  function renderSquare(i) {
    const winnerClass =
      props.winnerSquares &&
      (
        props.winnerSquares[0] === i ||
        props.winnerSquares[1] === i ||
        props.winnerSquares[2] === i ||
        props.winnerSquares[3] === i 
      )
        ? 'square--green'
        : '';

    return (
      <Square
        winnerClass={winnerClass}
        key={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  function createBoard(row, col) {
    const board = [];
    let cellCounter = 0;

    for (let i = 0; i < row; i += 1) {
      const columns = [];
      for (let j = 0; j < col; j += 1) {
        columns.push(renderSquare(cellCounter++));
      }
      board.push(<div key={i} className="board-row">{columns}</div>);
    }

    return board;
  }

  return <div>{createBoard(4, 4)}</div>;

} 

export default Board;
