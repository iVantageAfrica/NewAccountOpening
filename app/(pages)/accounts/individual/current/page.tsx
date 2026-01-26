"use client";
import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import { useAccountGuard } from "@/app/components/types/accountGuard";
import { Accordion, AccordionItem } from "@/app/components/ui/accordion";
import AccountSuccess from "@/app/components/ui/accountSuccess";
import AgreementModals from "@/app/components/ui/agreementModal";
import DetailsLabel from "@/app/components/ui/detailsLabel";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Input from "@/app/components/ui/input";
import Modal from "@/app/components/ui/modal";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import RadioButton from "@/app/components/ui/radioButton";
import Select from "@/app/components/ui/selectInput";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { currentAccountMapper } from "@/app/utils/mapper/currentAccount";
import { getFromLocalStorage } from "@/app/utils/reUsableFunction";
import { currentAccountSchema } from "@/app/utils/validationSchema/currentAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";

const IndividualAccount = () => {
    useAccountGuard();
    const router = useRouter();
    const { createIndividualAccount, loading } = useApiEndPoints();
    const [successModal, setSuccessModal] = React.useState(false);
    const [accountNumber, setAccountNumber] = React.useState("");
    const bvnData =  getFromLocalStorage("bvnData");
    const [activeStep, setActiveStep] = React.useState(2);
        const [activeAgreementModal, setActiveAgreementModal] =
        React.useState<"indemnity" | "terms" | null>(null);
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(currentAccountSchema),
        defaultValues: {
            mothersMaidenName: "",
            secondaryPhone: "",
            phoneNumber: "",
            employmentStatus: "",
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
            nextOfKinPhone: "",
            validId: null,
            signature: null,
            utilityBill: null,
            passportPhoto: null,
            debitCard: false,
            acceptTerms: false,
            indemnityAgreement: false
        }
    });

    const onSubmit = async (data: FormData) => {
        const payload = currentAccountMapper(data, bvnData.bvn)
        const apiResponse = await createIndividualAccount(payload)
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
            setAccountNumber(apiResponse.data.accountNumber)
        }
    };

    return (
        <div className="relative">
            <TopBar showArrow={true} description={`Individual Account / Current`} />
            <div className="pt-28">
                <StepProgress
                    steps={["BVN Verification", "Account Information", "Upload Documents"]}
                    activeStep={activeStep}
                />
            </div>

            <div className="p-6 md:px-30">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Accordion onChangeStep={setActiveStep}>
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
                                  <Controller name="origin"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="State of Origin"
                                            inputError={errors.origin?.message} />
                                    )} />
                                <Controller name="lga"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="Local Government"
                                            inputError={errors.lga?.message} />
                                    )} />
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
                                <Controller name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            labelName="State"
                                            inputError={errors.state?.message} />
                                    )} />

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
                            </div>
                        </AccordionItem>

                        {/* <AccordionItem title="Bank Account Reference">
                            <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <Controller name="referee1Name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Referee 1 Name"
                                            inputError={errors.referee1Name?.message} />
                                    )} />
                                <Controller name="referee1Email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Referee 1 Email Address"
                                            inputError={errors.referee1Email?.message} />
                                    )} />
                                <Controller
                                    name="referee1Mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
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
                                            labelName="Referee 2 Name"
                                            inputError={errors.referee2Name?.message} />
                                    )} />
                                <Controller name="referee2Email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            labelName="Referee 2 Email Address"
                                            inputError={errors.referee2Email?.message} />
                                    )} />
                                <Controller
                                    name="referee2Mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            labelName="Referee 2 Mobile Number"
                                            inputError={errors.referee2Mobile?.message} />
                                    )}
                                />

                                <Controller
                                    name="referee2Phone"
                                    control={control}
                                    render={({ field }) => (
                                        <PhoneNumberInput {...field}
                                            labelName="Referee 2 Phone Number"
                                            inputError={errors.referee2Phone?.message} />
                                    )}
                                />
                            </div>
                        </AccordionItem> */}

                        <AccordionItem title="Upload Documents">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 gap-6 md:gap-12 p-4 md:p-8">
                                <Controller
                                    name="validId"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUploadInput
                                            required
                                            fileType=".pdf,.doc,.docx"
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
                                            fileType=".pdf,.doc,.docx"
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
                                            fileType="image/jpeg,image/png"
                                            inputError={errors.passportPhoto?.message}
                                            description="Upload a copy of your passport photograph"
                                            labelName="Passport Photograph" onFileChange={(file) => field.onChange(file)} />
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
                            name="indemnityAgreement"
                            control={control}
                            rules={{ validate: value => value === true || "You must agree to the indemnity agreement" }}
                            render={({ field, fieldState }) => (
                                <RadioButton
                                    label={
                                        <span>
                                            I agree to{" "}
                                            <span className="text-primary font-bold cursor-pointer " onClick={() => setActiveAgreementModal("indemnity")}>
                                                Indemnity Agreement
                                            </span>
                                        </span>
                                    }
                                    checked={field.value || false}
                                    infoText="Click to read the Indemnity Agreement"
                                    onChange={field.onChange}
                                    name="indemnityAgreement"
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
                                            <span className="text-primary font-bold cursor-pointer" onClick={() => setActiveAgreementModal("terms")}>
                                                Terms and Conditions
                                            </span>
                                        </span>
                                    }
                                    checked={field.value || false}
                                    infoText="Click to read the Terms and Agreement"
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

     <AgreementModals
                activeModal={activeAgreementModal}
                onClose={() => setActiveAgreementModal(null)}
            />
        </div>
    );
}

export default IndividualAccount;