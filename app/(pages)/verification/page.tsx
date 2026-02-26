"use client";

import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import OtpInput from "@/app/components/ui/otpInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { accountTypes } from "@/app/index/accountTypes";
import { bvnDataClean, formatTime, maskEmail, maskPhone, removeFromLocalStorage, saveToLocalStorage } from "@/app/utils/Utility/reUsableFunction";
import { CircleCheck, MessageSquareText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useRef, useState } from "react";

function BvnValidationContent(){
    const { verifyUserBvn, loading, resendBVNOTPCode, otpVerification } = useApiEndPoints();
    const router = useRouter();
    const param = useSearchParams();
    const [timer, setTimer] = useState(0);
    const [otp, setOtp] = useState("");
    const accountData = atob(param.get("account") || "");
    const selectedAccount = JSON.parse(accountData);
    const selectedAccountRequirements = accountTypes.find((account) => account.id === selectedAccount.id);
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
        const apiResponse = await verifyUserBvn(accountInformation.bvn, selectedAccount.id);
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("bearerToken", apiResponse.data.authToken)
            setAccountInformation((prev) => ({ ...prev, bvnData: apiResponse.data }))
            setVerificationModal(true);
            startTimer();
        }
    }

    const resendOTP = async () => {
        const userEmailAddress = accountInformation.bvnData.emailAddress;
        const apiResponse = await resendBVNOTPCode(userEmailAddress)
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("bearerToken", apiResponse.data)
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

            const routeKey = accountCategory === "Individual" ? `${accountCategory}-${accountId}` : accountCategory;
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

                <div className="p-6 md:px-20 flex flex-col md:flex-row gap-10 lg:gap-20">
                    <div className="w-full lg:w-[55%]">
                        <h2 className="text-xl font-bold mb-1 text-primary">BVN Validation</h2>
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
                    {
                        selectedAccountRequirements && (
                            <div className="grid">
                                <h2 className="text-lg font-bold text-primary">{selectedAccountRequirements.name} Features</h2>
                                <p className="text-xs mb-3 mt-2 lg:mt-0">The following are features and benefits attached to a {selectedAccountRequirements.name} Account:</p>

                                <ul className="text-xs ml-1.5 gap-y-1.5 grid">
                                    {selectedAccountRequirements.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start text-[11px]">
                                            <CircleCheck
                                                size={12}
                                                className="mr-2 text-primary shrink-0"
                                            />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <h2 className="text-lg font-bold text-primary mt-10">{selectedAccountRequirements.name} Minimum Requirement</h2>
                                <p className="text-xs mb-3 mt-2 lg:mt-0">The following are minimum requirement to open a {selectedAccountRequirements.name} Account:</p>

                                <ul className="text-xs ml-1.5 gap-y-1.5 grid">
                                    {selectedAccountRequirements.requirements.map((requirement, index) => (
                                        <li key={index} className="flex items-start text-[11px]">
                                            <CircleCheck
                                                size={12}
                                                className="mr-2 text-primary shrink-0"
                                            />
                                            {requirement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }

                </div>

                <Modal isVisible={consentModal}
                    onClose={() => { router.back() }}
                    size="md"
                    type="side"
                    cancelIcon={false}
                    title="DATA CONSENT DECLARATION">
                    <div className="">
                        <p className="font-bold text-black mb-2 text-sm"> Imperial Homes Mortgage Bank</p>
                        <p className="text-xs mb-2 text-gray-500 text-justify">
                            By proceeding with this account opening process, you confirm that you <span className="text-black font-bold">voluntarily give your
                                consent</span> to <span className="text-black font-bold">Imperial Homes Mortgage Bank</span> to collect, process, verify, and use your personal
                            information strictly for the purpose of opening and managing your bank account, in line with
                            applicable regulatory requirements.
                        </p>
                        {/* Personal Information */}
                        <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-1">
                            <p>
                                <span className="font-bold text-black">1. Consent to Use Personal Information</span>
                                <br />
                                I hereby consent to <span className="font-bold text-black">Imperial Homes Mortgage Bank</span>
                                collecting and processing my personal information, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>My personal identification details</li>
                                <li>Contact information</li>
                                <li>Uploaded KYC documents</li>
                                <li>
                                    <span className="font-bold text-black">Bank Verification Number (BVN)</span>
                                </li>
                                <li>
                                    <span className="font-bold text-black">National Identification Number (NIN)</span>
                                </li>
                            </ul>
                            <p>
                                for the purpose of:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Opening and operating my bank account</li>
                                <li>Verifying my identity and conducting customer due diligence</li>
                                <li>
                                    Complying with <span className="font-bold text-black">
                                        CBN KYC, AML/CFT, and related regulatory requirements
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* BVN Consent */}

                        <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-1 pt-6">
                            <p>
                                <span className="font-bold text-black">2. BVN Consent via NIBSS</span>
                                <br />
                                I expressly authorize <span className="font-bold text-black">Imperial Homes Mortgage Bank</span> to:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    Request and obtain my <span className="font-bold text-black">BVN</span> information from the
                                    <span className="font-bold text-black"> Nigeria Inter-Bank Settlement System (NIBSS)</span>
                                </li>
                                <li>
                                    Send a One-Time Password <span className="font-bold text-black">(OTP)</span> to the phone number
                                    registered with my BVN
                                </li>
                                <li>
                                    Validate my consent using the OTP before accessing my BVN details
                                </li>
                            </ul>

                            <p>
                                I understand that failure to provide this consent or validate the OTP will prevent my account
                                opening from proceeding.
                            </p>
                        </div>

                        {/* Data Verification  */}
                        <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-1 pt-6">
                            <p>
                                <span className="font-bold text-black">3. Consent to Data Verification &amp; Sharing</span>
                                <br />
                                I consent to my information being verified and, where required, shared with:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    Regulatory and supervisory authorities
                                    (<span className="font-bold text-black">including CBN and NDIC</span>)
                                </li>
                                <li>
                                    Authorized third parties and service providers
                                    (<span className="font-bold text-black">including NIBSS</span>)
                                </li>
                                <li>
                                    Internal bank units responsible for compliance, operations, audit, and risk management
                                </li>
                            </ul>

                            <p>
                                strictly for lawful and regulatory purposes related to my account.
                            </p>
                        </div>

                        {/* Data Consent Withdrawal  */}
                        <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-1 pt-6">
                            <p>
                                <span className="font-bold text-black">4. Consent Duration &amp; Withdrawal</span>
                                <br />
                                I understand that:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    This consent remains valid for as long as my relationship with the bank exists or as required by law
                                </li>
                                <li>
                                    Withdrawal of consent may result in the inability of the bank to open or continue to operate my account
                                </li>
                            </ul>
                        </div>

                        {/* Consent Confirmation  */}
                        <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-1 py-6">
                            <p>
                                <span className="font-bold text-black">5. Consent Confirmation</span>
                                <br />
                                By selecting <span className="font-bold text-black">“I Agree”</span>, I confirm that:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>I have read and understood this Data Consent Declaration</li>
                                <li>I freely and voluntarily give my consent without any form of coercion</li>
                                <li>
                                    I authorize <span className="font-bold text-black">Imperial Homes Mortgage Bank</span> to process my data
                                    as described above
                                </li>
                            </ul>

                            <p>
                                If I do not agree, I understand that I cannot proceed with the account opening process.
                            </p>
                        </div>

                        <div className="sticky bottom-0 z-20 bg-white flex flex-col md:flex-row justify-between  gap-4 py-4 border-t border-gray-300">
                            <div className="order-1 md:order-0 w-full md:w-1/3">
                                <PrimaryButton variant="secondary" onClick={() => { router.back() }}>Cancel</PrimaryButton>
                            </div>
                            <div className="w-full md:w-1/3">
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

                        <p className="text-[16px] font-bold pt-2 ">
                            Enter Verification Code
                        </p>
                        <p className="text-xs mb-2 text-gray-500  pt-2 text-center mx-10 ">
                            We've sent a 6-digit code to your registered  email address ending
                            in <span className="text-black">{maskEmail(accountInformation.bvnData?.emailAddress || "")} </span>
                            or phone number ending with <span className="text-black">{maskPhone(accountInformation.bvnData?.phoneNumber)} </span>
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

export default function BvnValidation() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <BvnValidationContent />
        </Suspense>
    );
}