import type { Metadata } from "next";
import "@/styles/globals.css";
import React from "react";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "SAUCETOMATE",
  description: "Et si vous deviez voter ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
