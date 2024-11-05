import "@/styles/globals.css";

import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";

import Loading from "@/components/Loading";
import type { RootLayoutProps } from "@/utils/interfaces";

export const metadata: Metadata = {
  title: "SAUCETOMATE",
  description: "Et si vous deviez voter ?",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://saucetomate.xyz",
    title: "SAUCETOMATE",
    description: "Et si vous deviez voter ?",
    images: [
      {
        url: "https://saucetomate.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "SAUCETOMATE",
      },
    ],
  },
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>): JSX.Element => {
  return (
    <html lang="fr">
      <body>
        <NuqsAdapter>
          <Loading />
          <Toaster />
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;
