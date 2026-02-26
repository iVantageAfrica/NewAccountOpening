"use client";
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import { cryptoHelper } from "@/app/utils/Utility/reUsableFunction";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { directorySignatoryMapper } from "@/app/utils/mapper/directorySignatoryMapper";
import { Suspense, useState } from "react";
import { alwaysRequiredFields, directorySignatorySchema, getSignatoryFields } from "@/app/utils/validationSchema/directorySignatorySchema";
import Modal from "@/app/components/ui/modal";
import Image from "next/image";
import z from "zod";


function SignatoryVerificationContent() {
     type FormData = z.infer<typeof directorySignatorySchema>;
    const param = useSearchParams();
    const router = useRouter();
    const { loading, updateDirectorySignatorySubmission } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const signatoryId = cryptoHelper.decrypt(param.get("id")) ?? "";
    const businessTypeId = cryptoHelper.decrypt(param.get("cmTy")) ?? "";
    const signatoryName = cryptoHelper.decrypt(param.get("na"));
    const businessName = cryptoHelper.decrypt(param.get("buNa"));
    const allFields = getSignatoryFields(businessTypeId);


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(directorySignatorySchema),
        defaultValues: {
            signature: null,
            proof_of_address: null,
            passport: null,
        }
    });
    const onSubmit = async (data: FormData) => {
        const payloadData = directorySignatoryMapper(data, signatoryId, 'signatory');
        const apiResponse = await updateDirectorySignatorySubmission(payloadData);
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" headerType="corporate" />

            <div className="text-center items-center pt-22 p-6 md:px-14 justify-center">
                <p className="text-primary font-bold text-lg md:text-2xl">Account Signatory Information</p>
                <p className="md:w-1/2 mx-auto sm:px-25 text-sm">
                    <span className="opacity-60">As an authorized signatory of </span>
                    <span className="font-bold text-black">{businessName}</span>
                    <span className="opacity-60">
                        , please complete this form and upload the required documents to finalize the corporate account setup.
                    </span>
                </p>
            </div>

            <div className="px-5 md:px-40 py-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 text-lg">Signatory Name: <span className="font-bold">{signatoryName}</span></p>
            

                        <div className="grid grid-cols-1 md:grid-cols-2 px-0 md:px-8 pt-4 pb-10 md:gap-x-20 gap-y-5 md:gap-y-10">
                            {allFields.map(field => (
                                <Controller
                                    key={field.name}
                                    name={field.name as keyof FormData}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <FileUploadInput
                                            {...controllerField}
                                            required={alwaysRequiredFields.some(f => f.name === field.name)}
                                            fileType=".pdf,.jpg,.jpeg,.png,.docx"
                                            description={field.description}
                                            inputError={errors[field.name as keyof FormData]?.message}
                                            labelName={field.label}
                                            onFileChange={(file) => controllerField.onChange(file)}
                                        />
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="py-8">

                        <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                    </div>
                </form>
            </div>

             <Modal size="sm"
                    title=""
                    isVisible={successModal}
                    type="center"
                    cancelIcon={false}
                    onClose={() => router.replace("/")}>
                    <div className="flex flex-col justify-center items-center">
                        <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
                        <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-6">Thank You!</p>

                        <div className="mx-6  flex items-center justify-center flex-col text-center">
                            <p className="text-black/50 md:text-[14px] pb-6"> Your information has been submitted successfully. We appreciate
                                your time and support. The bank will review the details provided.</p>

                        </div>


                    </div>
                </Modal>
        </div>
    );
}


export default function SignatoryVerification() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <SignatoryVerificationContent />
        </Suspense>
    );
}