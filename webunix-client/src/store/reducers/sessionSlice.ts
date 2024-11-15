import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface ISession {
  username: string | null;
  password: boolean;
  directory: string | null;
  reg: boolean;
  authorized: boolean;
}

const initialState: ISession = {
  username: null,
  password: false,
  directory: null,
  reg: false,
  authorized: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<boolean>) => {
      state.password = action.payload;
    },
    setDirectory: (state, action: PayloadAction<string>) => {
      state.directory = action.payload;
    },
    setRegister: (state, action: PayloadAction<boolean>) => {
      state.reg = action.payload;
    },
    setAuthorized: (state) => {
      state.authorized = true;
    },
    logout: (state) => {
      state.username = "";
      state.directory = "";
      state.password = false;
      state.authorized = false;
      Cookies.remove("username");
      Cookies.remove("session_id");
    },
  },
});

export const {
  setUsername,
  setPassword,
  setDirectory,
  setRegister,
  setAuthorized,
  logout,
} = sessionSlice.actions;

export default sessionSlice.reducer;
