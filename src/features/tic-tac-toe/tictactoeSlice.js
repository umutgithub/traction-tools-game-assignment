import { createSlice } from '@reduxjs/toolkit';
import { X, O } from './constants'

export const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState: {
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    currentStepNumber: 0,
    playerScore_X: 0,
    playerScore_O: 0
  },
  reducers: {
    //REDUCERS
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setCurrentStepNumber: (state) => {
      state.currentStepNumber += 1;
    },
    setWinnerScore: (state, action) => {
      if(action.payload === X){
        state.playerScore_X += 1;
      } else if(action.payload === O){
        state.playerScore_O += 1;
      }
    },
    resetInitialState: (state) => {
      state.history = [
        {
          squares: Array(9).fill(null)
        }
      ];

      state.currentStepNumber = 0;
    }
  }
});

export const {setHistory, setCurrentStepNumber, setWinnerScore, resetInitialState } = tictactoeSlice.actions;

// THUNKS


// SELECTORS
export const getHistory = state => state.tictactoe.history;
export const getCurrentStepNumber = state => state.tictactoe.currentStepNumber;
export const getPlayerScore_X = state => state.tictactoe.playerScore_X;
export const getPlayerScore_O = state => state.tictactoe.playerScore_O;


export default tictactoeSlice.reducer;
