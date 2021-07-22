import { combineReducers } from "redux";
import accountReducer from "./account";
import dexReducer from "./dexReducer";

export default combineReducers({
  account: accountReducer,
  dex: dexReducer,
});
