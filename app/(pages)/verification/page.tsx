"use client";

import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import OtpInput from "@/app/components/ui/otpInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { maskEmail, maskPhone } from "@/app/utils/reUsableFunction";
import { MessageSquareText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const BvnValidation: React.FC = () => {
    const router = useRouter();
    const param = useSearchParams();
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
        bvnData: {
            firstName: "Oluwapelumi",
            lastName: "Ifaniyi",
            dateOfBirth: "1990-01-01",
            address: "123 Main St, Lagos, Nigeria",
            gender: "Male",
            phoneNumber: "08123456789",
            email: "ifaniyiOluwapelumi@gmail.com",
        },
    })

    const verifyBVN = () => {
        if (accountInformation.bvn.length !== 11) {
            setBvnInputError("BVN must be 11 digits long.");
            return;
        }
        setBvnInputError(null);
        setVerificationModal(true);
    }

    const verifyOtp = () => {
        const accountCategory = selectedAccount.category
        if (accountCategory === "Individual") {
            router.push(`/accounts/individual?account=${btoa(JSON.stringify(accountInformation))}`);
        } else if (accountCategory === "Corporate") {
            router.push(`/accounts/corporate?account=${btoa(JSON.stringify(accountInformation))}`);
        } else if (accountCategory === "POS / Merchant") {
            router.push(`/accounts/merchant?account=${btoa(JSON.stringify(accountInformation))}`);
        }
        console.log("Verifying OTP:", otp);
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
                    <h2 className="text-2xl md:text-2xl font-bold mb-1">BVN Validation</h2>
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
                        <PrimaryButton onClick={verifyBVN} >Verify</PrimaryButton>
                    </div>
                </div>

                <Modal isVisible={consentModal}
                    onClose={() => { router.back() }}
                    size="sm"
                    type="center" title="Data Consent">
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
                    type="center" title="OTP Verification">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-secondary rounded-full w-11 h-11 flex items-center justify-center">
                            <MessageSquareText size={18} className="text-primary" />
                        </div>

                        <p className="text-[16px] font-bold pt-2">
                            Enter Verification Code
                        </p>
                        <p className="text-xs mb-2 text-gray-500  pt-2 text-center mx-10">
                            We've sent a 6-digit code to your registered phone number or email address ending in {maskPhone(accountInformation.bvnData.phoneNumber)}
                            or {maskEmail(accountInformation.bvnData.email)}
                        </p>
                        <div className="overflow-hidden mb-5 mt-2 mx-1">
                            <OtpInput length={6} onChange={(value) => { setOtp(value) }} />
                        </div>

                    </div>
                    <div className="flex justify-end mt-4 gap-10 mx-6">
                        <PrimaryButton variant="secondary" onClick={() => { setVerificationModal(false) }}>Cancel</PrimaryButton>
                        <PrimaryButton onClick={verifyOtp}>Verify</PrimaryButton>
                    </div>

                    <p className="text-xs mt-6 text-gray-500 mx-10 text-center">
                        Didn't receive the code? <span className="text-primary cursor-pointer font-bold">Resend</span>
                    </p>
                </Modal>

            </div>
        </div>
    );
}

export default BvnValidation;