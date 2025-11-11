import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "./apiClient";
import type { AxiosError } from "axios";

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function proxyHandler(
    req: NextRequest,
    endPoint: string,
    method: Method = 'GET',
    contentType?: string 
) {
    const payload = method === 'GET' ? null : await req.json();
    const authHeader = req.headers.get("authorization");

    try {
        const response = await apiClient(contentType).request({
            url: endPoint,
            method,
            data: payload,
            headers: {
                ...(authHeader && {Authorization: authHeader})
            }
        });

        return NextResponse.json(response.data);
    } 
    catch (error: unknown) {
        const axiosError = error as AxiosError;
        const apiData = axiosError.response?.data as {statusCode?:number; message?:string} | undefined;
        const statusCode = apiData?.statusCode ?? axiosError.response?.status ?? 500;
        const message = apiData?.message ?? 'Server Down, Unable to Connect';

        return NextResponse.json(
            { message, error: apiData || axiosError.message },
            { status: statusCode }
        );
    }
}