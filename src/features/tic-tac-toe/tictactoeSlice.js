import { createSlice } from '@reduxjs/toolkit';

export const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState: {
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    currentStepNumber: 0,
    xIsNext: true,
    boardSize: 5
  },
  reducers: {
    //REDUCERS
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setCurrentStepNumber: (state, action) => {
      state.currentStepNumber = action.payload;
    },
    setxIsNext: (state, action) => {
      state.xIsNext = action.payload;
    },
    setBoardSize: (state, action) => {
      state.boardSize = action.payload;
    },
  },
});

export const {setHistory, setCurrentStepNumber, setxIsNext } = tictactoeSlice.actions;

// THUNKS
export const incrementAsync = value => dispatch => {
  setTimeout(() => {
    dispatch(setxIsNext(value));
  }, 1000);
};

// SELECTORS
export const getHistory = state => state.tictactoe.history;
export const getCurrentStepNumber = state => state.tictactoe.currentStepNumber;
export const getxIsNext = state => state.tictactoe.xIsNext;
export const getBoardSize = state => state.tictactoe.boardSize;

export default tictactoeSlice.reducer;
