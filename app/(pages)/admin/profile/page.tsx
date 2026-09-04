"use client";
import Input from "@/app/components/ui/input";
import PrimaryButton from "@/app/components/ui/primaryButton";
import PasswordRequirementIndicator from "@/app/components/ui/passwordRequirementIndicator";
import { toast } from "@/app/components/toast/useToast";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { AdminData } from "@/app/utils/Utility/Interfaces";
import { getFromLocalStorage, saveToLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { changeAdminPasswordSchema, type ChangeAdminPasswordSchema } from "@/app/utils/validationSchema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const Profile = () => {
    const { changePassword, loading } = useApiEndPoints();
    const adminData = getFromLocalStorage("adminDetails") as AdminData | null;

    const { control, handleSubmit, formState: { errors } } = useForm<ChangeAdminPasswordSchema>({
        resolver: zodResolver(changeAdminPasswordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        }
    });

    const watchedPassword = useWatch({ control, name: "password" });

    const initial = `${adminData?.firstname?.[0] ?? ""}${adminData?.lastname?.[0] ?? ""}`.toUpperCase() || "A";
    const role = adminData?.role ?? "Admin";

    const onSubmit = async (data: ChangeAdminPasswordSchema) => {
        const apiResponse = await changePassword(data);
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("adminDetails", { ...adminData, is_default_password: false });
            toast({
                type: "success",
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
            window.location.reload();
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <UserRound size={20} />
                    </div>
                    <h2 className="font-bold text-lg text-black">Personal Information</h2>
                </div>

                <div className="flex flex-col items-center py-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {initial}
                    </div>
                    <p className="font-bold text-black mt-4 text-lg">{adminData?.firstname} {adminData?.lastname}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary flex items-center gap-1">
                            <ShieldCheck size={14} />
                            {role}
                        </span>
                        {adminData?.is_super_admin && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                                <BadgeCheck size={14} />
                                Super Admin
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 w-24">Email Address</p>
                        <p className="text-sm text-black font-medium truncate">{adminData?.email ?? "-"}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 w-24">Default Password</p>
                        <p className={`text-sm font-medium ${adminData?.is_default_password ? "text-amber-600" : "text-emerald-600"}`}>
                            {adminData?.is_default_password ? "Yes - Consider changing" : "No"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <KeyRound size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-black">Change Password</h2>
                        <p className="text-xs text-gray-500 -mt-0.5">Keep your account secure by updating your password regularly.</p>
                    </div>
                </div>

                <form className="grid gap-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="current_password"
                        control={control}
                        render={({ field }) => (
                            <Input {...field}
                                required
                                type="password"
                                labelName="Current Password"
                                inputError={errors.current_password?.message} />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input {...field}
                                required
                                type="password"
                                labelName="New Password"
                                inputError={errors.password?.message} />
                        )}
                    />
                    <Controller
                        name="password_confirmation"
                        control={control}
                        render={({ field }) => (
                            <Input {...field}
                                required
                                type="password"
                                labelName="Confirm Password"
                                inputError={errors.password_confirmation?.message} />
                        )}
                    />
                    <PasswordRequirementIndicator password={watchedPassword} />

                    <div className="pt-2">
                        <PrimaryButton type="submit" loading={loading}>
                            Update Password
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;