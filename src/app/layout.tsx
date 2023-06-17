import { Inter } from "next/font/google";
import { Providers } from "#src/context";
import { seo } from "#src/utils/seo";
import { Topnav } from "./Topnav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = seo({
  title: "Howler",
  description:
    "Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/",
  image: "/icons/favicon-512x512.png",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          <Topnav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
