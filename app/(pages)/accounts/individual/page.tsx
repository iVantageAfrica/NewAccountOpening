"use client";
import StepProgress from "@/app/components/navigation/stepProgress";
import TopBar from "@/app/components/navigation/topBar";
import { Accordion, AccordionItem } from "@/app/components/ui/accordion";
import DetailsLabel from "@/app/components/ui/detailsLabel";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Input from "@/app/components/ui/input";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import PrimaryButton from "@/app/components/ui/primaryButton";
import RadioButton from "@/app/components/ui/radioButton";
import Select from "@/app/components/ui/selectInput";
import { useRouter } from "next/navigation";
import React from "react";

const IndividualAccount = () => {
    const router = useRouter();
    const [country, setCountry] = React.useState("");  
    const [phone, setPhone] = React.useState("");
    const [activeStep, setActiveStep] = React.useState(1);
    const [acceptTerms, setAcceptTerms] = React.useState(false);
    const [debitCard, setDebitCard] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const handlePhoneChange = (value: string) => {
    setPhone(value);
  };
    return (
        <div className="relative">
            <TopBar showArrow={true} description={`Individual Account / Corporate`} />
            <div className="pt-28">
                <StepProgress
                    steps={["BVN Verification", "Bank Account Reference", "Upload Documents"]}
                    activeStep={activeStep}
                />
            </div>

            <div className="p-6 md:px-30">
                <Accordion onChangeStep={setActiveStep}>
                    <AccordionItem title="Account Details">
                        <div className="bg-gray-200 px-3 md:px-6 pt-4 grid grid-cols-1 md:grid-cols-3 gap-y-2 pb-4 border-b border-gray-300 rounded-b md:rounded-b-xl">
                            <DetailsLabel title="BVN" value="23456783344444" />
                            <DetailsLabel title="NIN" value="23456783344444" />
                            <DetailsLabel title="Gender" value="Female" />
                            <DetailsLabel title="Firstname" value="Faniyi" />
                            <DetailsLabel title="Middlename" value="Oluwapelumi" />
                            <DetailsLabel title="Lastname" value="Nurudeen" />
                            <DetailsLabel title="Primary Phone" value="2348123456790" />
                            <DetailsLabel title="Date of Birth" value="20-08-2023" />
                            <DetailsLabel title="Address" value="No 20 Bishop Huges Alakia Ishola" />
                            <DetailsLabel title="Email Address" value="IFANIYIOLUWAPELUMI@GMAIL.COM" />
                        </div>
                        <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Mother's Maiden Name" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Secondary Phone" />
                            <PhoneNumberInput
                                name="phone"
                                labelName="Phone Number"
                                required
                                inputError={phone.length < 8 ? "Invalid phone number" : null}
                                onChange={handlePhoneChange}
                            />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Employment Status" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Marital Status" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="House Number" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Street" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="City" />
                            <Select
                                labelName="Country"
                                name="country"
                                required
                                options={[
                                    { label: "Nigeria", value: "NG" },
                                    { label: "Ghana", value: "GH" },
                                    { label: "Kenya", value: "KE" },
                                ]}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Name of Next of Kin" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Next of Kin Address" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Relationship of Next of Kin" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Phone Number of Next of Kin" />
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Bank Account Reference">
                        <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 1 Name" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 1 Email Address" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 1 Mobile Number" />
                            <Input
                                name="bvn"
                                type="text"
                                labelName="Referee 1 Phone Number" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 2 Name" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 2 Email Address" />
                            <Input
                                name="bvn"
                                required
                                type="text"
                                labelName="Referee 2 Mobile Number" />
                            <Input
                                name="bvn"
                                type="text"
                                labelName="Referee 2 Phone Number" />
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Upload Documents">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:px-8 gap-6 md:gap-12 p-4 md:p-8">
                            <FileUploadInput
                                labelName="Valid ID Document"
                                description="Upload a copy of your National ID, Driver’s License, or International Passport"
                                required
                                onFileChange={setFile}
                            />
                            <FileUploadInput
                                labelName="Signature"
                                description="Upload a copy of your National ID, Driver’s License, or International Passport"
                                required
                                onFileChange={setFile}
                            />
                            <FileUploadInput
                                labelName="Utility Bill"
                                description="Upload a copy of your National ID, Driver’s License, or International Passport"
                                required
                                onFileChange={setFile}
                            />
                            <FileUploadInput
                                labelName="Passport Photograph"
                                description="Upload a copy of your National ID, Driver’s License, or International Passport"
                                required
                                onFileChange={setFile}
                            />
                        </div>
                    </AccordionItem>
                </Accordion>


                <div className="py-6 gap-4 grid">
                    <RadioButton
                        label="Want a Debit Card?"
                        name="debitCard"
                        value="false"
                        checked={debitCard}
                        infoText="Regulatory fee applies for Card issuance"
                        onChange={() => setDebitCard(!debitCard)}
                    />
                    <RadioButton
                        label={
                            <>
                                I agree to {" "}
                                <a
                                    href="/terms"
                                    target="_blank"
                                    className="text-primary font-bold hover:text-primary/80"
                                >
                                    Terms and Conditions
                                </a>
                            </>
                        }
                        name="terms"
                        value="agree"
                        checked={acceptTerms}
                        onChange={() => setAcceptTerms(!acceptTerms)}
                    />
                </div>
                <PrimaryButton onClick={() => router.back()} >Submit</PrimaryButton>
            </div>

            <div>

            </div>
        </div>
    );
}

export default IndividualAccount;