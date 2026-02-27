import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/toast/useToast";

export const metadata: Metadata = {
  title: "Account Opening",
  description: "Powered by iVantage",
  icons: {
    icon: "/images/imperialLogo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
