"use client"
import TopBar from "@/app/components/navigation/topBar";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import Select from "@/app/components/ui/selectInput";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { accountUpdateMapper } from "@/app/utils/mapper/accountUpdateMapper";
import { cryptoHelper } from "@/app/utils/Utility/reUsableFunction";
import { STATES_AND_LGAS } from "@/app/utils/Utility/stateLocalGovt";
import { AccountUpdateFormInputs, accountUpdateSchema } from "@/app/utils/validationSchema/accountUpdateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, User } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

function AccountUpdateContent() {
    const param = useSearchParams();
    const router = useRouter();
    const { loading, individualAccountUpdate } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const accountNumber = cryptoHelper.decrypt(param.get("acc")) ?? "";
    const accountTypeId = cryptoHelper.decrypt(param.get("ty"));
    const accountName = cryptoHelper.decrypt(param.get("accName"));
    const { control, handleSubmit, formState: { errors } } = useForm<AccountUpdateFormInputs>({
        resolver: zodResolver(accountUpdateSchema),
        defaultValues: {
            mothersMaidenName: "",
            phoneNumber: "",
            emailAddress: "",
            employmentStatus: "",
            employer: "",
            maritalStatus: "",
            houseNumber: "",
            street: "",
            origin: "",
            lga: "",
            city: "",
            state: "",
            nextOfKinName: "",
            nextOfKinAddress: "",
            nextOfKinRelationship: "",
            accountOfficer: "",
            nextOfKinPhone: "",
        }
    });

    const onSubmit = async (data: AccountUpdateFormInputs) => {
         const payload = accountUpdateMapper(data, accountNumber);
        const apiResponse = await individualAccountUpdate(payload);
        if (apiResponse.statusCode === 200) setSuccessModal(true);
    };

    const selectedState = useWatch({
        control,
        name: "origin",
    });

    const lgaOptions =
        STATES_AND_LGAS.find(s => s.state === selectedState)?.lgas || [];


    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" />
            <div className="flex-1 pt-24 p-6 md:px-14">
                <h2 className="text-xl md:text-2xl font-bold md:mb-1">
                    Account Information Update
                </h2>
                <p className="text-xs md:text-sm">
                    Update your bank account information to ensure your details remain accurate and secure.
                </p>
                <div className="grid md:flex mt-10 gap-8 ">
                    <div className="w-full md:w-1/3 ">
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
                            <Book /> Account Information
                        </div>
                        <form className="rounded-b-lg border border-gray-300  border-t-0 pb-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Controller
                                    name="mothersMaidenName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Mother's Maiden Name"
                                            inputError={errors.mothersMaidenName?.message} />
                                    )}
                                />
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            labelName="Phone Number"
                                            inputError={errors.phoneNumber?.message} />
                                    )}
                                />
                                <Controller
                                    name="emailAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Email Address"
                                            required
                                            inputError={errors.emailAddress?.message} />
                                    )}
                                />

                                <Controller
                                    name="employmentStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            required
                                            labelName="Employment Status"
                                            inputError={errors.employmentStatus?.message}
                                            options={[
                                                { label: "Employed", value: "Employed" },
                                                { label: "Self-Employed", value: "Self Employed" },
                                            ]} />
                                    )}
                                />
                                <Controller name="employer"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Employer"
                                            inputError={errors.employer?.message} />
                                    )} />
                                <Controller
                                    name="maritalStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            required
                                            labelName="Marital Status"
                                            inputError={errors.maritalStatus?.message}
                                            options={[
                                                { label: "Single", value: "Single" },
                                                { label: "Married", value: "Married" },
                                            ]} />
                                    )}
                                />
                                <Controller
                                    name="origin"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            required
                                            labelName="State of Origin"
                                            inputError={errors.origin?.message}
                                            options={STATES_AND_LGAS.map(s => ({
                                                label: s.state,
                                                value: s.state,
                                            }))}
                                        />
                                    )}
                                />

                                <Controller
                                    name="lga"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            required
                                            labelName="Local Government"
                                            inputError={errors.lga?.message}
                                            options={lgaOptions.map(lga => ({
                                                label: lga,
                                                value: lga,
                                            }))}
                                            disabled={!selectedState}
                                        />
                                    )}
                                />
                                <Controller name="houseNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="House Number"
                                            inputError={errors.houseNumber?.message} />
                                    )} />
                                <Controller name="street"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Street"
                                            inputError={errors.street?.message} />
                                    )} />
                                <Controller name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="City"
                                            inputError={errors.city?.message} />
                                    )} />


                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            required
                                            labelName="State of Residence"
                                            inputError={errors.state?.message}
                                            options={STATES_AND_LGAS.map(s => ({
                                                label: s.state,
                                                value: s.state,
                                            }))}
                                        />
                                    )}
                                />

                                <Controller name="nextOfKinName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Next of Kin Name"
                                            inputError={errors.nextOfKinName?.message} />
                                    )} />
                                <Controller name="nextOfKinAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Next of Kin Address"
                                            inputError={errors.nextOfKinAddress?.message} />
                                    )} />
                                <Controller name="nextOfKinRelationship"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Next of Kin Relationship"
                                            inputError={errors.nextOfKinRelationship?.message} />
                                    )} />
                                <Controller
                                    name="nextOfKinPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            required
                                            labelName="Next of Kin Phone Number"
                                            inputError={errors.nextOfKinPhone?.message} />
                                    )}
                                />
                                <Controller
                                    name="accountOfficer"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Account Officer / Referer"
                                            inputError={errors.accountOfficer?.message} />
                                    )}
                                />

                            </div>

                            <div className="mx-3 lg:mx-6">
                                <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                            </div>
                        </form>
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
            <AccountUpdateContent />
        </Suspense>
    );
}