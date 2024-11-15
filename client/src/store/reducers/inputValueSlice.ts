import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInputValueState {
  value: string;
}

const initialState: IInputValueState = {
  value: "",
};

export const inputValueSlice = createSlice({
  name: "inputValue",
  initialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearInputValue: (state) => {
      state.value = "";
    },
  },
});

export const { setInputValue, clearInputValue } = inputValueSlice.actions;

export default inputValueSlice.reducer;
