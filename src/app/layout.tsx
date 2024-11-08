import "@/styles/globals.css";

import { type Metadata } from "next";

// import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "AIsthetics",
  description:
    "AIsthetics is a tool to help you understand the aesthetics of AI.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <Toaster position="top-right" />

          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
