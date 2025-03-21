import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./_context/GlobalContext";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jay Postones",
  description: "The personal website of drummer and educator, Jay Postones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.className} flex flex-col min-h-screen`}>
        <GlobalProvider>
          <SpeedInsights />
          <Header />
          <main className="flex-grow bg-[var(--primary-color)] flex flex-col justify-between">
            {children}
          </main>
          <Footer />
        </GlobalProvider>
      </body>
    </html>
  );
}
