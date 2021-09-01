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
import axs from "../assets/axs.png";
import bat from "../assets/bat.png";
import comp from "../assets/comp.png";
import crv from "../assets/crv.png";
import grt from "../assets/grt.png";
import knc from "../assets/knc.png";
import mana from "../assets/mana.png";
import mkr from "../assets/mkr.png";
import nexo from "../assets/nexo.png";
import pax from "../assets/pax.png";
import rune from "../assets/rune.png";
import sand from "../assets/sand.png";
import shib from "../assets/shib.png";
import uni from "../assets/UNI.png";
import wbtc from "../assets/wbtc.png";
import wdoge from "../assets/wdoge.png";
import yfi from "../assets/yfi.png";
import zrx from "../assets/zrx.png";

const symbolMapping = {
  NEXO: nexo,
  PAX: pax,
  RUNE: rune,
  SAND: sand,
  SHIB: shib,
  UNI: uni,
  WBTC: wbtc,
  WDOGE: wdoge,
  YFI: yfi,
  ZRX: zrx,
  AXS: axs,
  MKR: mkr,
  KNC: knc,
  GRT: grt,
  CRV: crv,
  COMP: comp,
  BAT: bat,
  MANA: mana,
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
