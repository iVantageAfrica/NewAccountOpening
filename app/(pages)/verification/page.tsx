"use client";

import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import OtpInput from "@/app/components/ui/otpInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { bvnDataClean, formatTime, maskEmail, maskPhone, removeFromLocalStorage, saveToLocalStorage } from "@/app/utils/reUsableFunction";
import { MessageSquareText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

const BvnValidation: React.FC = () => {
    const { verifyUserBvn, loading, resendBVNOTPCode, otpVerification } = useApiEndPoints();
    const router = useRouter();
    const param = useSearchParams();
    const [timer, setTimer] = useState(0);
    const [otp, setOtp] = useState("");
    const accountData = atob(param.get("account") || "");
    const selectedAccount = JSON.parse(accountData);
    const [consentModal, setConsentModal] = useState(true);
    const [verificationModal, setVerificationModal] = useState(false);
    const [bvnInputError, setBvnInputError] = useState<string | null>(null);
    const [accountInformation, setAccountInformation] = useState<{
        bvn: string;
        accountInformation: object;
        bvnData: Record<string, any>;
    }>({
        bvn: "",
        accountInformation: selectedAccount,
        bvnData: {},
    })

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimer = () => {
        setTimer(180);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const verifyBVN = async () => {
        if (accountInformation.bvn.length !== 11) {
            setBvnInputError("BVN must be 11 digits long.");
            return;
        }
        setBvnInputError(null);
        const apiResponse = await verifyUserBvn(accountInformation.bvn)
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("bearerToken",  apiResponse.data.authToken)
            setAccountInformation((prev) => ({ ...prev, bvnData: apiResponse.data }))
            setVerificationModal(true);
            startTimer();
        }
    }

    const resendOTP = async () => {
        const userEmailAddress = accountInformation.bvnData.emailAddress;
        const apiResponse = await resendBVNOTPCode(userEmailAddress)
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("bearerToken",  apiResponse.data)
            startTimer()
        }
    }

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            return;
        }
        const apiResponse = await otpVerification(otp);
        if (apiResponse.statusCode === 200) {
            removeFromLocalStorage("bearerToken")
            saveToLocalStorage("isAuthenticated", true)
            bvnDataClean(apiResponse.data.bvnData)
            const accountCategory = selectedAccount.category;
            const accountId = selectedAccount.id;

            const routeMap: Record<string, string> = {
                "Individual-1": "/accounts/individual/current",
                "Individual-2": "/accounts/individual/savings",
                "Corporate": `/accounts/corporate/?account=${btoa(JSON.stringify(selectedAccount))}`,
                "Merchant": `/accounts/corporate/?account=${btoa(JSON.stringify(selectedAccount))}`,
            };

            const routeKey = accountCategory === "Individual"? `${accountCategory}-${accountId}` : accountCategory;
            router.push(routeMap[routeKey]);
        }
    };


    return (
        <div className="relative">
            <TopBar showArrow={true} description={`${selectedAccount.category} / ${selectedAccount.name}`} />
            <div className="pt-28">
                <StepProgress
                    steps={["BVN Verification", "Personal Details", "Upload Documents"]}
                    activeStep={1}
                />

                <div className="p-6 md:px-20">
                    <h2 className="text-xl font-bold mb-1">BVN Validation</h2>
                    <p className="text-xs mb-6">
                        Please enter your Bank Verification Number (BVN) to proceed with the account opening process.
                    </p>

                    <div className="mt-10 gap-8 flex flex-col">
                        <Input
                            name="bvn"
                            required
                            maxLength={11}
                            type="number"
                            labelName="BVN"
                            inputError={bvnInputError}
                            value={accountInformation.bvn}
                            placeholder="Enter your 11 digit BVN e.g 01234567891"
                            onChange={(e) => {
                                const userBvn = e.target.value.replace(/\D/g, '');
                                setAccountInformation({ ...accountInformation, bvn: userBvn })
                            }}
                        />
                        <PrimaryButton onClick={verifyBVN} loading={loading} >Verify</PrimaryButton>
                    </div>
                </div>

                <Modal isVisible={consentModal}
                    onClose={() => { router.back() }}
                    size="sm"
                    type="center"
                    cancelIcon={false}
                    title="Data Consent">
                    <div className="px-8">
                        <p className="text-xs mb-4 text-gray-500 text-justify">
                            By proceeding, you agree to provide accurate personal information and consent to data processing in accordance with our privacy policy.
                        </p>
                        <p className="text-xs mb-4 text-gray-500 text-justify">
                            Your information will be securely stored and used only for account opening and verification purposes.
                        </p>
                        <div className="flex flex-col md:flex-row justify-end mt-4 gap-4 md:gap-6">
                            <div className="order-1 md:order-0 w-full">
                                <PrimaryButton variant="secondary" onClick={() => { router.back() }}>Cancel</PrimaryButton>
                            </div>
                            <div className="w-full">
                                <PrimaryButton onClick={() => setConsentModal(false)}>Accept & Continue</PrimaryButton>
                            </div>
                        </div>
                    </div>

                </Modal>


                <Modal isVisible={verificationModal}
                    onClose={() => { setVerificationModal(false) }}
                    size="sm"
                    type="center"
                    cancelIcon={false}
                    title="OTP Verification">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-secondary rounded-full w-11 h-11 flex items-center justify-center">
                            <MessageSquareText size={18} className="text-primary" />
                        </div>

                        <p className="text-[16px] font-bold pt-2 dark:text-black">
                            Enter Verification Code
                        </p>
                        <p className="text-xs mb-2 text-gray-500  pt-2 text-center mx-10 ">
                            We've sent a 6-digit code to your registered phone number or email address ending
                            in {maskPhone(accountInformation.bvnData?.phoneNumber)} or {maskEmail(accountInformation.bvnData?.emailAddress || "")}
                        </p>
                        <div className="overflow-hidden mb-5 mt-2 mx-1">
                            <OtpInput length={6} onChange={(value) => { setOtp(value) }} />
                        </div>

                    </div>
                    <div className="flex justify-end mt-4 gap-10 mx-6">
                        <PrimaryButton variant="secondary" onClick={() => { setVerificationModal(false) }}>Cancel</PrimaryButton>
                        <PrimaryButton onClick={verifyOtp} loading={loading}>Verify</PrimaryButton>
                    </div>

                    <p className="text-xs mt-6 text-gray-500 mx-10 text-center">
                        {timer > 0 ? (
                            <>Request new OTP in <span className="text-primary font-bold">{formatTime(timer)}</span></>
                        ) : (
                            <>
                                Didn't receive the code?{" "}
                                <span
                                    className="text-primary cursor-pointer font-bold"
                                    onClick={resendOTP}
                                >
                                    Resend
                                </span>
                            </>
                        )}
                    </p>
                </Modal>

            </div>
        </div>
    );
}

export default BvnValidation;