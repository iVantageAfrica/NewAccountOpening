"use client";

import { useRouter } from "next/navigation";
import { useEffect, } from "react";
import { clearAppState, getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";

export const useAdminGuard = () => {
  const router = useRouter();
  const isAdministrative = getFromLocalStorage("isAdministrative");
  useEffect(() => {
    if (!isAdministrative) {
      clearAppState();
      router.push("/admin/auth");
    }
  }, [isAdministrative, router]);
}