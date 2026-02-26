"use client"
import DashboardStatCard from "@/app/components/ui/dashboardCard";
import DataTable from "@/app/components/ui/dataTable";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { CustomerCorporateAccount, POSAccountState } from "@/app/utils/Utility/Interfaces";
import { Eye, UserCheck, UserCog, UserPen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const POSAccount = () => {
    const router = useRouter();
    const { posAccountList, posAccountSummary, loading } = useApiEndPoints();
    const [state, setState] = useState<POSAccountState>({
        customerPosAccount: [],
        dashboardSummary: {},
        totalRecords: 0,
        currentPage: 1,
        entriesPerPage: 10,
        searchQuery: "",
        nextUrl: null,
        prevUrl: null,
    })

    const fetchPosAccount = useCallback(
        async (page = 1, search = "", perPage = 10, pageUrl?: string) => {
            const perPageNo = typeof perPage === "string" && perPage === "all" ? 0 : perPage;
            const { data = [], pagination = {} } = await posAccountList(page.toString(), search, perPageNo.toString(), pageUrl);
            setState((prev) => ({
                ...prev,
                customerPosAccount: data,
                totalRecords: pagination.total ?? 0,
                nextUrl: pagination.next_page_url ?? null,
                prevUrl: pagination.prev_page_url ?? null,
            }))
        },
        [posAccountList]
    );

    const dashboardSummary = useCallback(async () => {
        const summaryResult = await posAccountSummary();
        setState((prev) => ({ ...prev, dashboardSummary: summaryResult }))
    }, [posAccountSummary]);

    useEffect(() => {
        (async () => {
            await dashboardSummary();
            const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;
            await fetchPosAccount(state.currentPage, state.searchQuery, perPage);
        })();
    }, [state.currentPage, state.searchQuery, state.entriesPerPage,state.totalRecords, dashboardSummary, fetchPosAccount]);


    const handlePageChange = (direction: "next" | "prev") => {
         const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;

        if (direction === "next" && state.nextUrl)
            fetchPosAccount(undefined, state.searchQuery, perPage, state.nextUrl);
        if (direction === "prev" && state.prevUrl)
            fetchPosAccount(undefined, state.searchQuery, perPage, state.prevUrl);
    };


    return (
        <div>
            <Spinner loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6  mb-8 mt-4">
                <DashboardStatCard icon={<Users />}
                    iconBg="bg-primary/50"
                    iconColor="text-primary"
                    label="Total Account"
                    value={state.dashboardSummary?.totalAccount} />

                <DashboardStatCard icon={<UserCheck />}
                    iconBg="bg-blue-500/50"
                    iconColor="text-blue-500"
                    label="Activated Account"
                    value={state.dashboardSummary?.approvedAccount} />
                <DashboardStatCard icon={<UserPen />}
                    iconBg="bg-purple-500/50"
                    iconColor="text-purple-500"
                    label="Awaiting Account"
                    value={state.dashboardSummary?.awaitingAccount} />
                <DashboardStatCard icon={<UserCog />}
                    iconBg="bg-green-500/50"
                    iconColor="text-green-500"
                    label="Pending Account"
                    value={state.dashboardSummary?.pendingAccount} />
            </div>

            <DataTable
                tableTitle="Customer list"
                data={state.customerPosAccount}
                columns={[
                    { key: "accountNumber", label: "Account Number" },
                    { key: "companyName", label: "Company Name" },
                    { key: "companyType", label: "Company Type" },
                    { key: "tin", label: "TIN" },
                    { key: "registrationNumber", label: "Registration Number" },
                    { key: "city", label: "City" },
                    { key: "status", label: "Status" },
                    { key: "createdAt", label: "DATE" },
                ]}
                renderActions={(row: CustomerCorporateAccount) => (
                    <button onClick={() => router.replace('/admin/account/corporate/fetch-corporate/?account=' + btoa(row.accountNumber) + '&type=' + btoa('POS Merchant'))}
                        className="px-3 py-1 hover:bg-primary hover:text-white cursor-pointer rounded text-xs gap-1 flex items-center text-primary border border-primary"
                    >
                        <Eye size={14} /> View
                    </button>
                )}
                nextUrl={state.nextUrl}
                prevUrl={state.prevUrl}
                entriesPerPage={state.entriesPerPage}
                onPageChange={handlePageChange}
                onSearchChange={(query) => {
                    setState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
                }}
                onLengthChange={(length) => {
                    setState((prev) => ({ ...prev, entriesPerPage: length, currentPage: 1 }));
                }}
            />
        </div>
    );
}

export default POSAccount;