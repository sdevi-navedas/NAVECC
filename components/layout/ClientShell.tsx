"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UseCaseBar from "./UseCaseBar";
import Footer from "./Footer";

const BARE_PATHS = ["/login", "/setup"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [ready,  setReady]  = useState(false);

  const isBare = BARE_PATHS.some(p => pathname.startsWith(p));

  useEffect(() => {
    if (isBare) {
      setReady(true);
      return;
    }
    const authed = typeof window !== "undefined" &&
      sessionStorage.getItem("navedas_auth") === "true";
    if (!authed) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [pathname, isBare, router]);

  if (!ready) return null;

  if (isBare) return <>{children}</>;

  return (
    <>
      <Navbar />
      <Sidebar />
      <UseCaseBar />
      <Footer />
      <main
        style={{
          marginLeft: 56,
          marginTop: 88,
          marginBottom: 32,
          minHeight: "calc(100vh - 88px - 32px)",
          backgroundColor: "#FFFFFF",
          padding: "20px 24px 20px 16px",
        }}
      >
        {children}
      </main>
    </>
  );
}
