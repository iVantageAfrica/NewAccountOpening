"use client"
import DashboardStatCard from "@/app/components/ui/dashboardCard";
import DataTable from "@/app/components/ui/dataTable";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { Eye, UserCheck, UserCog, UserPen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SavingsAccount = () => {
    const router = useRouter();
    const { savingsAccountList, savingsAccountSummary, loading } = useApiEndPoints();
    const [state, setState] = useState({
        customerSavingsAccount: [],
        dashboardSummary: {},
        totalRecords: 0,
        currentPage: 1,
        entriesPerPage: 10,
        searchQuery: "",
        nextUrl: null,
        prevUrl: null,
    })

    const fetchSavingsAccount = useCallback(
        async (page = 1, search = "", perPage = 10, pageUrl?: string) => {
            const { data = [], pagination = {} } = await savingsAccountList(page.toString(), search, perPage.toString(), pageUrl);
            setState((prev) => ({
                ...prev,
                customerSavingsAccount: data,
                totalRecords: pagination.total ?? 0,
                nextUrl: pagination.next_page_url ?? null,
                prevUrl: pagination.prev_page_url ?? null,
            }))
        },
        [savingsAccountList]
    );

    const dashboardSummary = useCallback(async () => {
        const summaryResult = await savingsAccountSummary();
        setState((prev) => ({ ...prev, dashboardSummary: summaryResult }))
    }, [savingsAccountSummary]);

    useEffect(() => {
        (async () => {
            await dashboardSummary();
            await fetchSavingsAccount(state.currentPage, state.searchQuery, state.entriesPerPage);
        })();
    }, [state.currentPage, state.searchQuery, state.entriesPerPage, dashboardSummary, fetchSavingsAccount]);


    const handlePageChange = (direction: "next" | "prev") => {
        if (direction === "next" && state.nextUrl) 
            fetchSavingsAccount(undefined, state.searchQuery, state.entriesPerPage, state.nextUrl);
        if (direction === "prev" && state.prevUrl) 
            fetchSavingsAccount(undefined, state.searchQuery, state.entriesPerPage, state.prevUrl);
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
                data={state.customerSavingsAccount}
                columns={[
                    { key: "accountNumber", label: "Account Number" },
                    { key: "bvn", label: "BVN" },
                    { key: "firstname", label: "Firstname" },
                    { key: "lastname", label: "Lastname" },
                    { key: "phoneNumber", label: "Phone number" },
                    { key: "status", label: "Status" },
                    { key: "createdAt", label: "DATE" },
                ]}
                renderActions={(row: any) => (
                    <button onClick={() => router.replace('/admin/account/individual/?account=' + btoa(row.accountNumber)+'&type='+btoa('Savings'))}
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
                    setState((prev) => ({...prev, searchQuery: query, currentPage:1}));
                }}
                onLengthChange={(length) => {
                    setState((prev) =>({...prev, entriesPerPage: length, currentPage:1}));
                }}
            />
        </div>
    );
}

export default SavingsAccount;