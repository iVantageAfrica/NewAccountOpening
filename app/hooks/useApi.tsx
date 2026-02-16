"use client";

import { useState, useCallback } from "react";
import { toast } from "../components/toast/useToast";
import { clearAppState, getFromLocalStorage } from "../utils/Utility/reUsableFunction";
import { useRouter } from "next/navigation";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const bearerToken = getFromLocalStorage("bearerToken");
  const token = typeof bearerToken === "string" ? bearerToken : undefined;

  const request = useCallback(
    async (endpoint: string, method: Method = "GET", body?: any): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
        const response = await fetch(url, {
          method,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body:
            method === "GET"
              ? undefined
              : body instanceof FormData
              ? body
              : JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || data?.statusCode !== 200) {
          const message = data?.message || "Something went wrong";
          setError(message);
          toast({
            type: "error",
            title: "Error",
            description: message,
          });
          if (data?.error?.statusCode ===501 ) {
            clearAppState();
            router.push("/admin/auth");
          }
        }

        return data;
      } catch (err: any) {
        const message = err?.message || "Something went wrong";
        setError(message);
        toast({
          type: "error",
          title: "Error",
          description: message,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, router]
  );

  return { loading, error, request };
}