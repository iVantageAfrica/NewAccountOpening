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

    const portalReferenceSummary = useCallback(async () => {
        const response = await request("admin/portal-reference-summary")
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

        const portalReferenceList = useCallback(
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
            const response = await request(`admin/portal-reference-list${queryParams}`, "GET");
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

    const accountReferenceExtendedSubmission = useCallback(async (data: any) => {
        const response = await request("account/create-extended-bank-account-reference", "POST", data);
        return response;
    }, [request]);


    const accountReferenceCreation = useCallback(async (data: any) => {
        const response = await request("account/create-bank-account-reference", "POST", data);
        return response;
    }, [request]);

    const accountDocumentAddition = useCallback(async (data: any) => {
        const response = await request("account/account-document-addition", "POST", data);
        return response;
    }, [request]);


    const updateDirectorySignatorySubmission = useCallback(async (data: any) => {
        const response = await request("account/update-directory-signatory-information", "POST", data);
        return response;
    }, [request])

    const businessDocumentSubmission = useCallback(async (data: any) => {
        const response = await request("account/submit-corporate-account-document", "POST", data);
        return response;
    }, [request]);

    const individualAccountUpdate = useCallback(async (data: any) => {
        const response = await request("account/individual-account-update", "POST", data);
        return response;
    }, [request]);

    const accountUpdateLink = useCallback(async (data: any) => {
        const response = await request("admin/account-update-link", "POST", data);
        return response;
    }, [request]);

    const adminForgotPassword = useCallback(async (identifier: string) => {
        const response = await request(`utility/reset-admin-password?emailAddress=${identifier}`)
        return response
    }, [request])

    const adminUpdatePassword = useCallback(async (data: any) => {
        const response = await request("utility/update-admin-password", "POST", data);
        return response;
    }, [request]);

    const listAdmins = useCallback(async () => {
        const response = await request("admin/list-admins", "GET");
        return response.data;
    }, [request]);

    const fetchAdmin = useCallback(async (adminId: string | number) => {
        const response = await request(`admin/fetch-admin?adminId=${adminId}`, "GET");
        return response.data;
    }, [request]);

    const createAdmin = useCallback(async (data: any) => {
        const response = await request("admin/create-admin", "POST", data);
        return response;
    }, [request]);

    const updateAdmin = useCallback(async (adminId: string | number, data: any) => {
        const response = await request(`admin/update-admin/${adminId}`, "PUT", data);
        return response;
    }, [request]);

    const deleteAdmin = useCallback(async (adminId: string | number) => {
        const response = await request(`admin/delete-admin/${adminId}`, "DELETE");
        return response;
    }, [request]);

    const changePassword = useCallback(async (data: any) => {
        const response = await request("admin/change-password", "PUT", data);
        return response;
    }, [request]);

    const listAuditLogs = useCallback(
        async (adminId?: string | number, page?: string, dataLength?: string, pageUrl?: string) => {
            let queryParams = "";
            const params: string[] = [];
            if (adminId && String(adminId) !== 'all') params.push(`adminId=${adminId}`);
            if (pageUrl) {
                const match = pageUrl.match(/[?&]page=(\d+)/);
                if (match) page = match[1];
            }
            if (page && Number(page) > 1) params.push(`page=${page}`);
            if (dataLength === 'all' || (dataLength && Number(dataLength) > 10)) params.push(`dataLength=${dataLength}`);
            if (params.length > 0) queryParams = `?${params.join("&")}`;
            const response = await request(`admin/audit-logs${queryParams}`, "GET");
            return response.data;
        },
        [request]
    );

    const cmoReviewAccount = useCallback(async (data: { accountNumber: string; accountType: string; complianceOfficerId?: string | number }) => {
        const response = await request("admin/review-account", "POST", data);
        return response;
    }, [request]);

    const cmoFlagAccount = useCallback(async (data: { accountNumber: string; accountType: string; reason?: string }) => {
        const response = await request("admin/flag-account", "POST", data);
        return response;
    }, [request]);

    const complianceApproveAccount = useCallback(async (data: { accountNumber: string; accountType: string }) => {
        const response = await request("admin/approve-account", "POST", data);
        return response;
    }, [request]);

    const complianceFlagAccount = useCallback(async (data: { accountNumber: string; accountType: string; reason?: string }) => {
        const response = await request("admin/flag-account-for-compliance", "POST", data);
        return response;
    }, [request]);

    const listComplianceOfficers = useCallback(async () => {
        const response = await request("admin/compliance-officers", "GET");
        return response;
    }, [request]);

    const awaitingComplianceReview = useCallback(async () => {
        const response = await request("admin/awaiting-compliance-review", "GET");
        return response.data;
    }, [request]);

    const complianceReviewSummary = useCallback(async () => {
        const response = await request("admin/compliance-review-summary", "GET");
        return response.data;
    }, [request]);

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
        fetchCorporateAccount,
        accountDocumentAddition,
        individualAccountUpdate,
        accountUpdateLink,
        adminForgotPassword,
        adminUpdatePassword,
        accountReferenceExtendedSubmission,
        portalReferenceSummary,
        portalReferenceList,
        listAdmins,
        fetchAdmin,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        changePassword,
        listAuditLogs,
        cmoReviewAccount,
        cmoFlagAccount,
        complianceApproveAccount,
        complianceFlagAccount,
        listComplianceOfficers,
        awaitingComplianceReview,
        complianceReviewSummary
    }
}