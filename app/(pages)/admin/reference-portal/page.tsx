"use client"
import DashboardStatCard from "@/app/components/ui/dashboardCard";
import DataTable from "@/app/components/ui/dataTable";
import InformationText from "@/app/components/ui/informationText";
import Modal from "@/app/components/ui/modal";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { downloadReferenceForm } from "@/app/utils/formDownload/referenceForm";
import { CustomerCurrentAccount, RefereeAccountState } from "@/app/utils/Utility/Interfaces";
import { Download, Eye, UserCheck, UserCog, UserPen, Users } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const PortalReference = () => {

    const { portalReferenceList, portalReferenceSummary, loading } = useApiEndPoints();
    const [state, setState] = useState<RefereeAccountState>({
        referenceList: [],
        summary: {},
        totalRecords: 0,
        currentPage: 1,
        entriesPerPage: 10,
        searchQuery: "",
        nextUrl: null,
        prevUrl: null,
        referenceDetailModal: false,
        referenceDetails: {}
    })

    const fetchPortalReference = useCallback(
        async (page = 1, search = "", perPage = 10, pageUrl?: string) => {
            const { data = [], pagination = {} } = await portalReferenceList(page.toString(), search, perPage.toString(), pageUrl);
            setState((prev) => ({
                ...prev,
                referenceList: data,
                totalRecords: pagination.total ?? 0,
                nextUrl: pagination.next_page_url ?? null,
                prevUrl: pagination.prev_page_url ?? null,
            }))
        },
        [portalReferenceList]
    );

    const dashboardSummary = useCallback(async () => {
        const summaryResult = await portalReferenceSummary();
        setState((prev) => ({ ...prev, summary: summaryResult }))
    }, [portalReferenceSummary]);

    useEffect(() => {
        (async () => {
            await dashboardSummary();
            const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;
            await fetchPortalReference(state.currentPage, state.searchQuery, perPage);
        })();
    }, [state.currentPage, state.searchQuery, state.entriesPerPage, state.totalRecords, dashboardSummary, fetchPortalReference]);


    const handlePageChange = (direction: "next" | "prev") => {
        const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;

        if (direction === "next" && state.nextUrl)
            fetchPortalReference(undefined, state.searchQuery, perPage, state.nextUrl);
        if (direction === "prev" && state.prevUrl)
            fetchPortalReference(undefined, state.searchQuery, perPage, state.prevUrl);
    };


    return (
        <div>
            <p className="text-gray-500 pb-5 -pt-5 text-xs">This page displays the list of references submitted by customers for accounts that are not yet linked.</p>
            <Spinner loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6  mb-8 mt-4">
                <DashboardStatCard icon={<Users />}
                    iconBg="bg-primary/50"
                    iconColor="text-primary"
                    label="Total Reference Submitted"
                    value={state.summary?.totalReference} />

                <DashboardStatCard icon={<UserCheck />}
                    iconBg="bg-blue-500/50"
                    iconColor="text-blue-500"
                    label="Today Reference Submitted"
                    value={state.summary?.todayReference} />
                <DashboardStatCard icon={<UserPen />}
                    iconBg="bg-purple-500/50"
                    iconColor="text-purple-500"
                    label="Weekly Reference Submitted"
                    value={state.summary?.weeklyReference} />
                <DashboardStatCard icon={<UserCog />}
                    iconBg="bg-green-500/50"
                    iconColor="text-green-500"
                    label="Monthly Reference Submitted"
                    value={state.summary?.monthlyReference} />
            </div>

            <DataTable
                tableTitle="Reference Submitted"
                data={state.referenceList}
                columns={[
                    { key: "accountNumber", label: "Account Holder Number" },
                    { key: "accountHolderName", label: "Account Holder Name" },
                    { key: "name", label: "Referee Name" },
                    { key: "mobileNumber", label: "Referee Phone Number" },
                    { key: "knownPeriod", label: "Known Period" },
                    { key: "createdAt", label: "DATE" },
                ]}
                onRowClick={(row) => setState((prev) => ({ ...prev, referenceDetails: row, referenceDetailModal: true }))}
                renderActions={(row: CustomerCurrentAccount) => (
                    <button onClick={() => setState((prev) => ({ ...prev, referenceDetails: row, referenceDetailModal: true }))}
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

            <Modal
                subTitle=""
                isVisible={state.referenceDetailModal}
                title={state.referenceDetails?.name}
                size="sm"
                type="side"
                cancelIcon={true}
                onClose={() => setState((prev) => ({ ...prev, referenceDetailModal: false }))}
            >
                <div>
                    <div>
                        <div className="py-3 ">
                            <p className="font-bold text-black">Account Holder Details</p>
                        </div>
                        {[
                            ["Account Name", state.referenceDetails?.accountHolderName],
                            ["Account Number", state.referenceDetails?.accountHolderNumber],
                            ["Account Email", state.referenceDetails?.accountHolderEmail],
                        ].map(([label, value]) => (
                            <div key={String(label)} className="grid grid-cols-2 mb-2">
                                <span className="opacity-50">{label}</span>
                                <span className="font-bold text-black opacity-75">{value ?? "-"}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 py-3 ">
                        <p className="font-bold text-black">Referee Details</p>
                    </div>
                    {[
                        ["Referee Name", state.referenceDetails?.name],
                        ["Referee Email", state.referenceDetails?.emailAddress],
                        ["Referee Phone", state.referenceDetails?.mobileNumber],
                        ["Referee Address", state.referenceDetails?.address],
                        ["Referee Bank Name", state.referenceDetails?.bankName],
                        ["Referee Account Type", state.referenceDetails?.accountType],
                        ["Referee Account Name", state.referenceDetails?.accountName],
                        ["Known Period", state.referenceDetails?.knownPeriod],
                        ["Comment", state.referenceDetails?.comment],
                        ["Created At", state.referenceDetails?.createdAt],
                    ].map(([label, value]) => (
                        <div key={String(label)} className="grid grid-cols-2 mb-2">
                            <span className="opacity-50">{label}</span>
                            <span className="font-bold text-black opacity-75">{value ?? "-"}</span>
                        </div>
                    ))}
                    <div className="grid  w-full mb-2">
                        {state.referenceDetails?.signature && (
                            <InformationText
                                title="Signature"
                                data={state.referenceDetails?.signature || "Not Yet Submitted"}
                                type="file"
                            />
                        )}
                    </div>
                    <div className="flex justify-end pb-2">
                        <button
                            onClick={() => downloadReferenceForm(state.referenceDetails)}
                            className="inline-flex gap-2 cursor-pointer text-sm items-center text-white mt-4 bg-primary hover:underline px-4 py-2"
                        >
                            <Download size={14} /> Download Information
                        </button>
                    </div>
                </div>


            </Modal >
        </div>
    );
}

export default PortalReference;