import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICommandsState {
  value: ICommand[];
}

export interface ICommand {
  command: string;
  response?: string | null;
}

const initialState: ICommandsState = {
  value: [],
};

export const commandsSlice = createSlice({
  name: "commands",
  initialState,
  reducers: {
    addCommand: (state, action: PayloadAction<ICommand>) => {
      state.value = [
        ...state.value,
        { command: action.payload.command, response: null },
      ];
    },
    setResponse: (state, action: PayloadAction<string>) => {
      const lastCommand = state.value.at(-1);
      if (lastCommand) {
        lastCommand.response = action.payload;
      }
    },
    
    clearCommands: (state) => {
      state.value = [];
    },
  },
});

export const { addCommand, setResponse, clearCommands } = commandsSlice.actions;

export default commandsSlice.reducer;
