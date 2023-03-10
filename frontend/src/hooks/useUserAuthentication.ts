import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  AUTHENTICATION_STATE,
  CONNECTOR_TYPE,
  injectedConnection,
  walletConnectConnection,
} from "../connection/connectionConstants";

import {
  DAPP_SUPPORTED_ON_CHAINS,
  FALLBACK_DEFAULT_CHAIN,
} from "../connection/chains";
import {
  AUTH_ERROR,
  SET_USER_CHAIN,
  UPDATE_AUTH_STATE,
} from "../actions/types";

import useActiveWeb3React from "./useActiveWeb3React";
import { connect } from "./useEagerlyConnect";

export function useUserAuthentication(initHook = false): {
  connectWallet: () => {};
  logout: () => void;
} {
  const { chainId, isActive, account, connector } = useActiveWeb3React();

  const dispatch = useDispatch();

  const connectWallet = useCallback(
    async (connectorType?: string | null) => {
      console.log("connecting dex ", { connectorType, isActive });
      try {
        dispatch({
          type: UPDATE_AUTH_STATE,
          payload: AUTHENTICATION_STATE.CONNECTING_WALLET,
        });
        // let connector;
        if (connectorType === CONNECTOR_TYPE.injected) {
          await connect(injectedConnection.connector);
          localStorage.connectorType = CONNECTOR_TYPE.injected;
        } else if (connectorType === CONNECTOR_TYPE.walletConnect) {
          const res = await connect(walletConnectConnection.connector);
          console.log("wallet test ", res);
          localStorage.connectorType = CONNECTOR_TYPE.walletConnect;
        } else {
          console.log("wallet test connecting injected ");
          await connect(injectedConnection.connector);
          localStorage.connectorType = CONNECTOR_TYPE.injected;
        }

        localStorage.logged_out = undefined;
      } catch (error) {
        console.log("wallet test error ", error);
        dispatch({
          type: UPDATE_AUTH_STATE,
          payload: AUTHENTICATION_STATE.NOT_STARTED,
        });
        dispatch({
          type: AUTH_ERROR,
          payload: "Something went wrong while connecting with wallet",
        });
        console.log("wallet connection error", { error });
      }
    },
    [connector, dispatch, connect, isActive]
  );

  const logout = useCallback(async () => {
    if (!connector) {
      return;
    }

    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
    dispatch({
      type: UPDATE_AUTH_STATE,
      payload: AUTHENTICATION_STATE.NOT_STARTED,
    });

    localStorage.logged_out = "yes";
    localStorage.removeItem("connectorType");
    localStorage.removeItem(`active_account`);
  }, [dispatch, account, connector, chainId]);

  const isDappSupported = useMemo(() => {
    if (!chainId) {
      return false;
    }

    if (!DAPP_SUPPORTED_ON_CHAINS.includes(chainId)) {
      return false;
    }

    return true;
  }, [chainId]);

  const isNetworkSwitchRequired = useMemo(() => {
    if (isActive && !isDappSupported) {
      return true;
    }

    return false;
  }, [isActive, isDappSupported]);

  useEffect(() => {
    if (!initHook) {
      return;
    }

    if (
      !isActive &&
      (!localStorage.logged_out || localStorage.logged_out === "undefined") &&
      localStorage.active_account
    ) {
      connectWallet(localStorage.connectorType);
      return;
    }

    if (isActive && account && !isNetworkSwitchRequired) {
      dispatch({
        type: UPDATE_AUTH_STATE,
        payload: AUTHENTICATION_STATE.WALLET_CONNECTED,
      });
      localStorage.setItem(`active_account`, account);
    }

    if (isActive && isNetworkSwitchRequired) {
      dispatch({
        type: UPDATE_AUTH_STATE,
        payload: AUTHENTICATION_STATE.NETWORK_SWITCH_REQUEST,
      });
    }
  }, [isActive, account, dispatch, isNetworkSwitchRequired]);

  useEffect(() => {
    // check to avoid duplicate hook initialization
    if (!initHook) {
      return;
    }

    const cachedSelectedChain = parseInt(
      localStorage.userSelectedChain ?? null
    );

    if (!cachedSelectedChain && chainId) {
      dispatch({
        type: SET_USER_CHAIN,
        payload: isDappSupported ? chainId : FALLBACK_DEFAULT_CHAIN,
      });
    } else {
      dispatch({
        type: SET_USER_CHAIN,
        payload: cachedSelectedChain || FALLBACK_DEFAULT_CHAIN,
      });
    }
  }, [chainId, initHook, isDappSupported]);

  return {
    connectWallet: connectWallet,
    logout: logout,
  };
}
