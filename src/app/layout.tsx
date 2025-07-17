import "~/styles/globals.css";

import {
  ClerkProvider
} from "@clerk/nextjs";
import { type Metadata } from "next";
import { Roboto_Flex as FontSans } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import Script from "next/script";

const fontSans = FontSans({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "COORD.TRAVEL",
  description: "DMC Web App for COORD.TRAVEL",
  icons: [{ rel: "icon", url: "/favicon.svg", sizes: "50px" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#287F71",
        },
      }}
    >
      <html lang="en" className={`${fontSans.variable}`}>
        <head>
          <Script
            type="text/javascript"
            src="https://www.payhere.lk/lib/payhere.js"
            async
          ></Script>
        </head>

        <body>
          <div className="h-screen w-screen">{children}</div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
    // <html lang="en" className={`${fontSans.variable}`}>
    //   <body>
    //     <div>{children}</div>
    //     <Toaster/>
    //   </body>
    // </html>
  );
}
