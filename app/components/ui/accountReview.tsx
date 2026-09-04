"use client";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { toast } from "@/app/components/toast/useToast";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { AdminData, ComplianceOfficerItem, CorporateAccount, IndividualAccountData } from "@/app/utils/Utility/Interfaces";
import { formatDateTimeWithSeconds, getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, BadgeCheck, Flag, Loader2, ShieldCheck } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface AccountReviewProps {
    account: IndividualAccountData | CorporateAccount;
    accountNumber: string;
    accountType: "individual" | "corporate";
    onRefresh: () => void;
}

const flagSchema = z.object({
    reason: z.string().min(1, "A reason is required").max(1000, "Reason must be at most 1000 characters"),
});
type FlagSchema = z.infer<typeof flagSchema>;

const AccountReview: React.FC<AccountReviewProps> = ({ account, accountNumber, accountType, onRefresh }) => {
    const { cmoReviewAccount, cmoFlagAccount, complianceApproveAccount, complianceFlagAccount, listComplianceOfficers } = useApiEndPoints();
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [flagModal, setFlagModal] = useState<null | "cmo" | "compliance">(null);
    const [assignModal, setAssignModal] = useState(false);
    const [officers, setOfficers] = useState<ComplianceOfficerItem[]>([]);
    const [loadingOfficers, setLoadingOfficers] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState<string | number>("");

    const adminData = getFromLocalStorage("adminDetails") as AdminData | null;
    const permissions = adminData?.permissions ?? [];

    const canReview = permissions.includes("review-account");
    const canFlag = permissions.includes("flag-account");
    const canApprove = permissions.includes("approve-account");
    const canFlagForCompliance = permissions.includes("flag-account-for-compliance");

    const cmoStatus = account.cmoStatus ?? "Pending";
    const complianceStatus = account.complianceStatus ?? "Pending";
    const accountStatus = account.status;

    const cmoCanAct = cmoStatus !== "Reviewed" && complianceStatus !== "Approved" && accountStatus !== "Completed";
    const complianceCanAct = cmoStatus === "Reviewed" && complianceStatus !== "Approved";
    const assigneeId = account.complianceAssignedTo;
    const isAssignedToMe = !assigneeId
        || String(assigneeId) === String(adminData?.id)
        || adminData?.is_super_admin === true
        || adminData?.isSuperAdmin === true;

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FlagSchema>({
        resolver: zodResolver(flagSchema),
        defaultValues: { reason: "" },
    });

    const runAction = useCallback(async (
        key: string,
        fn: (data: { accountNumber: string; accountType: "individual" | "corporate"; reason?: string; complianceOfficerId?: string | number }) => Promise<{ statusCode: number }>,
        payload: { accountNumber: string; accountType: "individual" | "corporate"; reason?: string; complianceOfficerId?: string | number },
        successTitle: string,
        successDescription: string,
    ) => {
        setSubmitting(key);
        const response = await fn(payload);
        setSubmitting(null);
        if (response.statusCode === 200) {
            toast({ type: "success", title: successTitle, description: successDescription });
            setFlagModal(null);
            setAssignModal(false);
            reset({ reason: "" });
            onRefresh();
        }
    }, [onRefresh, reset]);

    const openAssignModal = async () => {
        setAssignModal(true);
        setLoadingOfficers(true);
        const response = await listComplianceOfficers();
        setOfficers(Array.isArray(response?.data) ? response.data : []);
        setLoadingOfficers(false);
    };

    const handleCmoReview = () => {
        if (!selectedOfficer) {
            toast({ type: "error", title: "Select Officer", description: "Please select the Compliance Officer to send this account to." });
            return;
        }
        runAction(
            "cmoReview",
            cmoReviewAccount,
            { accountNumber, accountType, complianceOfficerId: selectedOfficer },
            "Account Reviewed",
            "Account reviewed by CMO and assigned to the selected Compliance Officer.",
        );
    };

    const handleCmoFlag = () => runAction(
        "cmoFlag",
        cmoFlagAccount,
        { accountNumber, accountType },
        "Account Flagged",
        "Account flagged by CMO with the provided reason.",
    );

    const handleComplianceApprove = () => {
        if (cmoStatus !== "Reviewed") {
            toast({ type: "error", title: "Cannot Approve Account", description: "Account cannot be approved, Awaiting a CMO Officer review." });
            return;
        }
        if (!isAssignedToMe) {
            toast({ type: "error", title: "Cannot Approve Account", description: "This account was not assigned to you for review." });
            return;
        }
        if (complianceStatus === "Approved" || accountStatus === "Completed") {
            toast({ type: "error", title: "Cannot Approve Account", description: "This account has already been approved by Compliance." });
            return;
        }
        runAction(
            "complianceApprove",
            complianceApproveAccount,
            { accountNumber, accountType },
            "Account Approved",
            "Account approved by Compliance. Account opening is now completed.",
        );
    };

    const handleComplianceFlag = () => runAction(
        "complianceFlag",
        complianceFlagAccount,
        { accountNumber, accountType },
        "Account Flagged",
        "Account flagged for review by Compliance with the provided reason.",
    );

    const onFlagSubmit = handleSubmit((value) => {
        if (flagModal === "cmo") {
            runAction("cmoFlag", cmoFlagAccount, { accountNumber, accountType, reason: value.reason }, "Account Flagged", "Account flagged by CMO.");
        } else if (flagModal === "compliance") {
            runAction("complianceFlag", complianceFlagAccount, { accountNumber, accountType, reason: value.reason }, "Account Flagged", "Account flagged by Compliance.");
        }
    });

    const statusPill = (value: string) => {
        const tone = value === "Reviewed" || value === "Approved" || value === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : value === "Flagged"
                ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-700";
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${tone}`}>
                {value}
            </span>
        );
    };

    const detailRow = (label: string, value?: string | null) => (
        value ? (
            <div className="flex justify-between items-center gap-2 py-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xs text-black font-semibold truncate">{value}</p>
            </div>
        ) : null
    );

    return (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between gap-2 bg-primary/5 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <p className="font-bold text-sm text-black">Reviews</p>
                </div>
                {statusPill(accountStatus ?? "Pending")}
            </div>

            <div className="p-4 grid gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                            <BadgeCheck size={14} className="text-primary" /> CMO Review
                        </p>
                        {statusPill(cmoStatus)}
                    </div>
                    {detailRow("Reviewed By", account.cmoReviewedByName)}
                    {detailRow("Date", formatDateTimeWithSeconds(account.cmoReviewedAt))}
                    {detailRow("Reason", account.cmoFlaggedReason)}
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber-500" /> Compliance Review
                        </p>
                        {statusPill(complianceStatus)}
                    </div>
                    {detailRow("Assigned To", account.complianceAssignedToName)}
                    {detailRow("Assigned At", formatDateTimeWithSeconds(account.complianceAssignedAt))}
                    {detailRow("Reviewed By", account.complianceReviewedByName)}
                    {detailRow("Date", formatDateTimeWithSeconds(account.complianceReviewedAt))}
                    {detailRow("Reason", account.complianceFlaggedReason)}
                </div>

                {(canReview || canFlag || canApprove || canFlagForCompliance) && (
                    <div className="border-t border-gray-100 pt-4 grid gap-3">
                        {canReview && (
                            <PrimaryButton onClick={openAssignModal} disabled={!cmoCanAct || submitting !== null} loading={submitting === "cmoReview"}>
                                Mark as Reviewed
                            </PrimaryButton>
                        )}
                        {canFlag && (
                            <PrimaryButton variant="secondary" onClick={() => setFlagModal("cmo")} disabled={!cmoCanAct || submitting !== null}>
                                <Flag size={14} /> Flag Account
                            </PrimaryButton>
                        )}
                        {canApprove && (
                            <PrimaryButton onClick={handleComplianceApprove} disabled={submitting !== null} loading={submitting === "complianceApprove"}>
                                Approve Account
                            </PrimaryButton>
                        )}
                        {canFlagForCompliance && complianceCanAct && (
                            <PrimaryButton variant="secondary" onClick={() => setFlagModal("compliance")} disabled={submitting !== null}>
                                <Flag size={14} /> Flag for Compliance
                            </PrimaryButton>
                        )}
                    </div>
                )}
            </div>

            <Modal
                isVisible={assignModal}
                title="Send for Compliance Review"
                size="sm"
                type="center"
                cancelIcon={true}
                onClose={() => setAssignModal(false)}
            >
                <div className="grid gap-3 px-6 pb-6">
                    <p className="text-xs text-gray-600 pt-1 pb-5">
                        Select a Compliance Officer to send this account for review. The selected officer will be notified and will be able to review the account.
                    </p>
                    {loadingOfficers ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-500">
                            <Loader2 size={16} className="animate-spin" /> Loading Compliance Officers...
                        </div>
                    ) : officers.length === 0 ? (
                        <p className="text-xs text-gray-500 py-4 text-center">No Compliance Officer is available to assign this account.</p>
                    ) : (
                        <div className="grid gap-2 max-h-56 overflow-y-auto">
                            {officers.map((officer) => (
                                <label
                                    key={officer.id}
                                    className={`flex items-center gap-3 border rounded-lg px-3 py-2.5 cursor-pointer transition-all ${String(selectedOfficer) === String(officer.id) ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                                >
                                    <input
                                        type="radio"
                                        name="complianceOfficer"
                                        value={String(officer.id)}
                                        checked={String(selectedOfficer) === String(officer.id)}
                                        onChange={() => setSelectedOfficer(officer.id)}
                                        className="accent-primary"
                                    />
                                    <div className="grid">
                                        <p className="text-xs font-bold text-black">{officer.name}</p>
                                        {officer.email && <p className="text-[10px] text-gray-500">{officer.email}</p>}
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                    <PrimaryButton onClick={handleCmoReview} disabled={loadingOfficers || submitting !== null} loading={submitting === "cmoReview"}>
                        Send for Review
                    </PrimaryButton>
                </div>
            </Modal>

            <Modal
                isVisible={flagModal !== null}
                title={flagModal === "cmo" ? "Flag Account" : "Flag for Compliance"}
                subTitle=""
                size="sm"
                type="center"
                cancelIcon={true}
                onClose={() => setFlagModal(null)}
            >
                <form className="grid gap-4 px-6 pb-6" onSubmit={onFlagSubmit}>
                    <p className="text-xs text-gray-600">
                        Provide a reason for flagging this account. The account and the stated reason will be recorded for review.
                    </p>
                    <Controller
                        name="reason"
                        control={control}
                        render={({ field }) => (
                            <Input {...field}
                                required
                                labelName="Reason"
                                inputError={errors.reason?.message}
                                type="textarea"
                            />
                        )}
                    />
                    <PrimaryButton type="submit" loading={submitting === "cmoFlag" || submitting === "complianceFlag"}>
                        Submit
                    </PrimaryButton>
                </form>
            </Modal>
        </div>
    );
};

export default AccountReview;