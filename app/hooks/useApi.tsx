"use client";

import { useState, useCallback } from "react";
import { toast } from "../components/toast/useToast";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const request = useCallback(async (endpoint: string, method: Method = "GET", body?: any): Promise<T> => {
    setLoading(true);
    setError(null);

    const url = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "GET" ? undefined : JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message || "Something went wrong";
      setError(message);
      toast({
        title: "Error",
        description: message,
      });
      setLoading(false);
    }

    setLoading(false);
    return data;
  }, []);

  return { loading, error, request };
}