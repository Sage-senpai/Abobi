import type { Metadata, Viewport } from "next";
import { ClientProviders } from "./client-providers";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import "./globals.css";
// Using system fonts — avoids Google Fonts network requirement during build.
// CSS --font-sans falls back to system-ui in globals.css.

export const metadata: Metadata = {
  title: "Abobi — Your Pidgin AI Bro",
  description:
    "Abobi na decentralized Pidgin-speaking AI bro. Privacy-first, Web3-native, culturally yours.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Abobi",
  },
};

export const viewport: Viewport = {
  themeColor: "#4C1D95",
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
    <html lang="en" className="dark">
      <body className="antialiased">
        <ErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
