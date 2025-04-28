import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Client {
	id: number;
	fullName: string;
	clientType: string;
	servicesRequested: string[];
	servicesProposed?: string[];
	selectedTier?: string;
	status: string;
	date: string;
	sendPreview?: boolean;
}

interface ClientState {
	clients: Client[];
	currentClient?: Client;
}

const initialState: ClientState = {
	clients: [],
	currentClient: undefined,
};

const clientSlice = createSlice({
	name: "client",
	initialState,
	reducers: {
		createClient: (state, action: PayloadAction<Client>) => {
			state.clients.push(action.payload);
			state.currentClient = action.payload;
		},
		updateCurrentClient: (state, action: PayloadAction<Partial<Client>>) => {
			if (state.currentClient) {
				state.currentClient = { ...state.currentClient, ...action.payload };
				const index = state.clients.findIndex(
					(c) => c.id === state.currentClient?.id,
				);
				if (index !== -1) {
					state.clients[index] = state.currentClient;
				}
			}
		},

		clearCurrentClient: (state) => {
			state.currentClient = undefined;
		},
		// ➡️ New action
		setCurrentClient: (state, action: PayloadAction<Client>) => {
			state.currentClient = action.payload;
		},
	},
});

export const {
	createClient,
	updateCurrentClient,
	clearCurrentClient,
	setCurrentClient,
} = clientSlice.actions;

export default clientSlice.reducer;
