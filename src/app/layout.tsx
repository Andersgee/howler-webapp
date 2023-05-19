import "./globals.css";
import { UserProvider } from "src/context/UserContext";
import { Inter } from "next/font/google";
import { DialogProvider } from "src/context/DialogContext";
import { ServiceWorkerProvider } from "src/context/ServiceWorker";
import { Topnav } from "./Topnav";
import { seo } from "src/utils/seo";

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
        <ServiceWorkerProvider>
          <UserProvider>
            <DialogProvider>
              <Topnav />
              {children}
            </DialogProvider>
          </UserProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
