"use client";
import DynamicSignatories from "@/app/(pages)/accounts/corporate/dynamicSignatories";
import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import { useAccountGuard } from "@/app/components/types/accountGuard";
import { Accordion, AccordionItem } from "@/app/components/ui/accordion";
import AccountSuccess from "@/app/components/ui/accountSuccess";
import DetailsLabel from "@/app/components/ui/detailsLabel";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import RadioButton from "@/app/components/ui/radioButton";
import Select from "@/app/components/ui/selectInput";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { corporateAccountMapper } from "@/app/utils/mapper/corporateAccount";
import { clearAppState, getFromLocalStorage } from "@/app/utils/reUsableFunction";
import { CorporateAccountSchema } from "@/app/utils/validationSchema/corporateAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const CorporateAccount = () => {
    useAccountGuard();
    const router = useRouter();
    const param = useSearchParams();
    const accountData = JSON.parse(atob(param.get("account") || ""));
    const { createCorporateAccount, loading } = useApiEndPoints();
    const [successModal, setSuccessModal] = React.useState(true);
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

    const directorCountMap: Record<string, number> = {
        "Limited Partnership": 2,
        "Incorporated Trustee": 2,
        "Unlimited Company": 1,
        "Public Company": 2,
        "Registered Business Name": 1,
        "Limited Liability Company": 2,
        "Limited Liability Partnership": 2,
        "Company Limited by Guarantee": 1,
    };

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(CorporateAccountSchema),
        defaultValues: {
            companyName: "",
            registrationNumber: "",
            companyType: "",
            tin: "",
            address: "",
            secondaryPhone: "",
            businessEmailAddress: "",
            city: "",
            lga: "",
            state: "",
            // referee1Name: "",
            // referee1Email: "",
            // referee1Mobile: "",
            // referee1Phone: "",
            // referee2Name: "",
            // referee2Email: "",
            // referee2Mobile: "",
            accountOfficer: "",
            cacDocument: undefined,
            director: [{ lastname: "", firstname: "", bvn: "" }],
            debitCard: false,
            acceptTerms: false,
            signatory: [{ name: "", validId: null, signature: null, utilityBill: null, passportPhoto: null }]
        }
    });
    const selectedCompanyType = watch("companyType");
    React.useEffect(() => {
        if (!selectedCompanyType) return;
        const requiredCount = directorCountMap[selectedCompanyType] ?? 0;
        const currentLength = fields.length;

        if (requiredCount > currentLength) {
            for (let i = 0; i < requiredCount - currentLength; i++) {
                append({ lastname: "", firstname: "", bvn: "" });
            }
        } else if (requiredCount < currentLength) {
            for (let i = 0; i < currentLength - requiredCount; i++) {
                remove(fields.length - 1 - i);
            }
        }
    }, [selectedCompanyType]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "director",
    });

    const onSubmit = async (data: FormData) => {
        const payload = corporateAccountMapper(data, bvnData.bvn, accountData.id);
        const apiResponse = await createCorporateAccount(payload);
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true);
            setAccountNumber(apiResponse.data.accountNumber);
        }
    };

    return (
        <div className="relative">
            <TopBar showArrow={true} description={`${accountData?.category}  Account`} />
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
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Company Name"
                                            inputError={errors.companyName?.message} />
                                    )}
                                />
                                <Controller
                                    name="registrationNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Company Registration Number"
                                            inputError={errors.businessName?.message} />
                                    )}
                                />
                                <Controller
                                    name="companyType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            required
                                            labelName="Company Type / Business Type"
                                            inputError={errors.companyType?.message}
                                            options={[
                                                { label: "Limited Partnership", value: "Limited Partnership" },
                                                { label: "Incorporated Trustee", value: "Incorporated Trustee" },
                                                { label: "Unlimited Company", value: "Unlimited Company" },
                                                { label: "Public Company (PLC)", value: "Public Company" },
                                                { label: "Registered Business Name", value: "Registered Business Name" },
                                                { label: "Limited Liability Company(LTD)", value: "Limited Liability Company" },
                                                { label: "Limited Liability Partnership", value: "Limited Liability Partnership" },
                                                { label: "Company Limited by Guarantee(LTD/GTEE)", value: "Company Limited by Guarantee" },
                                            ]} />
                                    )}
                                />
                                <Controller
                                    name="tin"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Tax Identification Number (TIN)"
                                            inputError={errors.tin?.message} />
                                    )}
                                />
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Business Address"
                                            inputError={errors.companyType?.message} />
                                    )}
                                />
                                <Controller
                                    name="secondaryPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            required
                                            labelName="Business Phone Number"
                                            inputError={errors.secondaryPhone?.message} />
                                    )}
                                />

                                <Controller name="businessEmailAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
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
                                {/* <Controller name="referee1Name"
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

                                <Controller
                                    name="referee1Phone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            labelName="Referee 1 Phone Number"
                                            inputError={errors.referee1Phone?.message} />
                                    )}
                                />
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
                                /> */}

                                <Controller name="accountOfficer"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Account Officer / Referrer"
                                            inputError={errors.accountOfficer?.message} />
                                    )} />

                            </div>
                            <div className="">
                                <h3 className="font-bold px-4">Director Information</h3>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="px-4 pb-4 pt-2 rounded grid grid-cols-1 md:grid-cols-3 gap-x-8">
                                        <Controller
                                            name={`director.${index}.lastname`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    labelName={`Director ${index + 1} Lastname`}
                                                    inputError={errors.director?.[index]?.lastname?.message} />
                                            )}
                                        />

                                        <Controller
                                            name={`director.${index}.firstname`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    labelName={`Director ${index + 1} Firstname`}
                                                    inputError={errors.director?.[index]?.firstname?.message} />
                                            )}
                                        />

                                        <Controller
                                            name={`director.${index}.bvn`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field}
                                                    required
                                                    type="number"
                                                    labelName={`Director ${index + 1} BVN`}
                                                    inputError={errors.director?.[index]?.bvn?.message} />
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>

                        <AccordionItem title="Upload Documents">
                            <DynamicSignatories control={control} errors={errors} />
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
                onClose={() => { router.replace("/"); clearAppState() }}
                size="md"
                type="center"
                cancelIcon={true}
                title="">
                <AccountSuccess url="https://corporate.imperialmortgagebank.com/?nav_source=ibs" accountNumber={accountNumber} />
            </Modal>
        </div>
    );
}

export default CorporateAccount;