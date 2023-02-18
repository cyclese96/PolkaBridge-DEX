/* eslint-disable react-hooks/rules-of-hooks */
import { useWeb3React } from "@web3-react/core";

export default function useActiveWeb3React() {
  const interfaceContext = useWeb3React();

  return interfaceContext;
}
