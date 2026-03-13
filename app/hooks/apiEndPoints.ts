import { useCallback } from "react"
import { useApi } from "./useApi";
import { toast } from "../components/toast/useToast";
import { LoginSchema } from "../utils/validationSchema/loginSchema";

export const useApiEndPoints = () => {
    const { request, loading, error } = useApi();

    const verifyUserBvn = useCallback(async (bvn: string, accountTypeId: string) => {
        const response = await request(`utility/verify-bvn?bvn=${bvn}&accountTypeId=${accountTypeId}`)
        return response
    }, [request]);

    const resendBVNOTPCode = useCallback(async (identifier: string) => {
        const response = await request(`utility/request-otp?identifier=${identifier}&purpose=BVN`)
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

    const createIndividualAccount = useCallback(async (data: any) => {
        const response = await request("account/create-individual-account", "POST", data);
        return response;
    }, [request])

    const createPosMerchantAccount = useCallback(async (data: any) => {
        const response = await request("account/create-pos-account", "POST", data);
        return response;
    }, [request])

    const createCorporateAccount = useCallback(async (data: any) => {
        const response = await request("account/create-corporate-account", "POST", data);
        return response;
    }, [request])

    const adminLogin = useCallback(async (data: LoginSchema) => {
        const response = await request("admin/login", "POST", data)
        return response;
    }, [request])

    const customerSummaryList = useCallback(async () => {
        const response = await request("admin/customer-summary")
        return response.data
    }, [request]);

    const savingsAccountSummary = useCallback(async () => {
        const response = await request("admin/savings-account-summary");
        return response.data;
    }, [request]);

    const currentAccountSummary = useCallback(async () => {
        const response = await request("admin/current-account-summary");
        return response.data;
    }, [request]);

    const corporateAccountSummary = useCallback(async () => {
        const response = await request("admin/corporate-account-summary");
        return response.data;
    }, [request]);

       const posAccountSummary = useCallback(async () => {
        const response = await request("admin/pos-account-summary");
        return response.data;
    }, [request]);

    const listAllCustomer = useCallback(
        async (page?: string, search?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }

            if (Number(page) > 1) {
                queryParams = `?page=${page}${search ? `&search=${search}` : ""}`;
            } else if (dataLength === 'all' || Number(dataLength) > 10) {
                queryParams = `?dataLength=${dataLength}${search ? `&search=${search}` : ""}`;
            } else if (search) {
                queryParams = `?search=${search}`;
            }

            const response = await request(`admin/customer-list${queryParams}`, "GET");
            return response.data;
        },
        [request]
    );

    const savingsAccountList = useCallback(
        async (page?: string, search?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }

            if (Number(page) > 1) {
                queryParams = `?page=${page}${search ? `&search=${search}` : ""}`;
            } else if (dataLength === 'all' || Number(dataLength) > 10) {
                queryParams = `?dataLength=${dataLength}${search ? `&search=${search}` : ""}`;
            } else if (search) {
                queryParams = `?search=${search}`;
            }
            const response = await request(`admin/savings-account-list${queryParams}`, "GET");
            return response.data
        },
        [request]
    )

    const currentAccountList = useCallback(
        async (page?: string, search?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }

            if (Number(page) > 1) {
                queryParams = `?page=${page}${search ? `&search=${search}` : ""}`;
            } else if (dataLength === 'all' || Number(dataLength) > 10) {
                queryParams = `?dataLength=${dataLength}${search ? `&search=${search}` : ""}`;
            } else if (search) {
                queryParams = `?search=${search}`;
            }
            const response = await request(`admin/current-account-list${queryParams}`, "GET");
            return response.data
        },
        [request]
    )

    const corporateAccountList = useCallback(
        async (page?: string, search?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }

            if (Number(page) > 1) {
                queryParams = `?page=${page}${search ? `&search=${search}` : ""}`;
            } else if (dataLength === 'all' || Number(dataLength) > 10) {
                queryParams = `?dataLength=${dataLength}${search ? `&search=${search}` : ""}`;
            } else if (search) {
                queryParams = `?search=${search}`;
            }
            const response = await request(`admin/corporate-account-list${queryParams}`, "GET");
            return response.data
        },
        [request]
    )

        const posAccountList = useCallback(
        async (page?: string, search?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }

            if (Number(page) > 1) {
                queryParams = `?page=${page}${search ? `&search=${search}` : ""}`;
            } else if (dataLength === 'all' || Number(dataLength) > 10) {
                queryParams = `?dataLength=${dataLength}${search ? `&search=${search}` : ""}`;
            } else if (search) {
                queryParams = `?search=${search}`;
            }
            const response = await request(`admin/pos-account-list${queryParams}`, "GET");
            return response.data
        },
        [request]
    )

    const fetchIndividualAccount = useCallback(async (accountNumber: string) => {
        const response = await request(`admin/fetch-individual-account?accountNumber=${accountNumber}`, "GET");
        return response.data;
    },
        [request]
    );


    const fetchCorporateAccount = useCallback(async (accountNumber: string) => {
        const response = await request(`admin/fetch-corporate-account?accountNumber=${accountNumber}`, "GET");
        return response.data;
    },
        [request]
    );

    const debitCardRequest = useCallback(async () => {
        const response = await request("admin/debit-card-requests");
        return response.data;
    }, [request]);

    const addBankAccountReference = useCallback(async (data: any) => {
        const response = await request("account/add-bank-account-reference", "POST", data);
        return response;
    }, [request]);

    const accountReferenceSubmission = useCallback(async (data: any) => {
        const response = await request("account/update-bank-account-reference", "POST", data);
        return response;
    }, [request]);


    const accountReferenceCreation = useCallback(async (data: any) => {
        const response = await request("account/create-bank-account-reference", "POST", data);
        return response;
    }, [request]);


    const updateDirectorySignatorySubmission = useCallback(async (data: any) => {
        const response = await request("account/update-directory-signatory-information", "POST", data);
        return response;
    }, [request])

    const businessDocumentSubmission = useCallback(async (data: any) => {
        const response = await request("account/submit-corporate-account-document", "POST", data);
        return response;
    }, [request])


    return {
        loading,
        error,
        verifyUserBvn,
        resendBVNOTPCode,
        otpVerification,
        createIndividualAccount,
        createPosMerchantAccount,
        createCorporateAccount,
        accountReferenceCreation,
        listAllCustomer,
        customerSummaryList,
        adminLogin,
        savingsAccountList,
        savingsAccountSummary,
        posAccountSummary,
        currentAccountSummary,
        currentAccountList,
        fetchIndividualAccount,
        debitCardRequest,
        addBankAccountReference,
        accountReferenceSubmission,
        updateDirectorySignatorySubmission,
        businessDocumentSubmission,
        corporateAccountSummary,
        corporateAccountList,
        posAccountList,
        fetchCorporateAccount
    }
}