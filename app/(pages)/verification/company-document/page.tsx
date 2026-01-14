"use client";
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import { cryptoHelper } from "@/app/utils/reUsableFunction";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/ui/input";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { useMemo, useState } from "react";
import { ACCOUNT_TYPE_DOCUMENTS, buildCompanyDocumentSchema, CompanyDocumentPayload, DOCUMENT_META } from "@/app/utils/validationSchema/companyDocumentSchema";
import { companyDocumentMapper } from "@/app/utils/mapper/companyDocumentMapper";
import Modal from "@/app/components/ui/modal";
import Image from "next/image";


const CompanyDocument = () => {
    const param = useSearchParams();
    const router = useRouter();
    const [successModal, setSuccessModal] = useState(false);
    const { loading, businessDocumentSubmission } = useApiEndPoints();
    const accountNumber = cryptoHelper.decrypt(param.get("acc"));
    const accountTypeId = Number(cryptoHelper.decrypt(param.get("ty")) ?? 0);
    const businessName = cryptoHelper.decrypt(param.get("bsNa"));

    const schema = useMemo(
        () => buildCompanyDocumentSchema(accountTypeId),
        [accountTypeId]
    );

    const { control, handleSubmit, formState: { errors }, } = useForm<CompanyDocumentPayload>({
        resolver: zodResolver(schema),
        defaultValues: {
            referee1Name: "",
            referee1Email: "",
            referee1Mobile: "",
            referee2Name: "",
            referee2Email: "",
            referee2Mobile: "",
        }
    });

    const requiredDocs = ACCOUNT_TYPE_DOCUMENTS[accountTypeId] || [];
    const onSubmit = async (data: CompanyDocumentPayload) => {
        Object.keys(DOCUMENT_META).forEach((doc) => {
            if (!requiredDocs.includes(doc)) {
                data[doc as keyof CompanyDocumentPayload] = null;
            }
        });

        const payload = companyDocumentMapper(data, accountNumber);
        const apiResponse = await businessDocumentSubmission(payload);
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" headerType="corporate" />

            <div className="text-center items-center pt-22 p-6 md:px-14 justify-center">
                <p className="text-primary font-bold text-lg md:text-2xl">Corporate Account Documents Upload</p>
                <p className="md:w-1/2 mx-auto sm:px-25 text-sm">
                    <span className="opacity-60">Upload valid document to complete registration of corporate account for </span>
                    <span className="font-bold text-black">{businessName}</span>
                    <span className="opacity-60"> with account number </span>
                    <span className="font-bold text-black">{accountNumber}</span></p>
            </div>

            <div className="px-5 md:px-40 py-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 font-bold text-lg">Company Documents</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 px-0 md:px-8 pt-4 pb-10 md:gap-x-20 gap-y-5 md:gap-y-10">
                            {requiredDocs.map((doc) => (
                                <Controller
                                    key={doc}
                                    name={doc as any}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <FileUploadInput
                                            {...field}
                                            required
                                            labelName={DOCUMENT_META[doc].label}
                                            description={DOCUMENT_META[doc].description}
                                            inputError={fieldState.error?.message}
                                            onFileChange={(file) => field.onChange(file)}
                                        />
                                    )}
                                />
                            ))}
                        </div>

                    </div>
                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 font-bold text-lg">Referee Information</p>
                        <div className="px-3 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Controller name="referee1Name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field}
                                        required
                                        labelName="Referee 1 Fullname"
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
                                        labelName="Referee 2 Fullname"
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

export default CompanyDocument;