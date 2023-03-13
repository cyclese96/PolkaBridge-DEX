import { Connector } from '@web3-react/types';
import { getChainInfo, isSupportedChain, SupportedChainId } from './chains';
import { walletConnectConnection } from './connectionConstants';

import { RPC_URLS } from './infura';
import { NETWORK_DETAILS } from './rpc';

function getRpcUrl(chainId: SupportedChainId): string {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.RINKEBY:
    case SupportedChainId.ROPSTEN:
    case SupportedChainId.BSC_TESTNET:
    case SupportedChainId.BSC:
      return RPC_URLS[chainId][0];
    case SupportedChainId.GOERLI:
      return RPC_URLS[chainId][0];
    // Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
    // MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
    // See the definition of FALLBACK_URLS for more details.
    default:
      return RPC_URLS[chainId][0];
  }
}

export const switchChain = async (
  connector: Connector,
  chainId: SupportedChainId,
) => {
  console.log('switch test ', { chainId });
  if (!isSupportedChain(chainId)) {
    throw new Error(
      `Chain ${chainId} not supported for connector (${typeof connector})`,
    );
  } else if (connector === walletConnectConnection.connector) {
    await connector.activate(chainId);
  } else {
    const info = getChainInfo(chainId);
    const addChainParameter = {
      chainId,
      chainName: info.label,
      rpcUrls: [getRpcUrl(chainId)],
      nativeCurrency: info.nativeCurrency,
      blockExplorerUrls: [info.explorer],
    };

    try {
      console.log('switch test activating chain ', addChainParameter);
      await connector.activate(addChainParameter);
    } catch (error) {
      console.log('switch test activation failed ', { error });
      const networkObject =
        chainId === 1 ? NETWORK_DETAILS.MAINNET : NETWORK_DETAILS.BSC;

      console.log('switch test activation failed now adding ', networkObject);
      console.log('switch test adding chain ', networkObject);
      if (chainId === 56) {
        await connector?.provider?.request({
          method: 'wallet_addEthereumChain',
          params: [networkObject],
        });
      } else {
        await connector?.provider?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkObject.chainId }],
        });

        return;
      }
    }
  }
};
