"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { GradientButton } from "@/components/ui/GradientButton";

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
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
              <GradientButton size="lg" onClick={openConnectModal} disabled={!ready}>
                Connect Wallet
              </GradientButton>
            ) : chain.unsupported ? (
              <GradientButton
                size="md"
                onClick={openChainModal}
                className="from-red-700 to-red-500"
              >
                Wrong Network
              </GradientButton>
            ) : (
              <button
                onClick={openAccountModal}
                className="glass-sm px-4 py-2 text-sm font-medium text-white flex items-center gap-2 transition-all hover:bg-white/10"
              >
                {chain.hasIcon && chain.iconUrl && (
                  <img
                    alt={chain.name ?? "Chain icon"}
                    src={chain.iconUrl}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                {account.displayName}
              </button>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
