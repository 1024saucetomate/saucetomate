import { headers } from "next/headers";

interface IpHeaders {
  forwarded: string | null;
  real: string | null;
}

export const getIp = async (): Promise<string | null> => {
  const headersList = await headers();
  const ipHeaders: IpHeaders = {
    forwarded: headersList.get("x-forwarded-for"),
    real: headersList.get("x-real-ip"),
  };

  return ipHeaders.forwarded ? ipHeaders.forwarded.split(",")[0].trim() : ipHeaders.real ? ipHeaders.real.trim() : null;
};
