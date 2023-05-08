import "./globals.css";
import { UserProvider } from "src/context/UserContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "default title",
  description: "default description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="p-2 ">
            <h2>layout: /layout.tsx</h2>
            <div>{children}</div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
