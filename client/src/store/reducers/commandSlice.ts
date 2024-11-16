import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICommandState {
  value: ICommand;
}

export interface ICommand {
  command: string | null;
  response?: string;
}

const initialState: ICommandState = {
  value: { command: null, response: "" },
};

export const commandSlice = createSlice({
  name: "command",
  initialState,
  reducers: {
    setCommand: (state, action: PayloadAction<ICommand>) => {
      state.value = action.payload;
    },
    setResponse: (state, action: PayloadAction<string>) => {
      state.value.response = action.payload;
    },
    clearCommand: (state) => {
      state.value = { command: null, response: "" };
    },
  },
});

export const { setCommand, setResponse, clearCommand } = commandSlice.actions;

export default commandSlice.reducer;
