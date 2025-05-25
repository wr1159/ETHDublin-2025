import { http, createConfig } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "LockedIn",
      preference: "smartWalletOnly",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

export const CHAIN_CONFIG = {
  development: baseSepolia,
  production: base,
};

export const getCurrentChain = () => {
  return process.env.NODE_ENV === "production"
    ? CHAIN_CONFIG.production
    : CHAIN_CONFIG.development;
};
