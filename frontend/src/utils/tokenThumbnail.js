import corgibImg from "../assets/corgi.png";
import pwarImg from "../assets/pwar.png";
import bite from "../assets/bite.png";
import pbrImg from "../assets/balance.png";
import etherImg from "../assets/etherNew.png";
import bnbImg from "../assets/binance.png";
import noIcon from "../assets/no_icon.png";
import usdtImg from "../assets/usdt.png";
import usdcImg from "../assets/usdc.png";

const symbolMapping = {
  ETH: etherImg,
  BNB: bnbImg,
  PWAR: pwarImg,
  CORGIB: corgibImg,
  PBR: pbrImg,
  BITE: bite,
  CFL365: "",
  USDT: usdtImg,
  USDC: usdcImg,
  WETH: "",
};

export default (symbol) => {
  const iconImg = symbolMapping[symbol];
  return iconImg ? iconImg : noIcon;
};
