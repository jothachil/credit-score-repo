import localFont from "next/font/local";
import "./globals.css";
import DebugNavigationSidebar from "./components/DebugNavigationSidebar";
import { ToastProvider } from "./components/Toast";

const lufga = localFont({
  src: [
    {
      path: "../public/fonts/LufgaRegular/font.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/LufgaItalic/font.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/LufgaMedium/font.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/LufgaSemiBold/font.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/LufgaBold/font.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/LufgaExtraBold/font.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/LufgaBlack/font.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-lufga",
});

export const metadata = {
  title: "Prototype",
  description: "A new prototype",
};

// WebView-friendly viewport: cover the safe areas (notch / home indicator) so
// we can pad bars with env(safe-area-inset-*), and lock zoom for an app feel.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lufga.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>
          <div className="flex min-h-dvh flex-col items-center bg-zinc-200">
            <main className="relative flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
              {children}
            </main>
          </div>
          {process.env.NODE_ENV !== "production" && <DebugNavigationSidebar />}
        </ToastProvider>
      </body>
    </html>
  );
}
