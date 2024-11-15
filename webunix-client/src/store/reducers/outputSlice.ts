import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "../../welcome";

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
    setLogin: (state) => {
      state.value = ["Enter Username", "no account? !reg"];
    },
    setWelcome: (state) => {
      state.value = [message];
    },
    printOut: (state, action: PayloadAction<string>) => {
      state.value = [...state.value, action.payload];
    },
    clearOutput: (state) => {
      state.value = [];
    },
  },
});

export const { setMessage, setLogin, setWelcome, printOut, clearOutput } =
  outputSlice.actions;

export default outputSlice.reducer;
