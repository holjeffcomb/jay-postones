import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { Inter, Raleway } from "next/font/google";
import "./globals.css";

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
      <body className={raleway.className}>
        <Header />
        <main className="flex flex-col justify-center align-center">
          {children} {/* This is where the BackgroundVideo and content go */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
