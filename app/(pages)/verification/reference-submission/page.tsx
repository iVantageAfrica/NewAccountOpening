"use client"
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import Select from "@/app/components/ui/selectInput";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { referenceSubmissionMapper } from "@/app/utils/mapper/referenceSubmission";
import { cryptoHelper } from "@/app/utils/reUsableFunction";
import { bankAccountReferenceSubmissionSchema } from "@/app/utils/validationSchema/bankAccountReferenceSubmissionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, User } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AccountReferenceSubmission = () => {
    const param = useSearchParams();
    const router = useRouter();
    const { loading, accountReferenceSubmission } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const accountNumber = cryptoHelper.decrypt(param.get("acc"));
    const accountTypeId = cryptoHelper.decrypt(param.get("ty"));
    const accountName = cryptoHelper.decrypt(param.get("acNa"));
    const referenceId = cryptoHelper.decrypt(param.get("refId"));

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(bankAccountReferenceSubmissionSchema),
        defaultValues: {
            bankName: "",
            accountName: "",
            accountType: "",
            accountNumber: "",
            signature: null,
        }
    });

    const onSubmit = async (data: FormData) => {
        const payload = referenceSubmissionMapper(data, referenceId)
        const apiResponse = await accountReferenceSubmission(payload)
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
        }
    };



    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" />
            <div className="flex-1 pt-24 p-6 md:px-14">
                <h2 className="text-xl md:text-2xl font-bold md:mb-1">
                    Bank Account Reference Confirmation
                </h2>
                <p className="text-xs md:text-sm">
                    Kindly complete this form to verify that you are serving as a bank account reference for the account.
                </p>
                <div className="grid md:flex mt-10 gap-8 ">
                    <div className="w-full md:w-1/3">
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary dark:bg-white text-white dark:text-black py-3 px-6 flex gap-4">
                            <User /> Account Details
                        </div>
                        <div className="border border-gray-300 rounded-b-lg py-3 px-4 border-t-0">
                            <div className="grid mb-2">
                                <span className="text-sm md:text-base font-bold opacity-70">Account Type</span>
                                <span className="text-sm ml-4 -mt-1">{accountTypeId === '1' ? "Current" : "Corporate"} Account</span>
                            </div>
                            <div className="grid mb-2">
                                <span className="text-sm md:text-base font-bold opacity-70">Account Number</span>
                                <span className=" text-sm ml-4 -mt-1">{accountNumber}</span>
                            </div>
                            <div className="grid mb-2">
                                <span className="text-sm md:text-base font-bold opacity-70">Account Name</span>
                                <span className="text-sm ml-4 -mt-1">{accountName}</span>
                            </div>

                        </div>
                    </div>
                    <div className="w-full md:w-2/3 ">
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary dark:bg-white text-white dark:text-black py-3 px-6 flex gap-4">
                            <Book /> Account Confirmation Form
                        </div>
                        <div className="rounded-b-lg border border-gray-300  border-t-0 pb-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <Controller name="accountName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Account Name"
                                                inputError={errors.accountName?.message} />
                                        )} />
                                    <Controller name="accountNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Account Number"
                                                type="number"
                                                inputError={errors.accountNumber?.message} />
                                        )} />

                                    <Controller name="bankName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Bank Name"
                                                type="text"
                                                inputError={errors.bankName?.message} />
                                        )} />
                                    <Controller
                                        name="accountType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field}
                                                required
                                                labelName="Account Type"
                                                inputError={errors.accountType?.message}
                                                options={[
                                                    { label: "Current", value: "Current Account" },
                                                    { label: "Corporate", value: "Corporate Account" }
                                                ]} />
                                        )}
                                    />
                                    <Controller
                                        name="signature"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadInput {...field}
                                                required
                                                fileType="image/jpeg,image/png"
                                                description="Upload a copy of your signature"
                                                inputError={errors.signature?.message}
                                                labelName="Signature" onFileChange={(file) => field.onChange(file)} />
                                        )}
                                    />
                                </div>
                                <div className="px-3 md:px-6">

                                    <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal size="sm"
                title=""
                isVisible={successModal}
                type="center"
                onClose={() => router.replace("/")}>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
                    <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-6">Thank You!</p>

                    <div className="mx-6  flex items-center justify-center flex-col text-center">
                        <p className="text-black/50 md:text-[14px] pb-6"> Your reference information has been submitted successfully. We appreciate
    your time and support. The bank will review the details provided.</p>

                    </div>


                </div>
            </Modal>

            <footer className="bg-secondary text-center items-center flex flex-col text-xs py-4 gap-2 border-t border-black dark:text-black">
                <p>Copyright © Imperial Homes Mortgage Bank</p>
                <p>
                    Licensed by the Central Bank of Nigeria. All deposits are insured by Nigeria Deposit Insurance
                    Corporation.
                </p>
            </footer>
        </div>
    );
};

export default AccountReferenceSubmission;