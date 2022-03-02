import { combineReducers } from "redux";
import accountReducer from "./account";
import dexReducer from "./dexReducer";
import farm from "./farm";
import multicall from "../state/multicall/reducer";

export default combineReducers({
  account: accountReducer,
  dex: dexReducer,
  farm: farm,
  multicall: multicall,
});
