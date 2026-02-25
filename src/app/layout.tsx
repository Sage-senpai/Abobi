import type { Metadata, Viewport } from "next";
import { ClientProviders } from "./client-providers";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import "./globals.css";
// Using system fonts — avoids Google Fonts network requirement during build.
// CSS --font-sans falls back to system-ui in globals.css.

export const metadata: Metadata = {
  title: "Abobi Legal — AI Immigration Advisor",
  description:
    "Multilingual AI immigration advisor. Get guidance on visas, asylum, work permits, and family reunification — powered by 0G decentralized compute.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Abobi Legal",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
