import { useCallback } from "react"
import { useApi } from "./useApi";
import { toast } from "../components/toast/useToast";

export const useApiEndPoints = () => {
    const { request, loading, error } = useApi();

    const verifyUserBvn = useCallback(async (bvn: string) => {
        const response = await request(`utility/verify-bvn?bvn=${bvn}`)
        return response
    }, [request]);

    const resendBVNOTPCode = useCallback(async (email: string) => {
        const response = await request(`utility/request-otp?emailAddress=${email}&purpose=BVN`)
        return response
    }, [request])

    const otpVerification = useCallback(async (otp: string) => {
        const response = await request(`utility/verify-otp?otpCode=${otp}`)
        if (response.statusCode === 200) {
            toast({
                type: "success",
                title: "BVN Verified Successfully",
                description: 'Your identity has been confirmed !!!',
            })
        }
        return response;
    }, [request])

    return {
        loading,
        error,
        verifyUserBvn,
        resendBVNOTPCode,
        otpVerification
    }
}