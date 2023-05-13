import "./globals.css";
import { UserProvider } from "src/context/UserContext";
import { Inter } from "next/font/google";
import { SignInDialog } from "./SigninDialog";
import { DialogProvider } from "src/context/DialogContext";
import { ServiceWorkerProvider } from "src/context/ServiceWorker";

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
              <SignInDialog />
              <div className="flex flex-col justify-between">
                <div className="flex justify-end">
                  <a href="/profile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 m-1 text-neutral-800 hover:text-neutral-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
                <div>{children}</div>
              </div>
            </DialogProvider>
          </UserProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
