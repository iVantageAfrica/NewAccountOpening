"use client";
import Spinner from "@/app/components/ui/spinner";
import DataTable from "@/app/components/ui/dataTable";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { ComplianceReviewItem } from "@/app/utils/Utility/Interfaces";
import { getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { Eye, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const AccountReviewPage = () => {
    const router = useRouter();
    const { awaitingComplianceReview, loading } = useApiEndPoints();
    const [accounts, setAccounts] = useState<ComplianceReviewItem[]>([]);

    const adminData = getFromLocalStorage("adminDetails") as Record<string, any> | null;
    const canReviewForCompliance = (adminData?.permissions ?? []).includes("approve-account");

    useEffect(() => {
        if (!canReviewForCompliance) {
            router.replace("/admin/customer");
        }
    }, [canReviewForCompliance, router]);

    const fetchList = useCallback(async () => {
        const data = await awaitingComplianceReview();
        setAccounts(Array.isArray(data) ? data : []);
    }, [awaitingComplianceReview]);

    useEffect(() => {
        if (canReviewForCompliance) {
            fetchList();
        }
    }, [canReviewForCompliance, fetchList]);

    const viewDetails = (row: ComplianceReviewItem) => {
        const accountNumber = btoa(row.accountNumber ?? "");
        const type = row.accountType === "Corporate"
            ? btoa("Corporate")
            : btoa(row.accountType ?? "Savings");
        const path = row.accountType === "Corporate" ? "corporate/fetch-corporate" : "individual";
        router.replace(`/admin/account/${path}/?account=${accountNumber}&type=${type}`);
    };

    return (
        <div>
            <Spinner loading={loading} />
            <div className="flex items-center justify-between mb-6 mt-4">
                <div>
                    <p className="text-xs text-gray-500 -mt-5">Accounts awaiting your compliance review.</p>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ShieldAlert size={22} className="text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-black">No accounts awaiting your review</p>
                    <p className="text-xs text-gray-500 max-w-sm">
                        Accounts reviewed by a Customer Management Officer and assigned to you will appear here.
                    </p>
                </div>
            ) : (
                <DataTable
                    tableTitle="Assigned Accounts"
                    data={accounts}
                    columns={[
                        { key: "accountNumber", label: "Account Number" },
                        { key: "accountType", label: "Account Type" },
                        { key: "holderName", label: "Customer / Company" },
                        { key: "cmoReviewedByName", label: "CMO Reviewed By" },
                        { key: "cmoReviewedAt", label: "CMO Reviewed On" },
                        { key: "status", label: "Status" },
                    ]}
                    renderActions={(row: ComplianceReviewItem) => (
                        <button
                            onClick={() => viewDetails(row)}
                            className="px-3 py-1 hover:bg-primary hover:text-white cursor-pointer rounded text-xs gap-1 flex items-center text-primary border border-primary"
                        >
                            <Eye size={14} /> View More
                        </button>
                    )}
                />
            )}
        </div>
    );
};

export default AccountReviewPage;