import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchScript } from './startApi';

const initialState = {
  script: null,
  status: 'idle',
};

export const fetchScriptAsync = createAsyncThunk(
    'start/fetchScript',
    async (s) => {
      const response = await fetchScript(s);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );
export const startSlice = createSlice({
  name: 'start',
  initialState,
  reducers: {

   
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchScriptAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScriptAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.script = action?.payload;
      })
  },
});



export const selectGeneratedScript = (state) => state.start.script;
export const selectScriptstatus = (state)=>state.start.status



export default startSlice.reducer;
