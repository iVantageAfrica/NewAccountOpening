import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/toast/useToast";

export const metadata: Metadata = {
  title: "Account Opening",
  description: "Powered by iVantage",

  icons: {
    icon: "https://www.imperialmortgagebank.com/assets/img/imperial_logo.png",
    shortcut: "https://www.imperialmortgagebank.com/assets/img/imperial_logo.png",
    apple: "https://www.imperialmortgagebank.com/assets/img/imperial_logo.png",
  },

  openGraph: {
    title: "Account Opening",
    description: "Powered by iVantage",
    url: "https://yourdomain.com",
    siteName: "Account Opening",
    images: [
      {
        url: "https://www.imperialmortgagebank.com/assets/img/imperial_logo.png",
        width: 1200,
        height: 630,
        alt: "Imperial Mortgage Bank",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Account Opening",
    description: "Powered by iVantage",
    images: [
      "https://www.imperialmortgagebank.com/assets/img/imperial_logo.png",
    ],
  },
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
