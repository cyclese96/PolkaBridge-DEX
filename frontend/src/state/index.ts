// import { configureStore } from "@reduxjs/toolkit";
// import { save, load } from 'redux-localstorage-simple';
import store from "store";
import { updateVersion } from "./global/actions";
// import {
//   gelatoReducers,
//   GELATO_PERSISTED_KEYS,
// } from '@gelatonetwork/limit-orders-react';

import multicall from "./multicall/reducer";

const PERSISTED_KEYS: string[] = [
  // 'user',
  // 'transactions',
  // 'lists',
  // ...GELATO_PERSISTED_KEYS,
];

// const store = configureStore({
//   reducer: {
//     // application,
//     // user,
//     // transactions,
//     // swap,
//     // mint,
//     // burn,
//     multicall,
//     // lists,
//     // ...gelatoReducers,
//   },
//   middleware: (getDefaultMiddleware) => [
//     ...getDefaultMiddleware({ serializableCheck: false, thunk: false }),
//     // save({ states: PERSISTED_KEYS }),
//   ],
//   preloadedState: {},
// });

// store.dispatch(updateVersion());

// export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
