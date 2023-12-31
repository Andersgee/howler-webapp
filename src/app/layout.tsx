import { Providers } from "#src/context";
import { seo } from "#src/utils/seo";
import { Topnav } from "./Topnav";
import "./globals.css";
//import { Suspense } from "react";
//import { NavigationEvents } from "#src/components/NavigationEvents";
import { GoogleMapPortal, GoogleMapsScript } from "#src/components/GoogleMap";
import { ScreenSizeIndicator } from "#src/components/ScreenSizeIndicator";
import { Toaster } from "#src/context/Toaster";
import { fontSans } from "#src/utils/font";

export const metadata = seo({
  title: "Howler",
  description:
    "Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/",
  image: "/howler.png",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontSans.variable}>
        <Providers>
          <Topnav />
          {children}
          {/*
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
          */}
        </Providers>
        <ScreenSizeIndicator />
        <Toaster />
        <GoogleMapPortal />
      </body>
      <GoogleMapsScript />
    </html>
  );
}
