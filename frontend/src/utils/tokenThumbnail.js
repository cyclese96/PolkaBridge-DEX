import corgibImg from "../assets/corgi.png";
import pwarImg from "../assets/pwar.png";
import bite from "../assets/bite.png";
import pbrImg from "../assets/balance.png";
import etherImg from "../assets/etherNew.png";
import bnbImg from "../assets/binance.png";
import noIcon from "../assets/no_icon.png";
import usdtImg from "../assets/usdt.png";
import usdcImg from "../assets/usdc.png";
import inch from "../assets/1inch.svg";
import aave from "../assets/aave.svg";
import bal from "../assets/bal.svg";
import dai from "../assets/dai.png";
import matic from "../assets/matic.png";
import ant from "../assets/ant.png";
import amp from "../assets/amp.svg";

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
  "1INCH": inch,
  DAI: dai,
  AAVE: aave,
  BAL: bal,
  MATIC: matic,
  AMP: amp,
  ANT: ant,
};

export default (symbol) => {
  const iconImg = symbolMapping[symbol];
  return iconImg ? iconImg : noIcon;
};
