import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from 'js-cookie';

export interface ISession {
    login: string | null,
    password: boolean,
    directory: string | null,
    authorized: boolean
}

const initialState: ISession = {
    login: null,
    password: false,
    directory: null,
    authorized: false
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<string>) => {
            state.login = action.payload
        },
        setPassword: (state) => {
            state.password = !state.password
        },
        setDirectory: (state, action: PayloadAction<string>) => {
            state.directory = action.payload
        },
        setAuthorized: (state) => {
            state.authorized = true
        },
        logout: (state) => {
            state.login = ""
            state.directory = ""
            state.authorized = false
            Cookies.remove('session_id')
        }
    }
})

export const { setLogin, setPassword, setDirectory, setAuthorized, logout } = sessionSlice.actions

export default sessionSlice.reducer