import { configureStore, combineReducers } from "@reduxjs/toolkit";
import clientReducer from "./clientSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import type { AnyAction } from "@reduxjs/toolkit";

// Base reducers
const appReducer = combineReducers({
	client: clientReducer,
});

// Root reducer handling RESET_APP
const rootReducer = (
	state: ReturnType<typeof appReducer> | undefined,
	action: AnyAction,
) => {
	if (action.type === "RESET_APP") {
		storage.removeItem("persist:root");
		return appReducer(undefined, action);
	}
	return appReducer(state, action);
};

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store setup
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;
