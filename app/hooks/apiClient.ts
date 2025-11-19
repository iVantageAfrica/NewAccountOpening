import axios from "axios";

export const apiClient = (contentType?: string) => axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BASE_URL,
  headers: {
    ...(contentType && { "Content-Type": contentType }),
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  }
});