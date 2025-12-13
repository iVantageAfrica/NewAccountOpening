"use client"
import DashboardStatCard from "@/app/components/ui/dashboardCard";
import DataTable from "@/app/components/ui/dataTable";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { CardSim } from "lucide-react";
import React from "react";

const CardRequest = () => {
    const { debitCardRequest, loading } = useApiEndPoints();
    const [state, setState] = React.useState({
        cardRequests: [],
        totalRecords: 0,
        currentPage: 1,
        entriesPerPage: 10,
        searchQuery: "",
        nextUrl: null,
        prevUrl: null,
    });

    const fetchCardRequests = React.useCallback(async () => {
        const result = await debitCardRequest();
        setState((prev) => ({ ...prev, cardRequests: result }));
    }, [debitCardRequest]);

    React.useEffect(() => {
        fetchCardRequests();
    }, [fetchCardRequests]);

    return (
        <div>
            <Spinner loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardStatCard
                    label="Total Card Requests"
                    value={state.cardRequests.summary?.totalRequests}
                    icon={<CardSim />}
                    iconBg="bg-red-500/50"
                    iconColor="text-red-500"
                />

                <DashboardStatCard
                    label="Pending Request"
                    value={state.cardRequests.summary?.pendingRequests}
                    icon={<CardSim />}
                    iconBg="bg-green-500/30"
                    iconColor="text-green-600"
                />
                <DashboardStatCard
                    label="Approved Request"
                    value={state.cardRequests.summary?.approvedRequests}
                    icon={<CardSim />}
                    iconBg="bg-purple-500/30"
                    iconColor="text-purple-600"
                />
                <DashboardStatCard
                    label="Today Card Request"
                    value={state.cardRequests.summary?.todayRequests}
                    icon={<CardSim />}
                    iconBg="bg-yellow-500/30"
                    iconColor="text-yellow-600"
                />
            </div>

               <DataTable
                tableTitle="Card Request list"
                data={state.cardRequests.data}
                columns={[
                    { key: "accountNumber", label: "Account Number" },
                    { key: "accountType", label: "Account Type" },
                    { key: "firstname", label: "Firstname" },
                    { key: "lastname", label: "Lastname" },
                    { key: "status", label: "Status" },
                    { key: "createdAt", label: "DATE" },
                ]}
                nextUrl={state.nextUrl}
                prevUrl={state.prevUrl}
                entriesPerPage={state.entriesPerPage}
       
            />
        </div>
    );
}

export default CardRequest;