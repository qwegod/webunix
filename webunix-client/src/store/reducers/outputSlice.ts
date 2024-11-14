import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IOutput {
  value: string[];
}

const initialState: IOutput = {
  value: [],
};

export const outputSlice = createSlice({
  name: "output",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.value = [action.payload];
    },
    printOut: (state, action: PayloadAction<string>) => {
      state.value = [...state.value, action.payload]
    },
    clearOutput: (state) => {
        state.value = []
    }
  },
});



export const { setMessage, printOut, clearOutput } = outputSlice.actions

export default outputSlice.reducer