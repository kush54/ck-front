import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import startReducer from '../features/comp/startSlice';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    start:startReducer
  },
});
