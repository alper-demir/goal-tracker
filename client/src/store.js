import { configureStore } from '@reduxjs/toolkit'
import user from "./stores/user"

export const store = configureStore({
    reducer: {
        user
    },
})