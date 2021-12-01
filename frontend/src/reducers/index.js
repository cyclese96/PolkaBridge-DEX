import { combineReducers } from "redux";
import accountReducer from "./account";
import dexReducer from "./dexReducer";
import farm from "./farm";

export default combineReducers({
  account: accountReducer,
  dex: dexReducer,
  farm: farm
});
