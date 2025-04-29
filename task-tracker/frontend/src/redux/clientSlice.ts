import type { RootState } from "./store";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define Client type
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

// Define State
interface ClientState {
	clients: Client[];
	currentClient?: Client;
	loading: boolean;
	error: string | null;
}

// Initial state
const initialState: ClientState = {
	clients: [],
	currentClient: undefined,
	loading: false,
	error: null,
};

// --- Async Actions (typed) ---

export const fetchClients = createAsyncThunk<Client[]>(
	"client/fetchClients",
	async () => {
		const response = await axios.get<Client[]>(
			"http://localhost:8080/api/clients",
		);
		return response.data;
	},
);

export const createClientAPI = createAsyncThunk<Client, Client>(
	"client/createClient",
	async (client) => {
		const response = await axios.post<Client>(
			"http://localhost:8080/api/clients",
			client,
		);
		return response.data;
	},
);

export const updateClientAPI = createAsyncThunk<
	Client,
	{ id: number; updates: Partial<Client> }
>("client/updateClient", async ({ id, updates }, { getState }) => {
	const state = getState() as RootState;
	const existingClient = state.client.clients.find((c) => c.id === id);

	if (!existingClient) {
		throw new Error("Client not found");
	}

	const fullClient: Client = { ...existingClient, ...updates };

	const response = await axios.put<Client>(
		`http://localhost:8080/api/clients/${id}`,
		fullClient,
	);

	return response.data;
});

export const deleteClientAPI = createAsyncThunk<number, number>(
	"client/deleteClient",
	async (id) => {
		await axios.delete(`http://localhost:8080/api/clients/${id}`);
		return id;
	},
);

// ✨ Delete all clients
export const deleteAllClientsAPI = createAsyncThunk<void>(
	"client/deleteAllClients",
	async () => {
		await axios.delete("http://localhost:8080/api/clients");
	},
);

// --- Slice ---

const clientSlice = createSlice({
	name: "client",
	initialState,
	reducers: {
		setCurrentClient: (state, action: PayloadAction<Client>) => {
			state.currentClient = action.payload;
		},
		clearCurrentClient: (state) => {
			state.currentClient = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			// fetchClients
			.addCase(fetchClients.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClients.fulfilled, (state, action) => {
				state.loading = false;
				state.clients = action.payload;
			})
			.addCase(fetchClients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch clients.";
			})

			// createClientAPI
			.addCase(createClientAPI.fulfilled, (state, action) => {
				state.clients.push(action.payload);
				state.currentClient = action.payload;
			})

			// updateClientAPI
			.addCase(updateClientAPI.fulfilled, (state, action) => {
				const index = state.clients.findIndex(
					(c) => c.id === action.payload.id,
				);
				if (index !== -1) {
					state.clients[index] = action.payload;
				}
				if (state.currentClient?.id === action.payload.id) {
					state.currentClient = action.payload;
				}
			})

			// deleteClientAPI
			.addCase(deleteClientAPI.fulfilled, (state, action) => {
				state.clients = state.clients.filter((c) => c.id !== action.payload);
			})

			.addCase(deleteAllClientsAPI.fulfilled, (state) => {
				state.clients = [];
				state.currentClient = undefined;
				state.loading = false;
				state.error = null;
			});
	},
});

export const { setCurrentClient, clearCurrentClient } = clientSlice.actions;
export default clientSlice.reducer;
