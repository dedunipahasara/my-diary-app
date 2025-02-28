// reducers/diarySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state structure for the diary
interface DiaryState {
    entries: string[]; // Array to store diary entries
}

const initialState: DiaryState = {
    entries: [],
};

// Create the slice for diary entries
const diarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {
        addEntry: (state, action: PayloadAction<string>) => {
            state.entries.push(action.payload); // Add new diary entry
        },
        // Additional actions like deleteEntry or updateEntry can be added
    },
});

// Export actions
export const { addEntry } = diarySlice.actions;

// Export reducer to be used in store
export default diarySlice.reducer;
