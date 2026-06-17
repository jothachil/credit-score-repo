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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lufga.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>
          <div className="flex min-h-dvh flex-col items-center bg-zinc-200">
            <main className="relative flex min-h-dvh w-full max-w-[400px] flex-col bg-white border-l border-r border-zinc-200">
              {children}
            </main>
          </div>
          <DebugNavigationSidebar />
        </ToastProvider>
      </body>
    </html>
  );
}
