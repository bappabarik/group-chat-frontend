import { configureStore } from '@reduxjs/toolkit';
import nameSlice from './nameSlice'

const store = configureStore({
    reducer: {
        name: nameSlice
    }
})

export default store