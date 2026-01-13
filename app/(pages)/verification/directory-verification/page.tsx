"use client";
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import { cryptoHelper } from "@/app/utils/reUsableFunction";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { BankAccountReferencePayload, bankAccountReferenceSchema } from "@/app/utils/validationSchema/bankAccountReferenceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";


const DirectoryVerification = () => {
    const param = useSearchParams();
    const { loading } = useApiEndPoints();
    const directoryId = cryptoHelper.decrypt(param.get("id"));
    const businessTypeId = cryptoHelper.decrypt(param.get("cmTy"));
    const directoryName = cryptoHelper.decrypt(param.get("na"));
    const businessName = cryptoHelper.decrypt(param.get("buNa"));


    const { control, handleSubmit, formState: { errors } } = useForm<BankAccountReferencePayload>({
        resolver: zodResolver(bankAccountReferenceSchema),
        defaultValues: {
            referee1Name: "",
            referee1Email: "",
            referee1Mobile: "",
            referee1Phone: "",
            referee2Name: "",
            referee2Email: "",
            referee2Mobile: "",
            referee2Phone: "",
        }
    });
    const onSubmit = async (data: BankAccountReferencePayload) => {
        const payloadData = ({
            account_type_id: Number(accountTypeId),
            account_number: accountNumber,
            account_name: accountName,
            ...data,
        });
        // const apiResponse = await addBankAccountReference(payloadData);
        // if (apiResponse.statusCode === 200) {
        //     setSuccessModal(true)
        // }
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
                <form>
                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 text-lg"> Name: <span className="font-bold">{directoryName}</span></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 px-0 md:px-8 pt-4 pb-10 md:gap-x-20 gap-y-5 md:gap-y-10">
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a valid identification document"
                                        inputError={errors.signature?.message}
                                        labelName="Valid ID" onFileChange={(file) => field.onChange(file)} />
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
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your passport photograph"
                                        inputError={errors.signature?.message}
                                        labelName="Passport Photograph" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                           
                           

                        </div>
                    </div>
              
                    <div className="py-8">

                        <PrimaryButton type="submit" loading={loading} >Submit</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DirectoryVerification;