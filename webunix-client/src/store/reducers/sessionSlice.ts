import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ISession {
    login: string | null,
    password: string | null,
    directory: string | null,
    authorized: boolean
}

const initialState: ISession = {
    login: null,
    password: null,
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
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setDirectory: (state, action: PayloadAction<string>) => {
            state.directory = action.payload
        },
        setAuthorized: (state) => {
            state.authorized = true
        },
        logout: (state) => {
            state.login = ""
            state.password = ""
        }
    }
})

export const { setLogin, setPassword, setDirectory, setAuthorized, logout } = sessionSlice.actions

export default sessionSlice.reducer