"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
