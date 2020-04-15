import { configureStore } from '@reduxjs/toolkit';
import tictactoeReducer from '../features/tic-tac-toe/tictactoeSlice';

export default configureStore({
  reducer: {
    tictactoe: tictactoeReducer
  },
});
