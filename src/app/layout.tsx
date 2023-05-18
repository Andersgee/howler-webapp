import "./globals.css";
import { UserProvider } from "src/context/UserContext";
import { Inter } from "next/font/google";
import { DialogProvider } from "src/context/DialogContext";
import { ServiceWorkerProvider } from "src/context/ServiceWorker";
import { Topnav } from "./Topnav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "default title",
  description: "default description",
};

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
