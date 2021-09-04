import axios from "axios";
import { currentConnection } from "../constants";

// downlaod abi from network
export const fetchContractAbi = async (address, network) => {
  try {
    const _api =
      currentConnection === "testnet"
        ? `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_RINKEBY_API}`
        : `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API}`;

    // const _api = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API}`;

    const res = await axios.get(_api);
    const data = res.data;
    if (data.status === "1") {
      return JSON.parse(data.result);
    }
    return [];
  } catch (error) {
    console.log("fetchTokenAbi", error);
    return [];
  }
};

export const fetchTokenInfo = async (address) => {
  try {
    const _api = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API}`;
    const res = await axios.get(_api);
    console.log("api res ", res.data);
    return res.data;
  } catch (error) {
    console.log("fetchTokenInfo", error);
    return {};
  }
};
