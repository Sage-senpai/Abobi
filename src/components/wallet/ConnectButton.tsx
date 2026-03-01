"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from "wagmi";
import { ogGalileoTestnet } from "@/lib/wallet/config";

export function ConnectButton() {
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                disabled={!ready}
                className="px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-200"
              >
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={() => switchChain({ chainId: ogGalileoTestnet.id })}
                disabled={isSwitching}
                className="px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-200"
              >
                {isSwitching ? "Switching..." : "Switch to 0G"}
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#0F172A] hover:border-[#DC2626] hover:text-[#DC2626] transition-all shadow-sm"
              >
                {chain.hasIcon && chain.iconUrl && (
                  <img
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                <span className="max-w-[120px] truncate">{account.displayName}</span>
                <svg className="w-3 h-3 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
