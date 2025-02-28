import { configureStore } from '@reduxjs/toolkit';
import diaryReducer from '../reducers/diarySlice';
import authReducer from '../reducers/authSlice';

const store = configureStore({
    reducer: {
        diary: diaryReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;