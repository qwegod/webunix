import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { message } from "../../welcome";

interface IOutput {
  out: string[];
  console_commands: Record<string, string>;
  suggest: string | undefined;
  suggestEqual: boolean;
}

const initialState: IOutput = {
  out: [],
  console_commands: {
    "help": "-print commands",
    "info": "-print console info",
    "clear": "-clear console output",
    "user": "-print user info",
    "session": "-print session info from server",
    "logout": "-destroy session",
  },
  suggest: "",
  suggestEqual: false,
};

export const outputSlice = createSlice({
  name: "output",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.out = [action.payload];
    },
    setWelcome: (state) => {
      state.out = [message]
    },
    setLogin: (state) => {
      state.out = ["Enter Username", "no account? !reg"];
    },
    printOut: (state, action: PayloadAction<string>) => {
      state.out = [...state.out, action.payload];
    },
    clearOutput: (state) => {
      state.out = [];
    },
    setSuggest: (state, action: PayloadAction<string>) => {
      state.suggest = action.payload;
    },
    clearSuggest: (state) => {
      state.suggest = "";
    },
    setSuggestEqual: (state, action: PayloadAction<boolean>) => {
      state.suggestEqual = action.payload;
    },
  },
});

export const {
  setMessage,
  setWelcome,
  setLogin,
  printOut,
  clearOutput,
  setSuggest,
  clearSuggest,
  setSuggestEqual,
} = outputSlice.actions;

export default outputSlice.reducer;
