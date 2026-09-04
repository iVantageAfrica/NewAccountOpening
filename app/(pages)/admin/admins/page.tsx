"use client";
import DataTable from "@/app/components/ui/dataTable";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import Select from "@/app/components/ui/selectInput";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { AdminListItem } from "@/app/utils/Utility/Interfaces";
import { getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { createAdminSchema, type CreateAdminSchema, updateAdminSchema, type UpdateAdminSchema } from "@/app/utils/validationSchema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const ADMIN_ROLES = [
    { label: "Super Admin", value: "Super Admin" },
    { label: "Customer Management Officer", value: "Customer Management Officer" },
    { label: "Compliance Officer", value: "Compliance Officer" },
];

const MAIN_SUPER_ADMIN_EMAIL = "superadmin@imperial.com";

const Admins = () => {
    const router = useRouter();
    const { listAdmins, createAdmin, updateAdmin, deleteAdmin, loading } = useApiEndPoints();
    const [admins, setAdmins] = useState<AdminListItem[]>([]);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editAdmin, setEditAdmin] = useState<AdminListItem | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<AdminListItem | null>(null);

    useEffect(() => {
        const stored = getFromLocalStorage<Record<string, any>>("adminDetails");
        if (stored && stored.role !== "Super Admin" && stored.is_super_admin !== true) {
            router.replace("/admin/customer");
            return;
        }
    }, [router]);

    const fetchAdmins = useCallback(async () => {
        const result = await listAdmins();
        setAdmins(Array.isArray(result) ? result : []);
    }, [listAdmins]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    // ------- Create Admin Form -------
    const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate, formState: { errors: createErrors } } = useForm<CreateAdminSchema>({
        resolver: zodResolver(createAdminSchema),
        defaultValues: { firstname: "", lastname: "", email: "", role: "" },
    });
    const watchedFirstname = useWatch({ control: createControl, name: "firstname" });
    const defaultPassword = (watchedFirstname || "").toUpperCase();

    const onCreate = async (data: CreateAdminSchema) => {
        const apiResponse = await createAdmin(data);
        if (apiResponse.statusCode === 200) {
            resetCreate();
            setCreateModal(false);
            await fetchAdmins();
        }
    };

    // ------- Edit Admin Form -------
    const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEdit, formState: { errors: editErrors } } = useForm<UpdateAdminSchema>({
        resolver: zodResolver(updateAdminSchema),
        defaultValues: { firstname: "", lastname: "", email: "", role: "" },
    });

    const openEditModal = (admin: AdminListItem) => {
        setEditAdmin(admin);
        resetEdit({
            firstname: admin.firstname ?? "",
            lastname: admin.lastname ?? "",
            email: admin.email ?? "",
            role: admin.role ?? "",
        });
        setEditModal(true);
    };

    const onEdit = async (data: UpdateAdminSchema) => {
        if (!editAdmin?.id) return;
        const apiResponse = await updateAdmin(editAdmin.id, data);
        if (apiResponse.statusCode === 200) {
            setEditModal(false);
            setEditAdmin(null);
            await fetchAdmins();
        }
    };

    const openDeleteModal = (admin: AdminListItem) => {
        setDeleteTarget(admin);
        setDeleteModal(true);
    };

    const onDelete = async () => {
        if (!deleteTarget?.id) return;
        const apiResponse = await deleteAdmin(deleteTarget.id);
        if (apiResponse.statusCode === 200) {
            setDeleteModal(false);
            setDeleteTarget(null);
            await fetchAdmins();
        }
    };

    return (
        <div>
            <Spinner loading={loading} />

            <div className="flex justify-between items-center flex-wrap gap-4 bg-white px-6 py-6 rounded shadow-sm mb-6">
                <div>
                    <p className="font-bold text-lg text-black">Administrative Management</p>
                    <p className="text-xs text-gray-600 mt-1">
                        View, create and manage administrators of the account opening platform.
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <PrimaryButton
                        icon={<Plus size={16} />}
                        onClick={() => {
                            resetCreate({ firstname: "", lastname: "", email: "", role: "" });
                            setCreateModal(true);
                        }}
                    >
                        Create Admin
                    </PrimaryButton>
                </div>
            </div>

            <DataTable
                tableTitle="Admin List"
                data={admins as Record<string, unknown>[]}
                columns={[
                    { key: "firstname", label: "Firstname" },
                    { key: "lastname", label: "Lastname" },
                    { key: "email", label: "Email Address" },
                    { key: "role", label: "Role" },
                ]}
                renderActions={(row) => {
                    const admin = row as unknown as AdminListItem;
                    return (
                        <div className="flex items-center gap-3">
                            <span
                                title="View / Edit"
                                className="cursor-pointer hover:text-primary"
                                onClick={() => openEditModal(admin)}
                            >
                                <Eye color="purple" size={18} />
                            </span>
                            {admin.email?.toLowerCase() !== MAIN_SUPER_ADMIN_EMAIL && (
                                <span
                                    title="Delete"
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => openDeleteModal(admin)}
                                >
                                    <Trash2 color="red" size={18} />
                                </span>
                            )}
                        </div>
                    );
                }}
            />

            {/* Create Admin - Side Drawer */}
            <Modal
                isVisible={createModal}
                title="Create Admin"
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
                    <Controller
                        name="role"
                        control={createControl}
                        render={({ field }) => (
                            <Select
                                labelName="Role"
                                required
                                name="role"
                                options={ADMIN_ROLES}
                                value={field.value}
                                onChange={field.onChange}
                                inputError={createErrors.role?.message ?? null}
                            />
                        )}
                    />
                    <div className="space-y-1">
                        <label className="text-black text-sm md:text-[15px] opacity-80">
                            Default Password
                        </label>
                        <input
                            readOnly
                            value={defaultPassword}
                            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black bg-gray-100 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 italic">
                            The default password is the firstname in capital letters. The admin is advised to change the default password upon login.
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 pt-4">
                        <PrimaryButton type="submit" loading={loading}>
                            Create Admin
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Admin - Side Drawer */}
            <Modal
                isVisible={editModal}
                title="Edit Admin"
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
                    <Controller
                        name="role"
                        control={editControl}
                        render={({ field }) => (
                            <Select
                                labelName="Role"
                                required
                                name="role"
                                options={ADMIN_ROLES}
                                value={field.value}
                                onChange={field.onChange}
                                inputError={editErrors.role?.message ?? null}
                            />
                        )}
                    />

                    <div className="w-full md:w-1/2 pt-4">
                        <PrimaryButton type="submit" loading={loading}>
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Admin - Center Modal */}
            <Modal
                isVisible={deleteModal}
                title="Delete Admin"
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
                                Delete
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Admins;