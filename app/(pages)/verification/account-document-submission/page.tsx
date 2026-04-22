"use client"
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Modal from "@/app/components/ui/modal";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { accountDocumentMapper } from "@/app/utils/mapper/accountDocumentMapper";
import { cryptoHelper } from "@/app/utils/Utility/reUsableFunction";
import { accountDocumentSubmissionSchema } from "@/app/utils/validationSchema/documentSubmissionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, User } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

function AccountDocumentSubmissionContent() {
     type FormData = z.infer<typeof accountDocumentSubmissionSchema>;
    const param = useSearchParams();
    const router = useRouter();
    const { loading, accountDocumentAddition } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const accountNumber = cryptoHelper.decrypt(param.get("acc")) ??"";
    const accountTypeId = cryptoHelper.decrypt(param.get("ty"));
    const accountName = cryptoHelper.decrypt(param.get("accName"));


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(accountDocumentSubmissionSchema),
        defaultValues: {
            signature: null,
            utilityBill: null,
            validId: null,
            passport: null,
        }
    });

    const onSubmit = async (data: FormData) => {
        const payload = accountDocumentMapper(data, accountNumber)
        const apiResponse = await accountDocumentAddition(payload)
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
        }
    };



    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" />
            <div className="flex-1 pt-24 p-6 md:px-14">
                <h2 className="text-xl md:text-2xl font-bold md:mb-1">
                    Account Document Submission
                </h2>
                <p className="text-xs md:text-sm">
                    Please complete this form to submit all required documents needed to verify your account.
                </p>
                <div className="grid md:flex mt-10 gap-8 ">
                    <div className="w-full md:w-1/3">
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary text-white py-3 px-6 flex gap-4">
                            <User /> Account Details
                        </div>
                        <div className="border border-gray-300 rounded-b-lg py-3 px-4 border-t-0">
                            <div className="grid mb-2">
                                <span className="text-sm md:text-base font-bold opacity-70">Account Type</span>
                                    <span className="text-sm ml-4 -mt-1">{accountTypeId === '1' ? "Current"  : accountTypeId === '2' ? "Savings" : "Corporate"} Account</span>
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
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary text-white py-3 px-6 flex gap-4">
                            <Book /> Document Submission Form
                        </div>
                        <div className="rounded-b-lg border border-gray-300  border-t-0 pb-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                  <Controller
                                        name="passport"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadInput {...field}
                                                required
                                                fileType="image/jpeg,image/png"
                                                description="Upload a copy of your passport"
                                                inputError={errors.passport?.message}
                                                labelName="Passport" onFileChange={(file) => field.onChange(file)} />
                                        )}
                                    />
                                     <Controller
                                        name="validId"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadInput {...field}
                                                required
                                                fileType="image/jpeg,image/png"
                                                description="Upload a copy of your valid ID (Driver's License, National ID, Voter's Card)"
                                                inputError={errors.validId?.message}
                                                labelName="Valid ID" onFileChange={(file) => field.onChange(file)} />
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
                                    <Controller
                                        name="utilityBill"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadInput {...field}
                                                required
                                                fileType="image/jpeg,image/png"
                                                description="Upload a copy of your utility bill"
                                                inputError={errors.utilityBill?.message}
                                                labelName="Utility Bill" onFileChange={(file) => field.onChange(file)} />
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
                cancelIcon={true}
                onClose={() => router.replace("/")}>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
                    <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-6">Thank You!</p>

                    <div className="mx-6  flex items-center justify-center flex-col text-center">
                        <p className="text-black/50 md:text-[14px] pb-6"> Your document has been submitted successfully. Thank you for providing the required information. Our team will review the details and update your account accordingly.</p>

                    </div>


                </div>
            </Modal>

            <footer className="bg-secondary text-center items-center flex flex-col text-xs py-4 gap-2 border-t border-black ">
                <p>Copyright © Imperial Homes Mortgage Bank</p>
                <p>
                    Licensed by the Central Bank of Nigeria. All deposits are insured by Nigeria Deposit Insurance
                    Corporation.
                </p>
            </footer>
        </div>
    );
};

export default function AccountDocumentSubmission() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <AccountDocumentSubmissionContent />
        </Suspense>
    );
}