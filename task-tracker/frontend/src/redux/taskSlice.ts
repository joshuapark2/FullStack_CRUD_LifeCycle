import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../types/Task";

const initialState: Task[] = [];

const taskSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		setTasks: (state, action: PayloadAction<Task[]>) => action.payload,
		addTask: (state, action: PayloadAction<Task>) => {
			state.push(action.payload);
		},
	},
});

export const { setTasks, addTask } = taskSlice.actions;
export default taskSlice.reducer;
