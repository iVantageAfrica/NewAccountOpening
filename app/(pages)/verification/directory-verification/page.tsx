"use client";
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import { cryptoHelper } from "@/app/utils/reUsableFunction";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { directorySchema } from "@/app/utils/validationSchema/directorySchema";
import { directorySignatoryMapper } from "@/app/utils/mapper/directorySignatoryMapper";
import { useState } from "react";
import Modal from "@/app/components/ui/modal";
import Image from "next/image";
import { useRouter } from "next/navigation";


const DirectoryVerification = () => {
    const param = useSearchParams();
     const router = useRouter();
    const { loading, updateDirectorySignatorySubmission } = useApiEndPoints();
    const [successModal, setSuccessModal] = useState(false);
    const directoryId = cryptoHelper.decrypt(param.get("id"));
    const directoryName = cryptoHelper.decrypt(param.get("na"));
    const businessName = cryptoHelper.decrypt(param.get("buNa"));


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(directorySchema),
        defaultValues: {
            signature: null,
            valid_id: null,
            passport: null,
        }
    });
    const onSubmit = async (data: FormData) => {
        const payloadData = directorySignatoryMapper(data, directoryId, 'directory');
        const apiResponse = await updateDirectorySignatorySubmission(payloadData);
        if (apiResponse.statusCode === 200) {
            setSuccessModal(true)
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <TopBar showArrow={false} description="Finish Setting Up Your Account" headerType="corporate" />

            <div className="text-center items-center pt-22 p-6 md:px-14 justify-center">
                <p className="text-primary font-bold text-lg md:text-2xl">Corporate Account Directory Information</p>
                <p className="md:w-1/2 mx-auto sm:px-25 text-sm">
                    <span className="opacity-60">As one of the listed directory to </span>
                    <span className="font-bold text-black">{businessName} </span>
                    <span className="opacity-60">
                        account, please complete this form and upload the required documents to finalize the corporate account setup.
                    </span>
                </p>
            </div>

            <div className="px-5 md:px-40 py-5">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 text-lg"> Name: <span className="font-bold">{directoryName}</span></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 px-0 md:px-8 pt-4 pb-10 md:gap-x-20 gap-y-5 md:gap-y-10">
                            <Controller
                                name="valid_id"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType=".pdf,.jpg,.jpeg,.png,.docx"
                                        description="Upload a valid identification document"
                                        inputError={errors.valid_id?.message}
                                        labelName="Valid ID" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType=".pdf,.jpg,.jpeg,.png,.docx"
                                        description="Upload a copy of your signature"
                                        inputError={errors.signature?.message}
                                        labelName="Signature" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                            <Controller
                                name="passport"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType=".pdf,.jpg,.jpeg,.png,.docx"
                                        description="Upload a copy of your passport photograph"
                                        inputError={errors.passport?.message}
                                        labelName="Passport Photograph" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />



                        </div>
                    </div>

                    <div className="py-8">

                        <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                    </div>
                </form>

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
        </div>
    );
}

export default DirectoryVerification;