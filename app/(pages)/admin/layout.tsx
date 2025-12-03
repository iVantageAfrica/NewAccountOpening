"use client";
import { usePathname } from "next/navigation";
import AdminLayout from "@/app/components/adminLayout/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/auth")) {
    return <>{children}</>;
  }
  return <AdminLayout>{children}</AdminLayout>;
}