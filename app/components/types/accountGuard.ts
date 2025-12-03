"use client";

import { clearAppState, getFromLocalStorage } from "@/app/utils/reUsableFunction";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAccountGuard = () => {
  const router = useRouter();
  const isAuthenticated = getFromLocalStorage("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      clearAppState();
      router.push("/");
    }
  }, [isAuthenticated, router]);
};