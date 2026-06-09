"use client"
import Input from "@/app/components/ui/input";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { PasswordResetMapper } from "@/app/utils/mapper/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PasswordResetSchema, VerificationCodeSchema } from "@/app/utils/validationSchema/VerificationCodeSchema";
import OtpInput from "@/app/components/ui/otpInput";
import { toast } from "@/app/components/toast/useToast";
import { MoveLeft } from "lucide-react";
import { removeFromLocalStorage, saveToLocalStorage } from "@/app/utils/Utility/reUsableFunction";

const ForgotPassword = () => {
    const router = useRouter();
    const { loading, adminForgotPassword, otpVerification, adminUpdatePassword } = useApiEndPoints();
    const [otp, setOtp] = useState("");
    const [currentState, setCurrentState] = React.useState<"emailAddress" | "otpCode" | "resetPassword">("emailAddress")
    const { control, handleSubmit, formState: { errors } } = useForm<VerificationCodeSchema>({
        resolver: zodResolver(VerificationCodeSchema),
        defaultValues: {
            email: "",
        }
    });

    const { control: forgotPasswordControl, handleSubmit: forgotPasswordSubmit, formState: { errors: resetPasswordSchemaError } } = useForm<PasswordResetSchema>({
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    });

    const onSubmit = async (data: VerificationCodeSchema) => {
        const apiResponse = await adminForgotPassword(data.email);
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("bearerToken", apiResponse.data)
            setCurrentState("otpCode");
        }
    }

    const handleOtpVerification = async () => {
        if (otp.length !== 6) {
            toast({
                type: "error",
                title: "Invalid OTP",
                description: "OTP code must be 6 digits long",
            });
            return;
        }
        const apiResponse = await otpVerification(otp);
        if (apiResponse.statusCode === 200) {
            setCurrentState("resetPassword");
        }
    }

    const resetPassword = async (data: PasswordResetSchema) => {
        const payload = PasswordResetMapper(data);
        const apiResponse = await adminUpdatePassword(payload);
        if (apiResponse.statusCode === 200) {
            toast({
                type: "success",
                title: "Password Updated",
                description: "Your password has been updated successfully, please login with your new password",
            });
            removeFromLocalStorage("bearerToken")
            router.replace("/admin/auth")
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-full lg:w-[42%] px-6 md:px-10 ">
                <div className="flex items-center gap-4 md:gap-6 pt-8">
                    <div className="flex gap-2 items-center">
                        <div className="cursor-pointer" onClick={() => router.replace('/admin/auth')}>
                            <Image src="/images/imperialLogo.png" alt="Imperial Logo" width={40} height={40} className="w-10 h-10 " />
                        </div>
                        <div className="grid">
                            <h1 className="text-lg md:text-xl font-bold ">Account Opening</h1>
                            <p className="text-xs">Administrative Section</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center h-full ">
                    {
                        currentState === "emailAddress" && (
                            <>
                                <form className="w-full pt-10 mb-30" onSubmit={handleSubmit(onSubmit)}>
                                    <p className="text-md font-bold text-2xl text-primary">Forgot Password.</p>
                                    <p className="opacity-70 text-sm">
                                        Enter your email address and we’ll send a verification code to help you reset your password.
                                    </p>

                                    <div className="pt-10 gap-6 grid">
                                        <Controller name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    labelName="Email Address"
                                                    inputError={errors.email?.message} />
                                            )} />

                                    </div>

                                    <div className="justify-end pt-4 flex">
                                        <span className="text-black text-xs">
                                            Remember Password , <span onClick={() => router.replace("/admin/auth")} className="hover:cursor-pointer hover:opacity-100 text-primary font-bold hover:font-semibold">Sign In</span>
                                        </span>
                                    </div>

                                    <div className="w-1/2 md:w-1/3 mt-4">
                                        <PrimaryButton type="submit" loading={loading}>Reset Password</PrimaryButton>
                                    </div>
                                </form>
                            </>
                        )
                    }
                    {
                        currentState === "otpCode" && (
                            < div className="w-full pt-10 mb-30">
                                <MoveLeft className="cursor-pointer mb-5 text-primary" onClick={() => setCurrentState("emailAddress")} />
                                <p className="text-md font-bold text-2xl text-primary">VERIFY EMAIL ADDRESS.</p>
                                <p className="opacity-70 text-sm">
                                    Check your email for the verification code and enter it below to continue with password recovery.
                                </p>

                                <div className="mt-10 mb-15">
                                    <OtpInput length={6} onChange={(value) => { setOtp(value) }} />
                                </div>

                                <PrimaryButton loading={loading} onClick={handleOtpVerification}>
                                    Verify OTP
                                </PrimaryButton>
                            </div>
                        )
                    }
                    {
                        currentState === "resetPassword" && (
                            <>

                                <form className="w-full pt-10 mb-30" onSubmit={forgotPasswordSubmit(resetPassword)}>
                                    <MoveLeft className="cursor-pointer mb-5 text-primary" onClick={() => setCurrentState("otpCode")} />
                                    <p className="text-md font-bold text-2xl text-primary">Change Password.</p>
                                    <p className="opacity-70 text-sm">
                                        Enter your new password and confirm it below to complete the password reset process.
                                    </p>

                                    <div className="pt-10 gap-6 grid">
                                        <Controller name="password"
                                            control={forgotPasswordControl}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    type="password"
                                                    labelName="Password"
                                                    inputError={resetPasswordSchemaError.password?.message} />
                                            )} />
                                        <Controller name="confirmPassword"
                                            control={forgotPasswordControl}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    type="password"
                                                    labelName="Confirm Password"
                                                    inputError={resetPasswordSchemaError.confirmPassword?.message} />
                                            )} />

                                    </div>

                                    <div className="w-1/2 md:w-1/3 mt-4">
                                        <PrimaryButton type="submit" loading={loading}>Reset Password</PrimaryButton>
                                    </div>
                                </form>
                            </>
                        )
                    }

                </div>

            </div>

            <div className="w-[58%] hidden md:flex bg-cover bg-center"
                style={{ backgroundImage: "url('/images/bg-doodle.jpg')" }}>

            </div>
        </div>
    );
};

export default ForgotPassword;