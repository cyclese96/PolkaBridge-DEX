import WalletConnectProvider from "@walletconnect/web3-provider";

const provider = new WalletConnectProvider({
  infuraId: "8bcf728cb2074a07a3f3d8069cf8c855",
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trust'],
  },
});

export default provider;
