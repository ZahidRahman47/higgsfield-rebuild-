import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import TopBar from "@/components/TopBar";
import Footer from "@/components/landing/Footer";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const display = Archivo({ variable: "--font-display", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: "Higgsfield Rebuild — AI image & video studio",
  description: "Create AI images and motion videos. 100 free credits every day, no sign-up wall.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <Providers>
          <TopBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
