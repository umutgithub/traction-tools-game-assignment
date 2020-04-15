import { createSlice } from '@reduxjs/toolkit';

export const tictactoeSlice = createSlice({
  name: 'tictactoe',
  initialState: {
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    currentStepNumber: 0
  },
  reducers: {
    //REDUCERS
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setCurrentStepNumber: (state) => {
      state.currentStepNumber += 1;
    }
  },
});

export const {setHistory, setCurrentStepNumber } = tictactoeSlice.actions;

// THUNKS


// SELECTORS
export const getHistory = state => state.tictactoe.history;
export const getCurrentStepNumber = state => state.tictactoe.currentStepNumber;
;

export default tictactoeSlice.reducer;
