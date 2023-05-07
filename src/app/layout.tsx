import "./globals.css";
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
        <div className="p-2 ">
          <h2>layout: /layout.tsx</h2>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
