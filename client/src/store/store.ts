import { configureStore } from "@reduxjs/toolkit";

import inputValueReducer from "./reducers/inputValueSlice";
import caretOffsetReducer from "./reducers/caretOffsetSlice";
import commandReducer from "./reducers/commandSlice";
import sessionReducer from "./reducers/sessionSlice";
import outputReducer from "./reducers/outputSlice";

const store = configureStore({
  reducer: {
    inputValue: inputValueReducer,
    caretOffset: caretOffsetReducer,
    command: commandReducer,
    session: sessionReducer,
    output: outputReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
