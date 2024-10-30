import "@/styles/globals.css";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import Loading from "@/components/Loading";

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
        <Loading />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
