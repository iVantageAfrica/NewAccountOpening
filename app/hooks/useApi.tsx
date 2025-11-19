"use client";

import { useState, useCallback } from "react";
import { toast } from "../components/toast/useToast";
import { useAppStore } from "../store/appStore";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bearerToken = useAppStore((state) => state.get("bearerToken"));
  const token = typeof bearerToken === "string" ? bearerToken : undefined;

  const request = useCallback(async (
    endpoint: string, 
    method: Method = "GET", 
    body?: any,
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    const url = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;

    const response = await fetch(url, {
      method,
      headers: {
        ...(token && {Authorization: `Bearer ${token}`}),
      },
      body: method === "GET" 
      ? undefined 
      : (body instanceof FormData ? body : JSON.stringify(body)),
    });
    
    const data = await response.json().catch(() => null);

    if (!response.ok || data?.statusCode === false || data?.statusCode !== 200) {
      const message = data?.message || "Something went wrong";
      setError(message);
      toast({
        type:"error",
        title: "Error",
        description: message,
      });
      setLoading(false);
    }

    setLoading(false);
    return data;
  }, [token]);

  return { loading, error, request };
}