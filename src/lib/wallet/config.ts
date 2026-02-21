import { defineChain, http } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  subWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

// ─── 0G Galileo Testnet chain definition ─────────────────────────────────────
export const ogGalileoTestnet = defineChain({
  id: 16602,
  name: "0G-Galileo-Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: {
      name: "0G Scan",
      url: "https://chainscan-galileo.0g.ai",
    },
  },
  testnet: true,
});

// ─── Wagmi + RainbowKit config ────────────────────────────────────────────────
const walletConnectProjectId = (
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""
).trim();
const hasWalletConnectProjectId = walletConnectProjectId.length > 0;

const walletGroups = [
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet,
      okxWallet,
      subWallet,
      phantomWallet,
      ...(hasWalletConnectProjectId ? [walletConnectWallet] : []),
      injectedWallet,
    ],
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: "Abobi",
  projectId: hasWalletConnectProjectId
    ? walletConnectProjectId
    : "00000000000000000000000000000000",
  chains: [ogGalileoTestnet],
  wallets: walletGroups,
  transports: {
    [ogGalileoTestnet.id]: http("https://evmrpc-testnet.0g.ai"),
  },
  ssr: false,
  multiInjectedProviderDiscovery: true,
});
