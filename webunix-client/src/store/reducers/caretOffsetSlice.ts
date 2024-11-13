import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICaretOffsetState {
  value: number;
}

const initialState: ICaretOffsetState = {
  value: 0,
};

export const caretOffsetSlice = createSlice({
  name: "caretOffset",
  initialState,
  reducers: {
    setCaretOffset: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    clearCaretOffset: (state) => {
      state.value = 0;
    },
  },
});

export const { setCaretOffset, clearCaretOffset } = caretOffsetSlice.actions;


export default caretOffsetSlice.reducer;
