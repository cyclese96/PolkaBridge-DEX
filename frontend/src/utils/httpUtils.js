import axios from "axios";
import { currentConnection } from "../constants/index";

// downlaod abi from network

export const fetchTokenInfo = async (address) => {
  try {
    const _api = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split(
      ""
    )
      .reverse()
      .join("")}`;
    const test_api = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHER_SCAN_API.split(
      ""
    )
      .reverse()
      .join("")}`;
    const res = await axios.get(
      currentConnection === "testnet" ? test_api : _api
    );

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
