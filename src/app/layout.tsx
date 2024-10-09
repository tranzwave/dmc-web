import "~/styles/globals.css";

import {
  ClerkProvider
} from "@clerk/nextjs";
import { type Metadata } from "next";
import { Roboto_Flex as FontSans } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";

const fontSans = FontSans({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "COORD.TRAVEL",
  description: "DMC Web App for COORD.TRAVEL",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
