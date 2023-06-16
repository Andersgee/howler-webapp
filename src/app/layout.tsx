import { Inter } from "next/font/google";

import { DialogProvider } from "#src/context/DialogContext";
import { NotificationsProvider } from "#src/context/NotificationsContext";
import { TrpcProvider } from "#src/context/Trpc";
import { UserProvider } from "#src/context/UserContext";
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
      <body className={inter.className}>
        <UserProvider>
          <NotificationsProvider>
            <DialogProvider>
              <TrpcProvider>
                <Topnav />
                {children}
              </TrpcProvider>
            </DialogProvider>
          </NotificationsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
