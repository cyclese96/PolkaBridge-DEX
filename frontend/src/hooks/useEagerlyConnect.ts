import { Connector } from "@web3-react/types";
import { UPDATE_AUTH_STATE } from "../actions/types";
import {
  AUTHENTICATION_STATE,
  injectedConnection,
  walletConnectConnection,
} from "../connection/connectionConstants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { isMetaMaskInstalled } from "../utils/helper";

export async function connect(connector: Connector) {
  try {
    return await connector.activate();
  } catch (error) {
    // fix states to retry connecting wallet
    console.log(`wallet test web3-react eager connection error:`, { error });
    return null;
  }
}

// {
//   "code": 4001,
//   "message": "User rejected the request.",
//   "stack": "{\n  \"code\": 4001,\n  \"message\": \"User rejected the request.\",\n  \"stack\": \"Error: User rejected the request.\\n    at new i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:13593)\\n    at new r.EthereumProviderError (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:14108)\\n    at s (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:16627)\\n    at Object.userRejectedRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:17858)\\n    at r.userRejectedRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:51356)\\n    at v.<anonymous> (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:48788)\\n    at Generator.next (<anonymous>)\\n    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:35293\\n    at new Promise (<anonymous>)\\n    at n (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:35038)\\n    at v.rejectPermissionsRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:48613)\\n    at Object.rejectPermissionsRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-4.js:1:12598)\\n    at t.<anonymous> (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:10:324754)\\n    at p (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:189330)\\n    at s.emit (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:192325)\\n    at w (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86790)\\n    at b (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86605)\\n    at v.push (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:87419)\\n    at a.exports._write (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:8:961462)\\n    at v (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:100030)\\n    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:103214\\n    at y.write (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:103241)\\n    at t.exports.m (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:91990)\\n    at p (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:189330)\\n    at s.emit (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:192325)\\n    at w (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86790)\\n    at b (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86605)\\n    at v.push (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:87419)\\n    at t.exports._onMessage (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:332934)\\n    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:332781\"\n}\n  at new i (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:13593)\n  at new r.EthereumProviderError (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:14108)\n  at s (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:16627)\n  at Object.userRejectedRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:17858)\n  at r.userRejectedRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:51356)\n  at v.<anonymous> (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:48788)\n  at Generator.next (<anonymous>)\n  at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:35293\n  at new Promise (<anonymous>)\n  at n (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:35038)\n  at v.rejectPermissionsRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-0.js:3:48613)\n  at Object.rejectPermissionsRequest (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-4.js:1:12598)\n  at t.<anonymous> (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background-3.js:10:324754)\n  at p (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:189330)\n  at s.emit (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:192325)\n  at w (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86790)\n  at b (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86605)\n  at v.push (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:87419)\n  at a.exports._write (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-2.js:8:961462)\n  at v (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:100030)\n  at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:103214\n  at y.write (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:103241)\n  at t.exports.m (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:91990)\n  at p (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:189330)\n  at s.emit (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-0.js:99:192325)\n  at w (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86790)\n  at b (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:86605)\n  at v.push (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-3.js:1:87419)\n  at t.exports._onMessage (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:332934)\n  at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/common-1.js:12:332781"
// }

// {
//   "error": {}
// }

export default function useEagerlyConnect() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function startConnecting() {
      let res = null;
      if (isMetaMaskInstalled()) {
        res = await connect(injectedConnection.connector);
      } else {
        res = await connect(walletConnectConnection.connector);
      }
      console.log("wallet test connection res ", res);

      if (!res) {
        // retry connecting
        dispatch({
          type: UPDATE_AUTH_STATE,
          payload: AUTHENTICATION_STATE.NOT_STARTED,
        });
      }
    }

    startConnecting();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
