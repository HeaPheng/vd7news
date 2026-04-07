import "./globals.css";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import PostPopupAd from "../src/components/PostPopupAd";
import { Hanuman, Roboto } from "next/font/google";

const hanuman = Hanuman({
  subsets: ["khmer"],
  weight: ["400", "700"],
  variable: "--font-khmer",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-english",
});

export const metadata = {
  title: "VD7 News",
  description: "Latest news platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km">
      <body
        className={`${hanuman.variable} ${roboto.variable} bg-[#060b16] text-white`}
      >
        <Header />

        {/* ✅ GLOBAL POPUP (ALL PAGES) */}
        <PostPopupAd />

        {children}

        <Footer />
      </body>
    </html>
  );
}