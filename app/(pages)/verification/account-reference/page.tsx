"use client"
import TopBar from "@/app/components/navigation/topBar";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { cryptoHelper } from "@/app/utils/Utility/reUsableFunction";
import { BankAccountReferenceFormInputs, bankAccountReferenceSchema } from "@/app/utils/validationSchema/bankAccountReferenceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, User } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";

function AccountReferenceContent() {
    const param = useSearchParams();
    const router = useRouter();
    const { loading, addBankAccountReference } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const accountNumber = cryptoHelper.decrypt(param.get("acc"));
    const accountTypeId = cryptoHelper.decrypt(param.get("ty"));
    const accountName = cryptoHelper.decrypt(param.get("accName"));
    const { control, handleSubmit, formState: { errors } } = useForm<BankAccountReferenceFormInputs>({
        resolver: zodResolver(bankAccountReferenceSchema),
        defaultValues: {
            referee1Name: "",
            referee1Email: "",
            referee1Mobile: "",
            referee1Phone: "",
            referee2Name: "",
            referee2Email: "",
            referee2Mobile: "",
            referee2Phone: "",
        }
    });

    const onSubmit = async (data: BankAccountReferenceFormInputs) => {
        const payloadData = {
            account_type_id: Number(accountTypeId),
            account_number: accountNumber,
            account_name: accountName,
            referee: [
                {
                    name: data.referee1Name,
                    email_address: data.referee1Email,
                    mobile_number: data.referee1Mobile,
                    phone_number: data.referee1Phone ?? null,
                },
                {
                    name: data.referee2Name,
                    email_address: data.referee2Email,
                    mobile_number: data.referee2Mobile,
                    phone_number: data.referee2Phone ?? null,
                },
            ],
        };

        const apiResponse = await addBankAccountReference(payloadData);
        if (apiResponse.statusCode === 200) setSuccessModal(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" />
            <div className="flex-1 pt-24 p-6 md:px-14">
                <h2 className="text-xl md:text-2xl font-bold md:mb-1">
                    Bank Account Reference Submission
                </h2>
                <p className="text-xs md:text-sm">
                    To complete your account opening process, please provide details of two referees who can confirm your banking relationship.
                </p>
                <div className="grid md:flex mt-10 gap-8 ">
                    <div className="w-full md:w-1/3 order-2 md:order-1">
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary text-white py-3 px-6 flex gap-4">
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
                    <div className="w-full md:w-2/3 order-1 md:order-2">
                        <div className="border border-gray-300 font-bold rounded-t-lg bg-primary text-white py-3 px-6 flex gap-4">
                            <Book /> Account Reference Form
                        </div>
                        <div className="rounded-b-lg border border-gray-300  border-t-0 pb-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <Controller name="referee1Name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Referee 1 Name"
                                                inputError={errors.referee1Name?.message} />
                                        )} />
                                    <Controller name="referee1Email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Referee 1 Email Address"
                                                inputError={errors.referee1Email?.message} />
                                        )} />
                                    <Controller
                                        name="referee1Mobile"
                                        control={control}
                                        render={({ field }) => (
                                            <PhoneNumberInput {...field}
                                                required
                                                labelName="Referee 1 Mobile Number"
                                                inputError={errors.referee1Mobile?.message} />
                                        )}
                                    />
                                </div>
                                <div className="px-3 md:px-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <Controller name="referee2Name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Referee 2 Name"
                                                inputError={errors.referee2Name?.message} />
                                        )} />
                                    <Controller name="referee2Email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field}
                                                required
                                                labelName="Referee 2 Email Address"
                                                inputError={errors.referee2Email?.message} />
                                        )} />
                                    <Controller
                                        name="referee2Mobile"
                                        control={control}
                                        render={({ field }) => (
                                            <PhoneNumberInput {...field}
                                                required
                                                labelName="Referee 2 Mobile Number"
                                                inputError={errors.referee2Mobile?.message} />
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
                subTitle=""
                cancelIcon={true}
                isVisible={successModal}
                type="center"
                onClose={() => router.replace("/")}>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
                    <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-6">Reference Submitted!</p>

                    <div className="mx-6  flex items-center justify-center flex-col text-center">
                        <p className="text-black/50 md:text-[14px] pb-6">Your account reference has been submitted successfully. The referees you provided will be notified to verify your information. Thank you.</p>

                    </div>


                </div>
            </Modal>


            <footer className="bg-secondary text-center items-center flex flex-col text-xs py-4 gap-2 border-t border-black">
                <p>Copyright © Imperial Homes Mortgage Bank</p>
                <p>
                    Licensed by the Central Bank of Nigeria. All deposits are insured by Nigeria Deposit Insurance
                    Corporation.
                </p>
            </footer>
        </div>
    );
};
export default function AccountReference() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <AccountReferenceContent />
        </Suspense>
    );
}