"use client";
import TopBar from "@/app/components/navigation/topBar";
import FileUploadInput from "@/app/components/ui/fileUpload";
import { cryptoHelper } from "@/app/utils/reUsableFunction";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Input from "@/app/components/ui/input";
import PhoneNumberInput from "@/app/components/ui/phoneNumberInput";
import { BankAccountReferencePayload, bankAccountReferenceSchema } from "@/app/utils/validationSchema/bankAccountReferenceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";


const CompanyDocument = () => {
    const param = useSearchParams();
    const { loading } = useApiEndPoints();
    const accountNumber = cryptoHelper.decrypt(param.get("acc"));
    const accountTypeId = cryptoHelper.decrypt(param.get("ty"));
    const businessName = cryptoHelper.decrypt(param.get("bsNa"));


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
                <p className="text-primary font-bold text-lg md:text-2xl">Corporate Account Documents Upload</p>
                <p className="md:w-1/2 mx-auto sm:px-25 text-sm">
                    <span className="opacity-60">Upload valid document to complete registration of corporate account for </span>
                    <span className="font-bold text-black">{businessName}</span>
                    <span className="opacity-60"> with account number </span>
                    <span className="font-bold text-black">{accountNumber}</span></p>
            </div>

            <div className="px-5 md:px-40 py-5">
                <form>
                    <div className="border-y border-gray-300">
                        <p className="bg-secondary/70 p-3 font-bold text-lg">Company Documents</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 px-0 md:px-8 pt-4 pb-10 md:gap-x-20 gap-y-5 md:gap-y-10">
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your CAC Document"
                                        inputError={errors.signature?.message}
                                        labelName="CAC (Certificate of Incorporation)" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy MEMART"
                                        inputError={errors.signature?.message}
                                        labelName="Memorandum & Articles of Associan (MEMART)" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your CAC form CO2"
                                        inputError={errors.signature?.message}
                                        labelName="CAC form CO2 (Shareholders)" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your CAC Form CO7"
                                        inputError={errors.signature?.message}
                                        labelName="CAC Form CO7 (Directors)" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                              <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your Board Resolution authorizing account opening"
                                        inputError={errors.signature?.message}
                                        labelName="Board Resolution authorizing account Opening" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />
                              <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <FileUploadInput {...field}
                                        required
                                        fileType="image/jpeg,image/png"
                                        description="Upload a copy of your UBO Declaration Form"
                                        inputError={errors.signature?.message}
                                        labelName="UBO Declaration Form" onFileChange={(file) => field.onChange(file)} />
                                )}
                            />

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
        </div>
    );
}

export default CompanyDocument;