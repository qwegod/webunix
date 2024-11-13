import { configureStore } from "@reduxjs/toolkit"
import inputValueReducer from './reducers/inputValueSlice'
import caretOffsetReducer from './reducers/caretOffsetSlice'
import commandsReducer from './reducers/commandsSlice'

const store = configureStore({
    reducer: {
        inputValue: inputValueReducer,
        caretOffset: caretOffsetReducer,
        commands: commandsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store