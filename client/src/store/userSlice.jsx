import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: "not authenticated",
	user: [],
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action) => {
			state.value = "authenticated";
			state.user = action.payload;
		},
		logout: (state) => {
			state.value = "not authenticated";
			state.user = [];
			localStorage.clear();
		},
		incrementByAmount: (state, action) => {
			state.value += action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { login, logout, incrementByAmount } = userSlice.actions;

export default userSlice.reducer;
