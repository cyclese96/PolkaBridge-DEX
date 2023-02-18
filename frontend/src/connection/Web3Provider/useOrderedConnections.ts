import { useMemo } from "react";
import { getConnection } from "./index";
import { ConnectionType } from "../connectionConstants";

const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.WALLET_CONNECT,
];

export default function useOrderedConnections() {
  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = [];

    orderedConnectionTypes.push(
      ...SELECTABLE_WALLETS.filter((wallet) => wallet)
    );

    return orderedConnectionTypes.map(getConnection);
  }, []);
}
