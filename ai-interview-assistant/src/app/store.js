import { configureStore, combineReducers } from '@reduxjs/toolkit';
import interviewReducer from '../features/interviewee/interviewSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Configuration for redux-persist.
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all reducers.
const rootReducer = combineReducers({
  interview: interviewReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store.
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to ignore non-serializable actions from redux-persist
    }),
});

export const persistor = persistStore(store);