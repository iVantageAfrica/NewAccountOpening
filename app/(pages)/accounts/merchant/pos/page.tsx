"use client";
import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import { Accordion, AccordionItem } from "@/app/components/ui/accordion";
import AccountSuccess from "@/app/components/ui/accountSuccess";
import DetailsLabel from "@/app/components/ui/detailsLabel";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import RadioButton from "@/app/components/ui/radioButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { posAccountMapper } from "@/app/utils/mapper/posAccount";
import { getFromLocalStorage } from "@/app/utils/reUsableFunction";
import { PosMerchantAccountSchema } from "@/app/utils/validationSchema/posMerchantAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";

const POSMerchantAccount = () => {
    const router = useRouter();
    const { createPosMerchantAccount, loading } = useApiEndPoints();
    const [successModal, setSuccessModal] = React.useState(false);
    const [accountNumber, setAccountNumber] = React.useState("");
    const bvnData = getFromLocalStorage("bvnData");
    const [activeStep, setActiveStep] = React.useState(2);
    const [cacFileName, setCacFileName] = React.useState("");

    const handleCacUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("cacDocument", file);
            setCacFileName(file.name);
        }
    };
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(PosMerchantAccountSchema),
        defaultValues: {
            businessSector: "",
            businessName: "",
            secondaryPhone: "",
            businessAddress: "",
            businessEmailAddress: "",
            city: "",
            lga: "",
            state: "",
            cacDocument: undefined,
            validId: null,
            signature: null,
            utilityBill: null,
            passportPhoto: null,
            debitCard: false,
            acceptTerms: false,
        }
    });

    const onSubmit = async (data: FormData) => {
        console.log("I am here")
        const payload = posAccountMapper(data, bvnData.bvn)
        const apiResponse = await createPosMerchantAccount(payload)
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
            setAccountNumber(apiResponse.data.accountNumber)
        }
    };

    return (
        <div className="relative">
            <TopBar showArrow={true} description={`Merchant Account / POS Merchant`} />
            <div className="pt-28">
                <StepProgress
                    steps={["BVN Verification", "Business Details", "Upload Documents"]}
                    activeStep={activeStep}
                />
            </div>

            <div className="p-6 md:px-30">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Accordion onChangeStep={(activeStep) => { setActiveStep(activeStep + 1) }}>
                        <AccordionItem title="Account Details">
                            <div className="bg-gray-200 px-3 md:px-6 pt-4 grid grid-cols-1 md:grid-cols-3 gap-y-2 pb-4 border-b border-gray-300 rounded-b md:rounded-b-xl">
                                <DetailsLabel title="BVN" value={bvnData?.bvn} />
                                <DetailsLabel title="NIN" value={bvnData?.nin} />
                                <DetailsLabel title="Gender" value={bvnData?.gender} />
                                <DetailsLabel title="Firstname" value={bvnData?.firstName} />
                                <DetailsLabel title="Middlename" value={bvnData?.middleName} />
                                <DetailsLabel title="Lastname" value={bvnData?.lastName} />
                                <DetailsLabel title="Primary Phone" value={bvnData?.phoneNumber} />
                                <DetailsLabel title="Date of Birth" value={bvnData?.dateOfBirth?.split("T")[0] || ""} />
                                <DetailsLabel title="Address" value={bvnData?.address} />
                                <DetailsLabel title="Email Address" value={bvnData?.emailAddress} />
                            </div>
                            <div className="m-4 bg-gray-100 p-3 md:w-1/2 overflow-hidden text-sm md:text-md  rounded">
                                <div className="grid md:flex items-center gap-2 md:gap-4">
                                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                        <p className="font-bold">Did you have a CAC Registered Business? </p>
                                        {/* <div className="flex gap-3 md:ml-6">   
                                        <PrimaryButton>Yes</PrimaryButton>
                                        <PrimaryButton variant="secondary">No</PrimaryButton>
                                    </div> */}
                                    </div>
                                    <label className="flex items-center bg-gray-200 gap-2 md:gap-4 w-25 md:w-30 px-4 py-1 cursor-pointer text-xs font-bold rounded text-black/70">
                                        <Upload width={15}></Upload> Upload
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={handleCacUpload}
                                        />
                                    </label>

                                </div>
                                <span className="text-primary italic font-bold">{cacFileName}</span>

                            </div>
                            <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Controller
                                    name="businessSector"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Business Sector"
                                            inputError={errors.businessSector?.message} />
                                    )}
                                />
                                <Controller
                                    name="businessName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Merchant / Business Name"
                                            inputError={errors.businessName?.message} />
                                    )}
                                />
                                <Controller
                                    name="businessAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Business Address"
                                            inputError={errors.businessAddress?.message} />
                                    )}
                                />
                                <Controller
                                    name="secondaryPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            required
                                            labelName="Secondary Phone Number"
                                            inputError={errors.secondaryPhone?.message} />
                                    )}
                                />

                                <Controller name="businessEmailAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Business Email Address"
                                            inputError={errors.businessEmailAddress?.message} />
                                    )} />
                                <Controller name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="City"
                                            inputError={errors.city?.message} />
                                    )} />
                                <Controller name="lga"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Local Government Area"
                                            inputError={errors.lga?.message} />
                                    )} />

                                <Controller name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="State of Residence"
                                            inputError={errors.state?.message} />
                                    )} />

                            </div>
                        </AccordionItem>

                        <AccordionItem title="Upload Documents">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 gap-6 md:gap-12 p-4 md:p-8">
                                <Controller
                                    name="validId"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUploadInput
                                            required
                                            inputError={errors.validId?.message}
                                            description="Upload a copy of your National ID, Driver’s License, or International Passport"
                                            {...field} labelName="Valid ID Document" onFileChange={(file) => field.onChange(file)} />
                                    )}
                                />
                                <Controller
                                    name="signature"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUploadInput {...field}
                                            required
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
                                            inputError={errors.utilityBill?.message}
                                            description="Upload a copy of your LAWMA Bill, or Task Force or Network"
                                            labelName="Utility Bill" onFileChange={(file) => field.onChange(file)} />
                                    )}
                                />
                                <Controller
                                    name="passportPhoto"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUploadInput {...field}
                                            required
                                            inputError={errors.passportPhoto?.message}
                                            description="Upload a copy of your passport photograph"
                                            labelName="Passport" onFileChange={(file) => field.onChange(file)} />
                                    )}
                                />

                            </div>
                        </AccordionItem>
                    </Accordion>



                    <div className="py-6 gap-4 grid">
                        <Controller
                            name="debitCard"
                            control={control}
                            rules={{ validate: value => value === true || "Please select an option" }}
                            render={({ field, fieldState }) => (
                                <RadioButton
                                    label="Want a Debit Card?"
                                    infoText="Regulatory fee applies for Card issuance"
                                    checked={field.value || false}
                                    onChange={field.onChange}
                                    name="debitCard"
                                    error={fieldState.error?.message || null}
                                />
                            )}
                        />

                        <Controller
                            name="acceptTerms"
                            control={control}
                            rules={{ validate: value => value === true || "You must accept the terms" }}
                            render={({ field, fieldState }) => (
                                <RadioButton
                                    label={
                                        <span>
                                            I agree to{" "}
                                            <a href="/terms" className="text-primary font-bold">
                                                Terms and Conditions
                                            </a>
                                        </span>
                                    }
                                    checked={field.value || false}
                                    onChange={field.onChange}
                                    name="acceptTerms"
                                    error={fieldState.error?.message || null}
                                />
                            )}
                        />
                    </div>
                    <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                </form>
            </div>
            <Modal isVisible={successModal}
                onClose={() => router.replace("/")}
                size="md"
                type="center"
                cancelIcon={true}
                title="">
                <AccountSuccess url="https://ibs.imperialmortgagebank.com/login" accountNumber={accountNumber} />
            </Modal>
        </div>
    );
}

export default POSMerchantAccount;