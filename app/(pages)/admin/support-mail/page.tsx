"use client";
import DataTable from "@/app/components/ui/dataTable";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { SupportMailItem } from "@/app/utils/Utility/Interfaces";
import { formatDateTimeWithSeconds, getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { createSupportMailSchema, type CreateSupportMailSchema, updateSupportMailSchema, type UpdateSupportMailSchema } from "@/app/utils/validationSchema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const SupportMail = () => {
    const router = useRouter();
    const {
        listSupportMails,
        createSupportMail,
        updateSupportMail,
        activateSupportMail,
        deactivateSupportMail,
        deleteSupportMail,
        loading,
    } = useApiEndPoints();

    const [mails, setMails] = useState<SupportMailItem[]>([]);
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewTarget, setViewTarget] = useState<SupportMailItem | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [editTarget, setEditTarget] = useState<SupportMailItem | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<SupportMailItem | null>(null);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const stored = getFromLocalStorage<Record<string, any>>("adminDetails");
        if (stored && stored.role !== "Super Admin" && stored.is_super_admin !== true) {
            router.replace("/admin/customer");
            return;
        }
    }, [router]);

    const fetchMails = useCallback(async () => {
        const result = await listSupportMails();
        setMails(Array.isArray(result) ? result : []);
    }, [listSupportMails]);

    useEffect(() => {
        fetchMails();
    }, [fetchMails]);

    // ------- Create Form -------
    const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate, formState: { errors: createErrors } } = useForm<CreateSupportMailSchema>({
        resolver: zodResolver(createSupportMailSchema),
        defaultValues: { firstname: "", lastname: "", email: "" },
    });

    const onCreate = async (data: CreateSupportMailSchema) => {
        const apiResponse = await createSupportMail(data);
        if (apiResponse.statusCode === 200) {
            resetCreate();
            setCreateModal(false);
            await fetchMails();
        }
    };

    // ------- View (Activate / Deactivate) -------
    const openViewModal = (mail: SupportMailItem) => {
        setViewTarget(mail);
        setViewModal(true);
    };

    const onToggleStatus = async () => {
        if (!viewTarget?.id) return;
        setStatusLoading(true);
        const isActive = viewTarget.status === "Active";
        const apiResponse = isActive
            ? await deactivateSupportMail(viewTarget.id)
            : await activateSupportMail(viewTarget.id);
        setStatusLoading(false);
        if (apiResponse.statusCode === 200) {
            if (apiResponse.data) {
                setViewTarget({ ...viewTarget, ...apiResponse.data });
            }
            await fetchMails();
        }
    };

    // ------- Edit -------
    const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEdit, formState: { errors: editErrors } } = useForm<UpdateSupportMailSchema>({
        resolver: zodResolver(updateSupportMailSchema),
        defaultValues: { firstname: "", lastname: "", email: "" },
    });

    const openEditModal = (mail: SupportMailItem) => {
        setEditTarget(mail);
        resetEdit({
            firstname: mail.firstname ?? "",
            lastname: mail.lastname ?? "",
            email: mail.email ?? "",
        });
        setEditModal(true);
    };

    const onEdit = async (data: UpdateSupportMailSchema) => {
        if (!editTarget?.id) return;
        const apiResponse = await updateSupportMail(editTarget.id, data);
        if (apiResponse.statusCode === 200) {
            setEditModal(false);
            setEditTarget(null);
            await fetchMails();
        }
    };

    // ------- Delete -------
    const openDeleteModal = (mail: SupportMailItem) => {
        setDeleteTarget(mail);
        setDeleteModal(true);
    };

    const onDelete = async () => {
        if (!deleteTarget?.id) return;
        const apiResponse = await deleteSupportMail(deleteTarget.id);
        if (apiResponse.statusCode === 200) {
            setDeleteModal(false);
            setDeleteTarget(null);
            await fetchMails();
        }
    };

    const statusBadge = (status?: string) => {
        const isActive = status === "Active";
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
            >
                {status ?? "-"}
            </span>
        );
    };

    return (
        <div>
            <Spinner loading={loading || statusLoading} />

            <div className="flex justify-between items-center flex-wrap gap-4 bg-white px-6 py-6 rounded shadow-sm mb-6">
                <div>
                    <p className="font-bold text-lg text-black">Customer Support Mail</p>
                    <p className="text-xs text-gray-600 mt-1">
                        This is the page to manage mails that receive notifications around operations on the account opening.
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <PrimaryButton
                        icon={<Plus size={16} />}
                        onClick={() => {
                            resetCreate({ firstname: "", lastname: "", email: "" });
                            setCreateModal(true);
                        }}
                    >
                        Create Support Mail
                    </PrimaryButton>
                </div>
            </div>

            <DataTable
                tableTitle="Support Mails"
                data={mails as Record<string, unknown>[]}
                columns={[
                    { key: "firstname", label: "Firstname" },
                    { key: "lastname", label: "Lastname" },
                    { key: "email", label: "Email" },
                    {
                        key: "status",
                        label: "Status",
                        cellClassName: (value) =>
                            value === "Active" ? "text-green-600 font-bold" : "text-red-500 font-bold",
                    },
                ]}
                renderActions={(row) => {
                    const mail = row as unknown as SupportMailItem;
                    return (
                        <div className="flex items-center gap-4">
                            <span
                                title="View"
                                className="cursor-pointer hover:opacity-70"
                                onClick={() => openViewModal(mail)}
                            >
                                <Eye color="purple" size={18} />
                            </span>
                            <span
                                title="Edit"
                                className="cursor-pointer hover:opacity-70"
                                onClick={() => openEditModal(mail)}
                            >
                                <Pencil color="#3B82F6" size={18} />
                            </span>
                            <span
                                title="Delete"
                                className="cursor-pointer hover:opacity-70"
                                onClick={() => openDeleteModal(mail)}
                            >
                                <Trash2 color="red" size={18} />
                            </span>
                        </div>
                    );
                }}
            />

            {/* Create Support Mail - Side Drawer */}
            <Modal
                isVisible={createModal}
                title="Create Support Mail"
                subTitle=""
                size="sm"
                type="side"
                cancelIcon={true}
                onClose={() => setCreateModal(false)}
            >
                <form className="grid gap-5 pb-8" onSubmit={handleCreateSubmit(onCreate)}>
                    <Controller
                        name="firstname"
                        control={createControl}
                        render={({ field }) => (
                            <Input {...field} required labelName="Firstname" inputError={createErrors.firstname?.message} />
                        )}
                    />
                    <Controller
                        name="lastname"
                        control={createControl}
                        render={({ field }) => (
                            <Input {...field} required labelName="Lastname" inputError={createErrors.lastname?.message} />
                        )}
                    />
                    <Controller
                        name="email"
                        control={createControl}
                        render={({ field }) => (
                            <Input {...field} required type="email" labelName="Email Address" inputError={createErrors.email?.message} />
                        )}
                    />

                    <div className="w-full md:w-1/2 pt-4">
                        <PrimaryButton type="submit" loading={loading}>
                            Create Support Mail
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* View Support Mail - Side Drawer */}
            <Modal
                isVisible={viewModal}
                title="Support Mail Details"
                subTitle=""
                size="md"
                type="side"
                cancelIcon={true}
                onClose={() => setViewModal(false)}
            >
                <div className="pb-8">
                    <div className="flex items-center justify-between gap-4 mb-4 bg-gray-100 rounded p-4">
                        <div>
                            <p className="font-bold text-black text-sm capitalize">
                                {viewTarget?.firstname} {viewTarget?.lastname}
                            </p>
                            <p className="text-xs opacity-60 break-words">{viewTarget?.email}</p>
                        </div>
                        {statusBadge(viewTarget?.status)}
                    </div>

                    {[
                        ["Firstname", viewTarget?.firstname],
                        ["Lastname", viewTarget?.lastname],
                        ["Email", viewTarget?.email],
                        ["Created At", formatDateTimeWithSeconds(viewTarget?.createdAt as string)],
                        ["Updated At", formatDateTimeWithSeconds(viewTarget?.updatedAt as string)],
                    ].map(([label, value]) => (
                        <div key={label} className="grid grid-cols-2 gap-4 mb-3 border-b border-gray-100 pb-2">
                            <span className="opacity-50">{label}</span>
                            <span className="font-bold text-black opacity-75 break-words text-right">{value ?? "-"}</span>
                        </div>
                    ))}

                    <div className="w-1/2 pt-6">
                        <PrimaryButton type="button" loading={statusLoading} onClick={onToggleStatus}>
                            {viewTarget?.status === "Active" ? "Deactivate" : "Activate"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Edit Support Mail - Side Drawer */}
            <Modal
                isVisible={editModal}
                title="Edit Support Mail"
                subTitle=""
                size="sm"
                type="side"
                cancelIcon={true}
                onClose={() => setEditModal(false)}
            >
                <form className="grid gap-5 pb-8" onSubmit={handleEditSubmit(onEdit)}>
                    <Controller
                        name="firstname"
                        control={editControl}
                        render={({ field }) => (
                            <Input {...field} required labelName="Firstname" inputError={editErrors.firstname?.message} />
                        )}
                    />
                    <Controller
                        name="lastname"
                        control={editControl}
                        render={({ field }) => (
                            <Input {...field} required labelName="Lastname" inputError={editErrors.lastname?.message} />
                        )}
                    />
                    <Controller
                        name="email"
                        control={editControl}
                        render={({ field }) => (
                            <Input {...field} required type="email" labelName="Email Address" inputError={editErrors.email?.message} />
                        )}
                    />

                    <div className="w-full md:w-1/2 pt-4">
                        <PrimaryButton type="submit" loading={loading}>
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Support Mail - Center Modal */}
            <Modal
                isVisible={deleteModal}
                title="Delete Support Mail"
                subTitle=""
                size="sm"
                type="center"
                cancelIcon={false}
                onClose={() => setDeleteModal(false)}
            >
                <div className="px-8 pb-8">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-black">
                            {deleteTarget?.firstname} {deleteTarget?.lastname}
                        </span>{" "}
                        ({deleteTarget?.email})? This action cannot be undone.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <div className="w-1/2">
                            <PrimaryButton variant="secondary" onClick={() => setDeleteModal(false)}>
                                Cancel
                            </PrimaryButton>
                        </div>
                        <div className="w-1/2">
                            <PrimaryButton type="button" loading={loading} onClick={onDelete}>
                                Yes, Delete
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SupportMail;