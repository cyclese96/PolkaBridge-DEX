import axios from "axios";
import { currentConnection } from "../constants";

// downlaod abi from network
export const fetchContractAbi = async (address, network) => {
  try {
    const _api =
      currentConnection === "testnet"
        ? `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split('').reverse().join('')}`
        : `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split('').reverse().join('')}`;

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
    const _api = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split('').reverse().join('')}`;
    const test_api = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split('').reverse().join('')}`;
    console.log("api", test_api);
    const res = await axios.get(
      currentConnection === "testnet" ? test_api : _api
    );
    // console.log("fetchTokenInfo api res ", res.data);
    const data = res.data;
    if (data.status !== "1") {
      return {};
    }
    return data;
  } catch (error) {
    console.log("fetchTokenInfo", error);
    return {};
  }
};
