"use client"
import Input from "@/app/components/ui/input";
import PrimaryButton from "@/app/components/ui/primaryButton";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { LoginMapper } from "@/app/utils/mapper/login";
import { saveToLocalStorage } from "@/app/utils/reUsableFunction";
import { loginSchema, type LoginSchema } from "@/app/utils/validationSchema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const Authenticate = () => {
    const router = useRouter();
    const { loading, adminLogin } = useApiEndPoints();
    const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginSchema) => {
        const payload = LoginMapper(data);
        const apiResponse = await adminLogin(payload);
        if (apiResponse.statusCode === 200) {
            saveToLocalStorage("isAdministrative", true)
            saveToLocalStorage("bearerToken", apiResponse.data.token)
            saveToLocalStorage("adminDetails", apiResponse.data.adminInformation)
            router.push("/admin/customer")
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-full lg:w-[42%] px-6 md:px-10 ">
                <div className="flex items-center gap-4 md:gap-6 pt-8">
                    <div className="flex gap-2 items-center">
                        <div className="cursor-pointer" onClick={() => router.replace('/admin/auth')}>
                            <Image src="/images/imperialLogo.png" alt="Imperial Logo" width={40} height={40} className="w-10 h-10 " />
                        </div>
                        <div className="grid">
                            <h1 className="text-lg md:text-xl font-bold ">Account Opening</h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center h-full ">
                    <form className="w-full pt-10 mb-30" onSubmit={handleSubmit(onSubmit)}>
                        <p className="text-md font-bold text-2xl text-primary">Sign In.</p>
                        <p className="opacity-70 text-sm">
                            Provide your email and password to log in to the admin dashboard.
                        </p>

                        <div className="pt-10 gap-6 grid">
                            <Controller name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field}
                                        required
                                        labelName="Email Address"
                                        inputError={errors.email?.message} />
                                )} />
                            <Controller name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field}
                                        required
                                        type="password"
                                        labelName="Password"
                                        inputError={errors.password?.message} />
                                )} />
                        </div>

                        <div className="justify-end pt-4 flex">
                            <span className="text-black text-xs opacity-70 hover:cursor-pointer hover:opacity-100">
                                Forgot Password?
                            </span>
                        </div>

                        <div className="w-1/3 md:w-1/4">
                            <PrimaryButton type="submit" loading={loading}>Sign In</PrimaryButton>
                        </div>
                    </form>
                </div>

            </div>

            <div className="w-[58%] hidden md:flex bg-cover bg-center"
                style={{ backgroundImage: "url('/images/bg-doodle.jpg')" }}>

            </div>
        </div>
    );
};

export default Authenticate;