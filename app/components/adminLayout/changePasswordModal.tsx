"use client";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import PasswordRequirementIndicator from "@/app/components/ui/passwordRequirementIndicator";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { getFromLocalStorage, saveToLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { changeAdminPasswordSchema, type ChangeAdminPasswordSchema } from "@/app/utils/validationSchema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "@/app/components/toast/useToast";

interface ChangePasswordModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isVisible, onClose }) => {
    const { changePassword, loading } = useApiEndPoints();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<ChangeAdminPasswordSchema>({
        resolver: zodResolver(changeAdminPasswordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        }
    });

    const watchedPassword = useWatch({ control, name: "password" });

    useEffect(() => {
        if (isVisible) {
            reset({ current_password: "", password: "", password_confirmation: "" });
        }
    }, [isVisible, reset]);

    const onSubmit = async (data: ChangeAdminPasswordSchema) => {
        const apiResponse = await changePassword(data);
        if (apiResponse.statusCode === 200) {
            const adminDetails = getFromLocalStorage("adminDetails") as Record<string, any> | null;
            saveToLocalStorage("adminDetails", { ...(adminDetails ?? {}), is_default_password: false });
            toast({
                type: "success",
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
            onClose();
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            title=""
            size="sm"
            type="center"
            cancelIcon={false}
            onClose={onClose}
        >
            <div className="pb-8">
                <div className="flex flex-col items-center text-center px-8 pt-2 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg mb-4">
                        <KeyRound size={26} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black">Secure Your Account</h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-sm leading-relaxed">
                        You are signed in with a default password. Create a new password to keep your account secure.
                    </p>
                </div>

                <form className="grid gap-4 px-8" onSubmit={handleSubmit(onSubmit)}>
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

                    <div className="pt-1">
                        <PrimaryButton type="submit" loading={loading}>
                            Change Password
                        </PrimaryButton>
                    </div>
                    <p className="text-center text-[11px] text-gray-500">
                        Use at least 8 characters. We recommend a mix of letters, numbers and symbols.
                    </p>
                </form>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;