import "@/styles/globals.css";

import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "react-hot-toast";

import Loading from "@/components/Loading";
import type { RootLayoutProps } from "@/utils/interfaces";

export const metadata: Metadata = {
  title: "SAUCETOMATE",
  description: "Et si vous deviez voter ?",
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
