"use client";
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
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { email } from "zod";

const CorporateAccount = () => {
    useAccountGuard();
    const router = useRouter();
    const param = useSearchParams();
    const accountData = JSON.parse(atob(param.get("account") || ""));
    const { createCorporateAccount, loading } = useApiEndPoints();
    const [successModal, setSuccessModal] = React.useState(false);
    const [accountNumber, setAccountNumber] = React.useState("");
    const bvnData = getFromLocalStorage("bvnData");
    const [activeStep, setActiveStep] = React.useState(3);


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

    const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(CorporateAccountSchema),
        defaultValues: {
            companyName: "",
            registrationNumber: "",
            companyType: "",
            signatories: "",
            tin: "",
            address: "",
            secondaryPhone: "",
            businessEmailAddress: "",
            city: "",
            lga: "",
            state: "",
            accountOfficer: "",
            director: [{ lastname: "", firstname: "", bvn: "", nin: "", emailAddress: "", phoneNumber: "" }],
            debitCard: false,
            acceptTerms: false,
            signatory: [{ name: "", validId: null, signature: null, utilityBill: null, passportPhoto: null }]
        }
    });
    const selectedCompanyType = watch("companyType");
    const selectedSignatoriesCount = watch("signatories");

    React.useEffect(() => {
        if (!selectedCompanyType) return;
        const requiredCount = directorCountMap[selectedCompanyType] ?? 0;
        const currentLength = fields.length;

        if (requiredCount > currentLength) {
            for (let i = 0; i < requiredCount - currentLength; i++) {
                append({ lastname: "", firstname: "", bvn: "", nin: "", emailAddress: "", phoneNumber: "" });
            }
        } else if (requiredCount < currentLength) {
            for (let i = 0; i < currentLength - requiredCount; i++) {
                remove(fields.length - 1 - i);
            }
        }
    }, [selectedCompanyType]);

    React.useEffect(() => {
        if (!selectedSignatoriesCount) {
            removeSignatory();
            return;
        }

        const requiredCount = Number(selectedSignatoriesCount);
        const currentCount = signatoryFields.length;

        if (requiredCount > currentCount) {
            for (let i = 0; i < requiredCount - currentCount; i++) {
                appendSignatory({
                    name: "",
                    emailAddress: "",
                    phoneNumber: "",
                    bvn: "",
                    nin: "",
                });
            }
        } else if (requiredCount < currentCount) {
            for (let i = 0; i < currentCount - requiredCount; i++) {
                removeSignatory(signatoryFields.length - 1 - i);
            }
        }
    }, [selectedSignatoriesCount]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "director",
    });

    const { fields: signatoryFields, append: appendSignatory, remove: removeSignatory } = useFieldArray({
        control,
        name: "signatory",
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
                    steps={["BVN Verification", "Account Type", "Business Details"]}
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
                                                { label: "Limited Partnership", value: "1" },
                                                { label: "Incorporated Trustee", value: "4" },
                                                { label: "Unlimited Company", value: "2" },
                                                { label: "Public Company (PLC)", value: "3" },
                                                { label: "Registered Business Name", value: "8" },
                                                { label: "Limited Liability Company(LTD)", value: "7" },
                                                { label: "Limited Liability Partnership", value: "6" },
                                                { label: "Company Limited by Guarantee(LTD/GTEE)", value: "" },
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
                                            inputError={errors.address?.message} />
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

                                <Controller name="accountOfficer"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Account Officer / Referrer"
                                            inputError={errors.accountOfficer?.message} />
                                    )} />
                                <Controller
                                    name="signatories"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            required
                                            labelName="Signatories"
                                            inputError={errors.signatories?.message}
                                            options={[
                                                { label: "1", value: "1" },
                                                { label: "2", value: "2" },
                                            ]} />
                                    )}
                                />

                            </div>
                            {selectedCompanyType && (
                                <div className="">
                                    <h3 className="font-bold px-4">Director Information</h3>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="px-4 pb-4 pt-2 rounded grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
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
                                                name={`director.${index}.emailAddress`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field}
                                                        required
                                                        type="text"
                                                        labelName={`Director ${index + 1} Email Address`}
                                                        inputError={errors.director?.[index]?.bvn?.message} />
                                                )}
                                            />
                                            <Controller
                                                name={`director.${index}.phoneNumber`}
                                                control={control}
                                                render={({ field }) => (
                                                    <PhoneNumberInput {...field}
                                                        required
                                                        type="text"
                                                        labelName={`Director ${index + 1} Phone Number`}
                                                        inputError={errors.director?.[index]?.bvn?.message} />
                                                )}
                                            />

                                            <Controller
                                                name={`director.${index}.bvn`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field}
                                                        
                                                        type="number"
                                                        labelName={`Director ${index + 1} BVN`}
                                                        inputError={errors.director?.[index]?.bvn?.message} />
                                                )}
                                            />
                                            <Controller
                                                name={`director.${index}.nin`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field}
                                                        
                                                        type="number"
                                                        labelName={`Director ${index + 1} NIN`}
                                                        inputError={errors.director?.[index]?.bvn?.message} />
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedSignatoriesCount && (
                                <div className="">
                                    <h3 className="font-bold px-4">Signatory Information</h3>

                                    {signatoryFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="px-4 pb-4 pt-2 rounded grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5"
                                        >
                                            <Controller
                                                name={`signatory.${index}.name`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        required
                                                        labelName={`Signatory ${index + 1} Full Name`}
                                                        inputError={errors.signatory?.[index]?.name?.message}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`signatory.${index}.emailAddress`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        required
                                                        labelName={`Signatory ${index + 1} Email Address`}
                                                        inputError={errors.signatory?.[index]?.emailAddress?.message}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`signatory.${index}.phoneNumber`}
                                                control={control}
                                                render={({ field }) => (
                                                    <PhoneNumberInput
                                                        {...field}
                                                        required
                                                        labelName={`Signatory ${index + 1} Phone Number`}
                                                        inputError={errors.signatory?.[index]?.phoneNumber?.message}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`signatory.${index}.bvn`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        labelName={`Signatory ${index + 1} BVN`}
                                                        inputError={errors.signatory?.[index]?.bvn?.message}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name={`signatory.${index}.nin`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        labelName={`Signatory ${index + 1} NIN`}
                                                        inputError={errors.signatory?.[index]?.nin?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
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