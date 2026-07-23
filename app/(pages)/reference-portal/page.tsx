"use client";
import FileUploadInput from "@/app/components/ui/fileUpload";
import Input from "@/app/components/ui/input";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { bankAccountReferenceSubmissionSchema } from "@/app/utils/validationSchema/bankAccountReferenceSubmissionSchema";
import { Dot, PenTool, RectangleEllipsis, ShieldAlert, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { referencePortalSubmissionSchema } from "@/app/utils/validationSchema/referencePortalSubmissionSchema";
import { referencePortalMapper } from "@/app/utils/mapper/referencePortalMapper";
import Select from "@/app/components/ui/selectInput";
import { BANKS } from "@/app/utils/Utility/bankList";
import { useState } from "react";
import Modal from "@/app/components/ui/modal";

const ReferencePortal = () => {
    const referenceGuidelines = [
        "Fill in the account holder's name exactly as registered with the bank.",
        "Provide accurate information about how long you have known the account holder.",
        "Your comments should be honest and based on personal knowledge.",
        "State your bank details clearly for verification purposes.",
        "Upload a clear image of your signature.",
        "Ensure all required fields are completed before submitting."
    ];

    const whatHappensNext = [
        "You submit the reference form with all required details.",
        "The bank receives and reviews your reference.",
        "The account holder is notified of the submission.",
        "The bank may contact you for verification if needed."
    ];

    type FormData = z.infer<typeof referencePortalSubmissionSchema>;
    const router = useRouter();
    const [successModal, setSuccessModal] = useState(false);
    const { loading, accountReferenceExtendedSubmission } = useApiEndPoints();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(referencePortalSubmissionSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            bankName: "",
            accountName: "",
            accountType: "",
            address: "",
            knownPeriod: "",
            comment: "",
            accountNumber: "",
            accountHolderNumber: "",
            accountHolderName: "",
            accountHolderEmailAddress: "",
            signature: null,
        }
    });
    const onSubmit = async (data: FormData) => {
        const payload = referencePortalMapper(data);
        const response = await accountReferenceExtendedSubmission(payload);
        if (response?.statusCode === 200) {
            setSuccessModal(true)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="p-4 md:px-14 flex items-center gap-4 md:gap-6 border-b border-gray-100 fixed bg-white  w-full z-50">
                <div className="flex gap-2 items-center">
                    <div className="cursor-pointer" onClick={() => router.replace('/')}>
                        <Image src="/images/imperialLogo.png" alt="Imperial Logo" width={40} height={40} className="w-10 h-10 " />
                    </div>
                    <div className="grid">
                        <h1 className="text-lg md:text-xl font-bold ">Customer Bank Reference Portal</h1>
                        <p className="text-sm text-gray-600 -mt-1">Imperial Homes Mortgage Bank Limited</p>
                    </div>
                </div>
            </div>
            <div className="grid lg:flex gap-6 lg:gap-8 mt-25 lg:mt-30 px-4 lg:px-40">
                <div className="w-full lg:w-[65%] border rounded-lg border-gray-200 p-4 lg:p-8 order-1 lg:order-0">
                    <p><span className="font-bold">To:</span> The Manager, Imperial Homes Mortgage Bank Limited.</p>
                    <p className="mt-2 font-semibold border-b border-gray-200 pb-4">Dear Sir,</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="flex gap-2 mt-8 items-center">
                                <User className="text-primary bg-primary/10 rounded-lg p-1" size={30} />
                                <p className="font-semibold text-primary uppercase">Account Holder Details</p>
                            </div>
                            <p className="mt-4 text-xs text-gray-600">NAME OF INDIVIDUAL(S) OPENING AN ACCOUNT</p>

                            <div className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-8 ">
                                <Controller name="accountHolderNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="accountHolderNumber"
                                            type="number"
                                            placeholder="e.g 00012345678"
                                            required
                                            labelName="Account Holder Number"
                                            inputError={errors.accountHolderNumber?.message} />
                                    )} />


                                <Controller name="accountHolderName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="accountHolderName"
                                            type="text"
                                            placeholder="e.g John Doe"
                                            required
                                            labelName="Account Holder Name"
                                            inputError={errors.accountHolderName?.message} />
                                    )} />
                                <Controller name="accountHolderEmailAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="accountHolderEmailAddress"
                                            type="email"
                                            placeholder="e.g johndoe@xyz.com"
                                            labelName="Account Holder Email"
                                            inputError={errors.accountHolderEmailAddress?.message} />
                                    )} />

                            </div>
                        </div>

                        <div>
                            <div className="flex gap-2 mt-8 items-center">
                                <RectangleEllipsis className="text-primary bg-primary/10 rounded-lg p-1" size={30} />
                                <p className="font-semibold text-primary uppercase">Relationship & Suitability</p>
                            </div>

                            <div className="grid gap-4 mt-4">

                                <Controller name="knownPeriod"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            required
                                            placeholder="e.g 5 years"
                                            labelName="How long have you known the account holder?"
                                            type="text"
                                            inputError={errors.knownPeriod?.message} />
                                    )} />
                                <Controller name="comment"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="comment"
                                            type="textarea"
                                            rows={3}
                                            placeholder="Comment on their sustainability for maintaining an account with Imperial Homes Mortgage Bank Limited"
                                            labelName="Suitability Comments"
                                            inputError={errors.comment?.message} />
                                    )} />
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-2 mt-8 items-center">
                                <RectangleEllipsis className="text-primary bg-primary/10 rounded-lg p-1" size={30} />
                                <p className="font-semibold text-primary uppercase">Referee's Bank Information</p>
                            </div>

                            <div className="my-4 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8 ">
                                <Controller name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="name"
                                            type="text"
                                            placeholder="e.g John Doe"
                                            required
                                            labelName="Names of Referee (Full Name)"
                                            inputError={errors.name?.message} />
                                    )} />

                                <Controller name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="email"
                                            type="text"
                                            placeholder="e.g johndoe@xyz.com"
                                            required
                                            labelName="Email of Referee"
                                            inputError={errors.email?.message} />
                                    )} />


                                <Controller name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="address"
                                            type="text"
                                            required
                                            placeholder="e.g 123 Main St, City, Country"
                                            labelName="Referee Address"
                                            inputError={errors.address?.message}
                                        />
                                    )} />

                                <Controller name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="mobile"
                                            type="text"
                                            placeholder="e.g 09012345678"
                                            required
                                            labelName="Referee Phone Number"
                                            inputError={errors.mobile?.message}
                                        />
                                    )} />


                                <Controller name="accountNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="accountNumber"
                                            type="number"
                                            placeholder="e.g 00012345678"
                                            required
                                            labelName="Referee Account Number"
                                            inputError={errors.accountNumber?.message}
                                        />
                                    )} />
                                <Controller name="accountName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field}
                                            name="accountName"
                                            type="text"
                                            placeholder="e.g John Name"
                                            required
                                            labelName="Referee Account Name"
                                            inputError={errors.accountName?.message}
                                        />
                                    )} />
                                <Controller name="accountType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field}
                                            required
                                            labelName="Referee Account Type"
                                            inputError={errors.accountType?.message}
                                            options={[
                                                { label: "Current", value: "Current Account" },
                                                { label: "Corporate", value: "Corporate Account" }
                                            ]} />
                                    )} />
                                <Controller name="bankName"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            required
                                            labelName="Referee Bank Name"
                                            inputError={errors.bankName?.message}
                                            options={BANKS.map(s => ({
                                                label: s.label,
                                                value: s.value,
                                            }))}
                                        />
                                    )} />

                            </div>


                        </div>


                        <div>
                            <div className="flex gap-2 mt-8 items-center">
                                <PenTool className="text-primary bg-primary/10 rounded-lg p-1" size={30} />
                                <p className="font-semibold text-primary uppercase">Upload Signature</p>
                            </div>

                            <div className="grid gap-4 mt-4">
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
                        </div>

                        <div className="grid text-primary my-8 bg-primary/10 border border-primary rounded-lg p-4">
                            <p className="flex font-bold gap-2 lg:gap-4 items-center justify-center text-sm lg:text-base"><ShieldAlert className="text-destructive" /> "CAUTION"</p>
                            <p className="text-xs lg:text-sm uppercase justify-center flex pt-2 text-center">
                                It is very dangerous to introduce a person who is not well-known to you
                            </p>
                        </div>
                        <PrimaryButton type="submit" loading={loading}>Submit Reference Form</PrimaryButton>
                    </form>

                </div>
                <div className="w-full lg:w-[35%] order-0 lg:order-1">

                    <div className="border rounded-lg border-gray-200 p-4 lg:p-8">
                        <p className="font-semibold text-primary uppercase mb-4">Reference Form Guidelines</p>
                        <div>
                            {
                                referenceGuidelines.map((guideline, index) => (
                                    <p key={index} className="mb-3 text-sm text-gray-600 flex items-center">
                                        <Dot className="text-primary shrink-0 -ml-1.5" size={30} />
                                        {guideline}
                                    </p>
                                ))
                            }

                        </div>
                    </div>
                    <div className="border rounded-lg border-gray-200 p-4 lg:p-8 mt-8 hidden lg:block">
                        <p className="font-semibold text-primary uppercase mb-4">What Happens Next?</p>
                        <div>
                            {
                                whatHappensNext.map((info, index) => (
                                    <p className="mb-3 text-gray-600 flex text-sm ml-2" key={index}>
                                        <span className="text-white bg-primary rounded-full h-4 w-4 shrink-0 mr-2 mt-1 flex items-center justify-center text-xs leading-none">{index + 1}</span>
                                        {info}
                                    </p>

                                ))
                            }

                        </div>
                    </div>

                </div>
            </div>

            <Modal size="sm"
                title=""
                isVisible={successModal}
                cancelIcon={true}
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

        </div>
    );
}

export default ReferencePortal;
