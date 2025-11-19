"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/app/store/appStore";

export const useAccountGuard = () => {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.store.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
};