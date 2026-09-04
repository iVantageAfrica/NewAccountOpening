"use client";
import DataTable from "@/app/components/ui/dataTable";
import Modal from "@/app/components/ui/modal";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { AdminListItem, AuditLogItem } from "@/app/utils/Utility/Interfaces";
import { formatDateTimeWithSeconds, getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { useAdminGuard } from "@/app/components/types/administrativeGuard";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const AuditLogs = () => {
    useAdminGuard();
    const router = useRouter();
    const { listAdmins, listAuditLogs, loading } = useApiEndPoints();

    const [admins, setAdmins] = useState<AdminListItem[]>([]);
    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<string>("all");
    const [totalRecords, setTotalRecords] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [detailLog, setDetailLog] = useState<AuditLogItem | null>(null);
    const [detailModal, setDetailModal] = useState(false);

    const fetchAdmins = useCallback(async () => {
        const result = await listAdmins();
        setAdmins(Array.isArray(result) ? result : []);
    }, [listAdmins]);

    const fetchLogs = useCallback(async (adminId: string, pageUrl?: string) => {
        const response = await listAuditLogs(adminId, undefined, undefined, pageUrl);
        const raw = Array.isArray(response?.data) ? response.data : [];
        const data = raw.map((log: AuditLogItem) => ({
            ...log,
            createdAtFormatted: formatDateTimeWithSeconds(log.createdAt as string),
        }));
        setLogs(data);
        setTotalRecords(response?.pagination?.total ?? 0);
        setNextUrl(response?.pagination?.next_page_url ?? null);
        setPrevUrl(response?.pagination?.prev_page_url ?? null);
    }, [listAuditLogs]);

    useEffect(() => {
        const stored = getFromLocalStorage<Record<string, any>>("adminDetails");
        if (stored && stored.role !== "Super Admin" && stored.is_super_admin !== true) {
            router.replace("/admin/customer");
            return;
        }
        fetchAdmins();
        fetchLogs("all");
    }, [fetchAdmins, fetchLogs, router]);

    const handleAdminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAdmin(e.target.value);
        fetchLogs(e.target.value);
    };

    const handlePageChange = (direction: "next" | "prev") => {
        if (direction === "next" && nextUrl) fetchLogs(selectedAdmin, nextUrl);
        if (direction === "prev" && prevUrl) fetchLogs(selectedAdmin, prevUrl);
    };

    const openDetail = (log: AuditLogItem) => {
        setDetailLog(log);
        setDetailModal(true);
    };

    return (
        <div>
            <Spinner loading={loading} />

            <div className="bg-white px-6 py-6 rounded shadow-sm mb-6">
                <p className="font-bold text-lg text-black">Audit Logs</p>
                <p className="text-xs text-gray-600 mt-1">
                    Review the trail of actions carried out by administrators on the platform.
                </p>
            </div>

            <div className="bg-white px-6 py-4 rounded shadow-sm mb-6 flex items-center gap-3 flex-wrap">
                <label className="text-sm font-bold text-black">Filter by Admin:</label>
                <select
                    value={selectedAdmin}
                    onChange={handleAdminChange}
                    className="px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-primary"
                >
                    <option value="all">All Admins</option>
                    {admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                            {admin.firstname} {admin.lastname} ({admin.email})
                        </option>
                    ))}
                </select>
            </div>

            <DataTable
                tableTitle="Audit Log List"
                data={logs as unknown as Record<string, unknown>[]}
                columns={[
                    { key: "adminName", label: "Admin" },
                    { key: "action", label: "Action" },
                    { key: "description", label: "Description" },
                    { key: "ipAddress", label: "IP Address" },
                    { key: "createdAtFormatted", label: "Date" },
                ]}
                onRowClick={(row) => openDetail(row as unknown as AuditLogItem)}
                entriesPerPage={10}
                nextUrl={nextUrl}
                prevUrl={prevUrl}
                onPageChange={handlePageChange}
                tableHeight={420}
            />

            <Modal
                isVisible={detailModal}
                title="Audit Log Detail"
                subTitle=""
                size="md"
                type="side"
                cancelIcon={true}
                onClose={() => setDetailModal(false)}
            >
                <div className="pb-8">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Action</p>
                        <p className="font-bold text-black capitalize">{detailLog?.action ?? "-"}</p>
                        <p className="text-sm text-gray-700 mt-2">{detailLog?.description ?? "-"}</p>
                    </div>

                    {[
                        ["ID", String(detailLog?.id ?? "-")],
                        ["Admin", detailLog?.adminName ?? "-"],
                        ["IP Address", detailLog?.ipAddress ?? "-"],
                        ["User Agent", detailLog?.userAgent ?? "-"],
                        ["Created At", formatDateTimeWithSeconds(detailLog?.createdAt as string)],
                    ].map(([label, value]) => (
                        <div key={label} className="grid grid-cols-2 gap-4 mb-3 border-b border-gray-100 pb-2">
                            <span className="opacity-50">{label}</span>
                            <span className="font-bold text-black opacity-75 break-words text-right">{value}</span>
                        </div>
                    ))}

                    {detailLog?.metadata && Object.keys(detailLog.metadata).length > 0 && (
                        <div className="mt-4">
                            <p className="font-bold text-black mb-2">Metadata</p>
                            <div className="bg-gray-50 rounded p-4">
                                {Object.entries(detailLog.metadata).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-2 gap-4 mb-2">
                                        <span className="opacity-50 capitalize">{key.replace(/_/g, " ")}</span>
                                        <span className="font-bold text-black opacity-75 break-words text-right">
                                            {typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "-")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AuditLogs;